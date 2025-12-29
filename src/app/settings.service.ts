import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private base = '/api';

  constructor(private http: HttpClient) {}

  changePassword(body: any) { return this.http.post(`${this.base}/auth/change-password`, body); }
  updateAccount(body: any) { return this.http.put(`${this.base}/users/update-account`, body); }
  updatePreferences(body: any) { return this.http.post(`${this.base}/users/update-preferences`, body); }
}
