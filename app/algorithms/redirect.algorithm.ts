import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginAlgorithm } from './login.algorithm'; 
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: LoginAlgorithm, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = this.authService.getAuthToken();
    
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // Декодируем токен
    const decodedToken: any = jwtDecode(token);
    const role = decodedToken.role;

    // Проверка на роль для доступа к админ-панели
    const path = route.url.map(segment => segment.path).join('/');
    if (path === 'admin' && role !== 'ADMIN') {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}