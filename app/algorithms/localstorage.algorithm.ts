import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageAlgorithm {
  private storageKey = 'username';
  private storageSubject = new BehaviorSubject<{ username: string | null, userId: number }>({
    username: localStorage.getItem('username'),
    userId: parseInt(localStorage.getItem('currentUserId') || '-1')
  });

  // Обозначаем observable для подписки
  storage$ = this.storageSubject.asObservable();

  updateUser(username: string | null, userId: number) {
    localStorage.setItem('username', username || '');
    localStorage.setItem('currentUserId', userId.toString());
    this.storageSubject.next({ username, userId });
  }
}