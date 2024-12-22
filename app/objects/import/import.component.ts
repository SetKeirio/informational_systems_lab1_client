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
          this.uploadStatus = 'Ошибка при загрузке файла. Попробуйте снова.';
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
}