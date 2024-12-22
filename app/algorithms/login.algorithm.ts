import { Injectable, OnInit } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Data } from './data';
import { FileService } from './file.algorithm';

@Injectable({
  providedIn: 'root',
})

export class LoginAlgorithm implements CanActivate {

  private apiUrl = this.data.http + this.data.host + this.data.port + "/login";

  constructor(private router: Router, private http: HttpClient, private data: Data) {}


  canActivate(): boolean {
    const token = localStorage.getItem('authToken');

    if (token) {
      return true; // Токен существует, доступ разрешен
    } else {
      return false; // Доступ запрещен
    }
  }


  login(username: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { username, password });
  }

  validateToken(token: string): Observable<string> {
    return this.http.post(this.apiUrl + "/validate-token", token, { responseType: 'text' });
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }
  
}