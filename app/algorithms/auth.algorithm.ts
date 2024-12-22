import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CanActivate } from '@angular/router';
import { Data } from './data';
import { FileService } from './file.algorithm';

@Injectable({
  providedIn: 'root'
})
export class AuthAlgorithm{
  private url = this.data.http + this.data.host + this.data.port + "/login";

  constructor(private http: HttpClient, private data: Data) {
  }

  login(username: string, password: string): Observable<any> {
    console.log(this.url);
    return this.http.post(`${this.url}/login`, { username, password });
  }

  register(username: string, password: string): Observable<any> {
    console.log(this.url);
    return this.http.post(`${this.url}/register`, { username, password });
  }

}