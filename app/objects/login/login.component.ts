import { Component } from '@angular/core';
import { AuthAlgorithm } from 'src/app/algorithms/auth.algorithm';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { LoginResponse } from 'src/app/entities/LoginResponse';
import { LocalstorageAlgorithm } from 'src/app/algorithms/localstorage.algorithm';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthAlgorithm, private router: Router, private storageService: LocalstorageAlgorithm) {}

  onLogin() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response: LoginResponse) => {
        console.log('Успешный вход:', response);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('username', this.username);
        this.errorMessage = 'Успешный вход!';
        const userId = response.userId;
        this.storageService.updateUser(this.username, userId);
        // Перенаправление на главную страницу после успешного входа
        this.router.navigate(['/main']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Ошибка входа:', error);
        this.errorMessage = error.error || 'Ошибка при входе.';
      }
    });
  }

  /*onLogin() {
      this.authService.login(this.username, this.password).subscribe(response => {
        // Сохраняем токен
        localStorage.setItem('authToken', response);
      }, error => {
        console.error('Login failed:', error);
      });
    }*/

  onRegister() {
    this.authService.register(this.username, this.password).subscribe({
      next: (response: LoginResponse) => {
        console.log('Регистрация успешна:', response);
        this.errorMessage = response.token;
        // Перенаправление на страницу входа после успешной регистрации
      },
      error: (error: HttpErrorResponse) => {
        console.error('Ошибка регистрации:', error);
        this.errorMessage = error.error || 'Ошибка при регистрации.';
      }
    });
  }

}