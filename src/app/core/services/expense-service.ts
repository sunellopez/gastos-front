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

  getExpenses(page: number = 1, search?: string, filter?: string): Observable<any> {
    let url = `${this.apiUrl}/expenses?page=${page}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    if (filter && filter !== 'todos') {
      url += `&filter=${filter}`;
    }
    return this.http.get<any>(url);
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
