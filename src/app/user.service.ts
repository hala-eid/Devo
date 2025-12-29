import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  fullName?: string;
  email: string;
  password?: string; 
  jobTitle?: string;
  department?: string;
  reportTo?: string;
  phoneNumber?: string;
  organization?: string;
  location?: string;
  profilePhotoUrl?: string;
}
export interface UserProfile {
   employeeId: number;

}
export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:5121/api'; // CHANGE if your backend port is different

  constructor(private http: HttpClient) { }

  // ===============================
  // REGISTER (REAL DATABASE)
  // ===============================
  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  // ===============================
  // LOGIN (REAL DATABASE)
  // ===============================
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, {
      email,
      password
    });
  }

  // ===============================
  // GET PROFILE (DROPDOWN MENU)
  // ===============================
  /*getProfile(): Observable<User> {
    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      "Authorization": `Bearer ${token}`
    });

    return this.http.get<User>(`${this.apiUrl}/users/profile`, { headers });
  }*/

}
