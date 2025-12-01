import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
    private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  
  constructor() { }

  getExpenses(page: number = 1):Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/expenses?page=${page}`);
  }

  add(expense: any) {
    return this.http.post(`${this.apiUrl}/expenses`, expense);
  }

  getWeeklySummary():Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/expenses/summary`);
  }
  
  getHighestExpenseThisWeek():Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/expenses/highest-this-week`);
  }
  
  getMonthlyExpense(year: number):Observable<any> {
    return this.http.get<{ data: { monthlyExpenses: number[] } }>(`${environment.apiUrl}/expenses/monthly?year=${year}`);
  }
}
