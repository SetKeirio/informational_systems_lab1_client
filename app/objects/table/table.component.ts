import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DatabaseService } from '../../algorithms/database.algorithm';
import { SpaceMarine } from '../../entities/SpaceMarine';
import { Router } from '@angular/router';

@Component({
  selector: 'app-space-marine-list',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy, AfterViewInit {
  spaceMarines: SpaceMarine[] = [];
  filteredSpaceMarines: SpaceMarine[] = [];
  uniqueNames: string[] = [];
  uniqueChapters: string[] = [];
  uniqueCoordinates: string[] = [];
  uniqueCreationDates: string[] = [];
  uniqueHealths: number[] = [];
  uniqueCategories: string[] = [];
  uniqueWeaponTypes: string[] = [];
  uniqueMeleeWeapons: string[] = [];
  uniqueUsernames: number[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalItems = 0; // общее количество элементов
  notYours: boolean = false;
  pollingInterval: any;
  isAscending: boolean = true;
  nowSortedBy: keyof SpaceMarine = 'id';

  errorMessage: string | null = null;

  constructor(private databaseService: DatabaseService, private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('notYours') === 'not'){
      this.notYours = true;
    }
    this.loadSpaceMarines();
    this.startPolling();
  }

  ngOnDestroy(): void {
    // Освобождение ресурсов
    localStorage.setItem('notYours', '')
    if (localStorage.getItem('notYours') === 'not'){
      this.notYours = true;
    }
  }

  ngAfterViewInit(): void {
    // Логика после инициализации представления
    localStorage.setItem('notYours', '')
    if (localStorage.getItem('notYours') === 'not'){
      this.notYours = true;
    }
  }

  startPolling(): void {
    this.pollingInterval = setInterval(() => {
      this.loadSpaceMarines();
      if (localStorage.getItem('notYours') === 'not'){
        this.notYours = true;
      } // периодически обновляем данные
    }, 2000); // каждые 5 секунд
  }

  loadSpaceMarines(): void {
    this.databaseService.getSpaceMarines(this.currentPage - 1, this.itemsPerPage)
        .subscribe(data => {
          if (!this.arraysEqual(this.spaceMarines, data)) {
            this.spaceMarines = data;
            this.filteredSpaceMarines = data;
            this.extractUniqueValues();
            this.sort(this.nowSortedBy);
            this.sort(this.nowSortedBy);
          }
        });
  }

  deleteSpaceMarine(id: number): void {
    this.databaseService.deleteSpaceMarine(id)
      .subscribe({
        next: () => {
          // Успешно удален, обновляем список
          this.loadSpaceMarines();
          this.errorMessage = '';  // Очищаем сообщение об ошибке
        },
        error: (err) => {
          if (err.status === 403) {
            this.errorMessage = 'Кажется, ваш токен истек. Перезайдите, пожалуйста, в аккаунт.';
          }
          else if ((err.status !== 200) || (err.status === 405)){
            this.errorMessage = 'Не удалось удалить Космодесантника. Возможно, у вас нет прав для выполнения этого действия.';
          }
        }
      });
  }

  loadHealthFilteredSpaceMarines(health: number): void {
    this.databaseService.getHealthFilteredSpaceMarines(this.currentPage - 1, this.itemsPerPage, health)
      .subscribe(data => {
        this.filteredSpaceMarines = data; // предполагается, что сервер возвращает массив объектов
        // Здесь вы можете установить общее количество элементов, если сервер возвращает это значение
        // this.totalItems = data.totalElements; // пример, в зависимости от ответа сервера
        console.log(data);
        console.log(this.spaceMarines);
      
      });
  }

  loadExcludedSpaceMarineFromCategoryById(id: number): void{
    this.databaseService.excludeSpaceMarineFromCategoryById(this.currentPage - 1, this.itemsPerPage, id)
      .subscribe(data => {
        this.spaceMarines = data; // предполагается, что сервер возвращает массив объектов
        // Здесь вы можете установить общее количество элементов, если сервер возвращает это значение
        // this.totalItems = data.totalElements; // пример, в зависимости от ответа сервера
      });
  }

  loadRemovedSpaceMarine(categoryId: number): void{
    this.databaseService.excludeSpaceMarineFromCategoryById(this.currentPage - 1, this.itemsPerPage, categoryId)
      .subscribe(data => {
        this.spaceMarines = data; // предполагается, что сервер возвращает массив объектов
        // Здесь вы можете установить общее количество элементов, если сервер возвращает это значение
        // this.totalItems = data.totalElements; // пример, в зависимости от ответа сервера
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadSpaceMarines();
  }

  onFilterChange(property: keyof SpaceMarine, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;

    this.filteredSpaceMarines = this.spaceMarines.filter(marine => {
      if (property === 'health') {
          return value === "" || marine.health === Number(value);
      }
      return value === "" || marine[property] === value;
  });
}

extractUniqueValues(): void {
  const namesSet = new Set<string>();
  const coordinatesSet = new Set<string>();
  const creationDatesSet = new Set<string>();
  const chaptersSet = new Set<string>();
  const healthsSet = new Set<number>();
  const categoriesSet = new Set<string>();
  const weaponTypesSet = new Set<string>();
  const meleeWeaponsSet = new Set<string>();
  const usernamesSet = new Set<number>();

  this.spaceMarines.forEach(marine => {
      namesSet.add(marine.name);
      coordinatesSet.add(marine.coordinates);
      creationDatesSet.add(marine.creationDate);
      chaptersSet.add(marine.chapter);
      if (marine.health) healthsSet.add(marine.health);
      if (marine.category) categoriesSet.add(marine.category);
      weaponTypesSet.add(marine.weaponType);
      meleeWeaponsSet.add(marine.meleeWeapon);
      usernamesSet.add(marine.username);
  });

  this.uniqueNames = Array.from(namesSet);
  this.uniqueCoordinates = Array.from(coordinatesSet);
  this.uniqueCreationDates = Array.from(creationDatesSet);
  this.uniqueChapters = Array.from(chaptersSet);
  this.uniqueHealths = Array.from(healthsSet);
  this.uniqueCategories = Array.from(categoriesSet);
  this.uniqueWeaponTypes = Array.from(weaponTypesSet);
  this.uniqueMeleeWeapons = Array.from(meleeWeaponsSet);
  this.uniqueUsernames = Array.from(usernamesSet);
}


sort(property: keyof SpaceMarine): void {
  this.nowSortedBy = property;
  this.isAscending = !this.isAscending;
  this.filteredSpaceMarines.sort((a, b) => {
      const aValue = a[property];
      const bValue = b[property];

      // Проверка на undefined
      if (aValue === undefined) return 1; // Пустые значения в конце
      if (bValue === undefined) return -1;

      if (aValue < bValue) return this.isAscending ? -1 : 1;
      if (aValue > bValue) return this.isAscending ? 1 : -1;
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

navigateToEdit(spaceMarineId: number): void {
  this.router.navigate([`/edit-space-marine/${spaceMarineId}`]); // Переход на страницу редактирования
}

}