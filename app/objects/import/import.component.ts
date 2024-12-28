import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../algorithms/database.algorithm';
import { Import } from 'src/app/entities/Import';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {
  file: File | null = null;
  isDragOver = false;
  importHistory: Import[] = [];
  currentPage: number = 1;  // Текущая страница пагинации
  itemsPerPage: number = 5; // Количество элементов на одной странице
  private intervalId: any;  // Переменная для хранения ID интервала
  uploadStatus: string = ''; // Переменная для хранения статуса загрузки

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.loadImportHistory();

    this.intervalId = setInterval(() => {
      this.loadImportHistory();
    }, 5000);
  }

  // Обработчик выбора файла
  onFileSelected(event: any): void {
    this.file = event.target.files[0];
  }

  // Обработчик dragover
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  // Обработчик dragleave
  onDragLeave(): void {
    this.isDragOver = false;
  }

  // Обработчик drop
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files) {
      this.file = event.dataTransfer.files[0];
    }
  }

  // Отправка файла на сервер
  onUpload(): void {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);

      this.databaseService.uploadFile(formData).subscribe({
        next: (response) => {
          console.log('Файл успешно загружен:', response);
          this.uploadStatus = 'Файл успешно загружен!';
          this.loadImportHistory();
        },
        error: (error) => {
          console.error('Ошибка при загрузке файла:', error);
          switch (error.status) {
            case 400:
              this.uploadStatus = 'Ошибка: Пустой файл.';
              break;
            case 409:
              this.uploadStatus = 'Ошибка: Объект с таким именем уже существует.';
              break;
            case 422:
              this.uploadStatus = 'Ошибка: Проблема с чтением файла.';
              break;
            case 503:
              this.uploadStatus = 'Ошибка при доступе к базе данных. Пожалуйста, попробуйте позже.';
              break;
            case 521:
              this.uploadStatus = 'Ошибка при доступе к базе данных, а также ошибка сервера. Пожалуйста, попробуйте позже.';
              break;
            case 500:
              this.uploadStatus = 'Ошибка при загрузке файла в MinIO. Пожалуйста, попробуйте снова.';
              break;
            case 520:
              this.uploadStatus = 'Возникла RuntimeException на сервере. Пожалуйста, попробуйте снова.';
              break;
            case 511:
                this.uploadStatus = 'Возникла RuntimeException на сервере в самом начале функции. Пожалуйста, попробуйте снова.';
                break;
            default:
              this.uploadStatus = 'Ошибка при загрузке файла. Пожалуйста, попробуйте снова.';
              break;
        }
      }
      });
    } else {
      this.uploadStatus = 'Пожалуйста, выберите файл перед загрузкой.';
    }
  }

  // Загрузка истории импорта
  loadImportHistory(): void {
    this.databaseService.getImportHistory().subscribe(data => {
      this.importHistory = data;
    });
  }

  downloadFile(id: number): void {
    this.databaseService.downloadFile(id).subscribe((response: ArrayBuffer) => {
      const blob = new Blob([response], { type: 'application/octet-stream' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `import_history_${id}.json`;
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
    }, error => {
      console.error('Error downloading file', error);
      switch (error.status) {
        case 403:
          this.uploadStatus = 'Ошибка: У вас нет прав для доступа к этому файлу.';
          break;
        case 404:
          this.uploadStatus = 'Ошибка: Файл не найден.';
          break;
        case 500:
          this.uploadStatus = 'Ошибка сервера при скачивании файла. Попробуйте позже.';
          break;
        case 503:
          this.uploadStatus = 'Ошибка базы данных. Попробуйте позже.';
          break;
        case 520:
          this.uploadStatus = 'Неизвестная ошибка сервера. Попробуйте снова.';
          break;
        default:
          this.uploadStatus = 'Ошибка при загрузке файла. Попробуйте снова.';
          break;
      }
    });
  }
  
}