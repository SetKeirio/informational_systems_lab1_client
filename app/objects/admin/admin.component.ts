import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/algorithms/database.algorithm';
import { AdminApproval } from 'src/app/entities/AdminApproval';
import { Observable, forkJoin } from 'rxjs'; // Импорт Observable и forkJoin
import { tap } from 'rxjs/operators'; // Импорт оператора tap

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
    adminRequests: AdminApproval[] = [];
    convertedUsernames: string[] = [];
    adminRequestsTable: { username: string, status: string, id: number }[];

      p: number = 1; // текущая страница
      itemsPerPage: number = 5; // количество элементов на странице
    
      constructor(private databaseService: DatabaseService) {}
    
      ngOnInit(): void {
        // Загрузка запросов с сервера
        this.databaseService.getAdminRequests().subscribe({
          next: (requests) => {
            this.adminRequests = requests; // Сохраняем запросы в массив
            this.usernamesFromId().subscribe(() => {
              // После того как все запросы завершены, вызываем toTable()
              this.toTable();
            });
          },
          error: (error) => {
            console.error('Ошибка при загрузке запросов:', error);
          }
        });
        
      }

      toTable(): void {
        this.adminRequestsTable = this.adminRequests.map((user, index) => ({
          username: this.convertedUsernames[index],
          status: user.status,
          id: user.userId
        }));
        console.log(this.convertedUsernames);
        console.log(this.adminRequestsTable);
      }

      usernamesFromId(): Observable<any> {
        const observables = this.adminRequests.map((request, i) => {
          return this.databaseService.getUsernameFromId(request.userId).pipe(
            // Добавляем значение в convertedUsernames после получения данных
            tap((username) => {
              this.convertedUsernames[i] = username;
            })
          );
        });
        return forkJoin(observables);
      }
    
      approveRequest(id: number): void {
        this.databaseService.approveUser(id).subscribe({
          next: (response: string) => {
            console.log(response);
          },
          error: (error) => {
          }
      });
        const request = this.adminRequests.find(req => req.userId === id);
        if (request) {
          request.status = 'Одобрено';
          console.log(this.adminRequests);
          this.toTable();
        }
      }
    
      rejectRequest(id: number): void {
        this.databaseService.rejectUser(id).subscribe({
          next: (response: string) => {
            console.log(response);
          },
          error: (error) => {
          }
      });
        const request = this.adminRequests.find(req => req.userId === id);
        if (request) {
          request.status = 'Отклонено';
          console.log(this.adminRequests);
          this.toTable();
        }
      }
}