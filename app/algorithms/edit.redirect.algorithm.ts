import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginAlgorithm } from './login.algorithm'; 
import { jwtDecode } from 'jwt-decode';
import { DatabaseService } from './database.algorithm';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class EditGuard implements CanActivate {
  constructor(private authService: LoginAlgorithm, private router: Router, private databaseService: DatabaseService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const token = this.authService.getAuthToken();
    
    if (!token) {
      this.router.navigate(['/authentify']);
      return new Observable<boolean>(observer => {
        observer.next(false);
        observer.complete();
      });
    }
    // Декодируем токен
    const decodedToken: any = jwtDecode(token);
    const role = decodedToken.role;
    const spaceMarineIdString = route.paramMap.get('id');
    if (!spaceMarineIdString) {
      localStorage.setItem('notYours', 'not')
      this.router.navigate(['/main']);  // Перенаправление на страницу ошибки, если параметр 'id' отсутствует
      return new Observable<boolean>(observer => {
        observer.next(false);
        observer.complete();
      });
    }
    const spaceMarineId: number = +spaceMarineIdString;
    if (spaceMarineId) {
      // Проверка прав доступа (например, для обычного пользователя проверяем принадлежность SpaceMarine)
      if (role !== 'ADMIN') {
        return this.databaseService.isSpaceMarineBelongsToUser (spaceMarineId).pipe(
          map(is => {
            if (!is) {
              localStorage.setItem('notYours', 'not')
              this.router.navigate(['/main']); // Перенаправление на главную, если Space Marine не принадлежит пользователю
              
              return false;
            }
            localStorage.setItem('notYours', '')
            return true; // Space Marine принадлежит пользователю
          }),
          catchError(() => {
            localStorage.setItem('notYours', 'not')
            this.router.navigate(['/main']); // Обработка ошибок
            return new Observable<boolean>(observer => {
              observer.next(false);
              observer.complete();
            });
          })
        );
      }
    }
    // Если роль ADMIN, пропускаем
    if (role === 'ADMIN') {
      return new Observable<boolean>(observer => {
        localStorage.setItem('notYours', '')
        observer.next(true);
        observer.complete();
      });
    }
    return new Observable<boolean>(observer => {
      localStorage.setItem('notYours', '')
      observer.next(true);
      observer.complete();
    });
  }
}