import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/algorithms/database.algorithm'; // Сервис для получения данных
import { Hero } from 'src/app/entities/Hero';
import { CharacterName } from 'src/app/entities/CharacterName';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit {
  heroes: Hero[] = []; // Все герои
  filteredHeroes: Hero[] = []; // Отфильтрованные герои
  currentPage = 1; // Текущая страница для пагинации
  itemsPerPage = 10; // Количество элементов на странице
  errorMessage: string = ''; // Сообщение об ошибке
  nowSortedBy: keyof Hero = 'name' // Поле, по которому идет сортировка

  constructor(private databaseService: DatabaseService) {}

  ngOnInit() {
    this.loadHeroes();
  }

  loadHeroes(): void {
    // Получаем героев с учетом пагинации
    this.databaseService.getHeroes().subscribe({
      next: (data: Hero[]) => {
        if (!this.arraysEqual(this.heroes, data)) {
          this.heroes = data; // Загружаем новые данные о героях
          this.filteredHeroes = data; // Сохраняем отфильтрованные данные
          this.extractUniqueValues(); // Извлекаем уникальные значения для фильтров
          this.sort(this.nowSortedBy); // Применяем сортировку
        }
      },
      error: (error) => {
        this.errorMessage = 'Не удалось загрузить данные о героях'; // Обработка ошибки
      }
    });
  }

  arraysEqual(arr1: Hero[], arr2: Hero[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i].id !== arr2[i].id) { // Сравниваем по id
        return false;
      }
    }
    return true;
  }

  extractUniqueValues(): void {
    // Здесь нужно добавить логику для извлечения уникальных значений, если необходимо
  }

  sort(by: keyof Hero): void {
    this.nowSortedBy = by; // Устанавливаем текущий параметр сортировки
    this.filteredHeroes.sort((a, b) => {
      if (a[by] < b[by]) {
        return -1;
      }
      if (a[by] > b[by]) {
        return 1;
      }
      return 0;
    });
  }

  onRoleFilterChange(event: any) {
    const role = event.target.value;
    /*if (role) {
      this.filteredHeroes = this.heroes.filter(hero => hero.role === role);
    } else {
      this.filteredHeroes = this.heroes;
    }*/
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}