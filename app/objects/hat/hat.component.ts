import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/algorithms/database.algorithm';
import { LocalstorageAlgorithm } from 'src/app/algorithms/localstorage.algorithm';
import { Router } from '@angular/router';
import { LoginAlgorithm } from 'src/app/algorithms/login.algorithm';

@Component({
  selector: 'app-hat',
  templateUrl: './hat.component.html',
  styleUrls: ['./hat.component.css']
})
export class HatComponent implements OnInit {
  currentUser: string | null;
  currentUserId: number = -1;
  requestMessage: string = ''; // Сообщение для уведомления
  showMessage: boolean = false; // Показывать ли сообщение

  constructor(private storageService: LocalstorageAlgorithm, private databaseService: DatabaseService, private router: Router, private loginAlgorithm: LoginAlgorithm) {
  }

  ngOnInit(): void {
    // Подписка на изменения в локальном хранилище
    this.storageService.storage$.subscribe(value => {
      this.currentUser = value.username;
      this.currentUserId = value.userId;  // Обновляем currentUserId
    });
  }

  logout() {
    localStorage.setItem('authToken', '');
    localStorage.setItem('username', '');
    this.storageService.updateUser('', -1);
    this.currentUser = "";
    this.currentUserId = -1;
    this.router.navigate(["/"]);
  }

  checkToken(){
    const token = localStorage.getItem('authToken'); // Пример получения токена из localStorage
    if (token) {
      this.loginAlgorithm.validateToken(token).subscribe(
        (response) => {
          console.log('Токен валиден');
        },
        (error) => {
          console.log(error);
          console.log('Токен невалиден');
          // Здесь можно сделать редирект на страницу логина
        }
      );
    }
  }

  requestAdminRights() {
    if (this.currentUser) {
      this.databaseService.requestAdminRights(this.currentUserId).subscribe({
        next: (response) => {
          this.requestMessage = 'Запрос на получение прав администратора отправлен.';
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false; // Скрыть сообщение через 5 секунд
          }, 5000);
        },
        error: (error) => {
          console.error('Ошибка при отправке запроса на получение прав администратора:', error);
          if (error.status === 400) {
            this.requestMessage = 'Вы уже отправляли запрос на получение прав администратора.';
          } else if (error.status === 403) {
            this.requestMessage = 'Вы уже являетесь администратором.';
          } else {
            this.requestMessage = 'Не удалось отправить запрос. Попробуйте снова.';
          }
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false; // Скрыть сообщение через 5 секунд
          }, 5000);
        }
      });
    }
  }
}