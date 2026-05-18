import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface TopCategory {
  categoria: string;
  probabilidad: number;
}

export interface ClasificarResponse {
  categoria: string;
  confianza: number;
  top3: TopCategory[];
}

export interface AnomaliaResponse {
  esAnomalo: boolean;
  score: number;
  razon: string;
}

export interface PrediccionResponse {
  montoEstimado: number;
  intervaloConfianza: [number, number];
}

@Injectable({
  providedIn: 'root'
})
export class GastosIAService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() { }

  /**
   * Clasifica automáticamente un gasto según su descripción y monto en caliente.
   */
  clasificarGasto(description: string, amount: number, date?: string): Observable<ClasificarResponse> {
    return this.http.post<ClasificarResponse>(`${this.apiUrl}/expenses/clasificar`, {
      description,
      amount,
      date
    });
  }

  /**
   * Evalúa en tiempo real si un gasto representa una anomalía (cargo sospechoso, duplicado, fuera de patrón).
   */
  detectarAnomalia(gasto: { description: string, amount: number, date?: string }): Observable<AnomaliaResponse> {
    return this.http.post<AnomaliaResponse>(`${this.apiUrl}/expenses/anomalia`, gasto);
  }

  /**
   * Consume la predicción del gasto del próximo mes calculada por el modelo predictivo.
   */
  predecirMes(userId: string, mesObjetivo: number): Observable<PrediccionResponse> {
    return this.http.get<PrediccionResponse>(`${this.apiUrl}/expenses/predecir-mes?userId=${userId}&mesObjetivo=${mesObjetivo}`);
  }
}
