import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MyListTask {
  myListTaskId: number;
  title: string;
  description?: string;
  time: string;
  priority: 'urgent' | 'medium' | 'low';
  isCompleted: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MyListService {
  private apiUrl = 'http://localhost:5142/api/mylist'; // adjust if needed

  constructor(private http: HttpClient) {}

 /* getTasks(): Observable<MyListTask[]> {
    return this.http.get<MyListTask[]>(this.apiUrl);
  }*/


    getTasks(): Observable<MyListTask[]> {
  // 1. Grab the token (make sure the key matches what you use in AuthService)
  const token = localStorage.getItem('token'); 

  // 2. Create headers
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  // 3. Pass headers in the request
  return this.http.get<MyListTask[]>('http://localhost:5142/api/mylist', { headers });
}
  addTask(task: Partial<MyListTask>): Observable<MyListTask> {
    return this.http.post<MyListTask>(this.apiUrl, task);
  }

  updateTask(task: MyListTask): Observable<MyListTask> {
    return this.http.put<MyListTask>(`${this.apiUrl}/${task.myListTaskId}`, task);
  }

  deleteTask(myListTaskId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${myListTaskId}`);
  }
}