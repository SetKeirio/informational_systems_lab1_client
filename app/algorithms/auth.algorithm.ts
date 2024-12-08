import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CanActivate } from '@angular/router';
import { Data } from './data';
import { FileService } from './file.algorithm';

@Injectable({
  providedIn: 'root'
})
export class AuthAlgorithm implements OnInit{
  private url = ''

  constructor(private http: HttpClient, private data: Data, private file: FileService) {}

  ngOnInit(): void {
    this.file.readFile('assets/server.txt').subscribe(
      data => {
        this.url = data + '/login';
      },
      error => {
        console.error('Error reading file:', error);
      }
    );
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.url}/login`, { username, password });
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.url}/register`, { username, password });
  }

}