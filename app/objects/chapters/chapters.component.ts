import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/algorithms/database.algorithm';
import { ChapterResponse } from 'src/app/entities/ChapterResponse';

@Component({
  selector: 'app-chapter-table',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.css']
})
export class ChapterTableComponent implements OnInit {
    chapters: ChapterResponse[] = [];  // Типизированный массив глав
    uniqueChapters: string[] = [];  // Уникальные названия глав для фильтрации
    filteredChapters: ChapterResponse[] = []; // Отфильтрованный список
    currentPage = 1; // Текущая страница
    itemsPerPage = 5; // Количество элементов на странице
    totalItems = 0; // Общее количество элементов
    errorMessage: string | null = null; // Сообщение об ошибке
    pollingInterval: any;
    nowSortedBy: keyof ChapterResponse = 'id';
    ascending: boolean = true;

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.loadChapters();
    this.startPolling();
  }

  startPolling(): void {
    this.pollingInterval = setInterval(() => {
      this.loadChapters(); // периодически обновляем данные
    }, 5000); // каждые 5 секунд
  }

  loadChapters(): void {
    this.databaseService.getChapters(this.currentPage - 1, this.itemsPerPage)
      .subscribe({
        next: (data) => {
          if (!this.arraysEqual(this.chapters, data)){
            this.chapters = data; // Загружаем главы
            this.filteredChapters = [...data];  // Инициализируем список отфильтрованных глав
            this.extractUniqueChapters();  // Собираем уникальные значения для фильтрации
            this.sort(this.nowSortedBy);
          }
        },
        error: (err) => {
          this.errorMessage = 'Не удалось загрузить данные о главах.';
        }
      });
  }

  extractUniqueChapters(): void {
    const chaptersSet = new Set<string>(); // Множество для уникальных значений
    this.chapters.forEach(chapter => {
      chaptersSet.add(chapter.name); // Собираем уникальные имена глав
    });
    this.uniqueChapters = Array.from(chaptersSet); // Преобразуем в массив
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadChapters();
  }

  onFilterChange(property: keyof ChapterResponse, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
  
    // Фильтрация по имени главы
    if (value === "") {
      this.filteredChapters = [...this.chapters];  // Если фильтр пустой, показываем все данные
    } else {
      // Проверка, является ли свойство строкой или числом
      this.filteredChapters = this.chapters.filter(chapter => {
        const propertyValue = chapter[property];
  
        if (typeof propertyValue === 'string') {
          return propertyValue.includes(value); // Для строк применяем includes
        } else if (typeof propertyValue === 'number') {
          return propertyValue.toString().includes(value); // Для чисел преобразуем в строку и применяем includes
        }
  
        return false;
      });
    }
  }

  sort(property: keyof ChapterResponse): void {
    this.nowSortedBy = property;
    this.ascending = !this.ascending; // Или добавьте логику для переключения направления сортировки

    this.filteredChapters.sort((a, b) => {
      if (a[property] < b[property]) return this.ascending ? -1 : 1;
      if (a[property] > b[property]) return this.ascending ? 1 : -1;
      return 0;
    });
  }

  arraysEqual(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) return false;
  
    // Сравниваем каждый элемент
    for (let i = 0; i < arr1.length; i++) {
      if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) {
        return false;
      }
    }
    
    return true;
  }

}