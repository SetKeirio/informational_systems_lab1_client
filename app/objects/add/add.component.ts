import { Component } from '@angular/core';
import { DatabaseService } from '../../algorithms/database.algorithm';
import { SpaceMarineRequest } from '../../entities/SpaceMarineRequest';
import { ChapterResponse } from 'src/app/entities/ChapterResponse';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddSpaceMarineComponent {
  newSpaceMarine: SpaceMarineRequest = {
    name: '',
    coordinatesId: { x: 0, y: 0 },
    chapterId: 0,
    health: undefined,
    category: '',
    weaponType: '',
    meleeWeapon: '',
    userId: 0, // Будет установлено позже
  };

  categories: String[] = []; // Загрузить категории
  weaponTypes: String[] = []; // Загрузить типы оружия
  meleeWeapons: String[] = []; // Загрузить типы ближнего оружия
  chapters: ChapterResponse[] = [];
  chapterSelected: boolean = true;
  errorMessage: string = ''; // Сообщение об ошибке
  successMessage: string = ''; // Сообщение об успешном добавлении

  constructor(private databaseService: DatabaseService) {
    this.loadCategories();
    this.loadWeaponTypes();
    this.loadMeleeWeapons();
    this.loadChapters();
    this.newSpaceMarine.userId = this.getCurrentUserId(); // Установите ID текущего пользователя
  }

  loadCategories() {
    // Получите категории с сервера
    this.databaseService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  loadWeaponTypes() {
    // Получите типы оружия с сервера
    this.databaseService.getWeaponTypes().subscribe(data => {
      this.weaponTypes = data;
    });
  }

  loadMeleeWeapons() {
    // Получите типы ближнего оружия с сервера
    this.databaseService.getMeleeWeapons().subscribe(data => {
      this.meleeWeapons = data;
    });
  }

  loadChapters() {
    this.databaseService.getChapters(0, 0) // Предположим, что вы загружаете все главы
      .subscribe(data => {
        this.chapters = data;
      });
  }

  isXValid(x: any): boolean {
    return Number.isInteger(Number(x));
  }

  addSpaceMarine(): void {
    // Очищаем предыдущие сообщения об ошибке/успехе
    this.errorMessage = '';
    this.successMessage = '';
    console.log(this.newSpaceMarine);

    if (!this.newSpaceMarine.chapterId) {
      this.chapterSelected = false; // Установить в false, если глава не выбрана
      this.errorMessage = 'Пожалуйста, введите главу.';
      return; // Прекратить выполнение, если глава не выбрана
    }
    this.chapterSelected = true;
    // Проверка валидности
    if (!this.newSpaceMarine.name) {
      this.errorMessage = 'Пожалуйста, введите имя.';
      return;
    }
    if (!this.newSpaceMarine.chapterId) {
      this.errorMessage = 'Пожалуйста, введите ID главы.';
      return;
    }
    if (!this.newSpaceMarine.weaponType) {
      this.errorMessage = 'Пожалуйста, выберите тип оружия.';
      return;
    }
    if (!this.newSpaceMarine.meleeWeapon) {
      this.errorMessage = 'Пожалуйста, выберите тип ближнего оружия.';
      return;
    }
    console.log(this.newSpaceMarine.coordinatesId.x);
    if (!this.isXValid(this.newSpaceMarine.coordinatesId.x) || this.newSpaceMarine.coordinatesId.x === null) {
      this.errorMessage = 'Координата X должна быть целым числом.';
      return;
    }

    // Создание SpaceMarine
    this.databaseService.createSpaceMarine(this.newSpaceMarine).subscribe({
      next: (response) => {
        this.successMessage = 'Space Marine успешно добавлен!';
        this.errorMessage = ''
        console.log('SpaceMarine добавлен:', response);
      },
      error: (error) => {
        if (error.status === 403) {
          this.errorMessage = 'Кажется, ваш токен истек. Перезайдите, пожалуйста, в аккаунт.';
        }
        else{
          this.errorMessage = 'Не удалось добавить Space Marine. Попробуйте еще раз.';
        }
        
        this.successMessage = '';
        console.error('Ошибка при добавлении SpaceMarine:', error);
      }
    });
  }

  getCurrentUserId(): number {
    // Здесь должен быть ваш код для получения ID текущего пользователя
    return parseInt(localStorage.getItem("currentUserId") || "-1", 10);
  }
}