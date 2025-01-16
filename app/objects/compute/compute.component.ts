import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/algorithms/database.algorithm'; // Сервис для получения данных
import { Hero } from 'src/app/entities/Hero'; // Импортируем модель Hero
import { CharacterName } from 'src/app/entities/CharacterName';
import { Pick } from 'src/app/entities/Pick';
import { Combination } from 'src/app/entities/Combination';

@Component({
  selector: 'app-compute',
  templateUrl: './compute.component.html',
  styleUrls: ['./compute.component.css']
})
export class ComputeComponent implements OnInit {
  heroes: Hero[] = []; // Все доступные герои
  positionStrings = [
    { label: 'Carry', value: 1 },
    { label: 'Mid', value: 2 },
    { label: 'Offlane', value: 3 },
    { label: 'Semi Support', value: 4 },
    { label: 'Full Support', value: 5 }
  ];
  heroNames: CharacterName[] = [];
  radiantHeroes: Hero[] = []; // Герои для Radiant
  radiantPositions: number[] = [];
  direHeroes: Hero[] = []; // Герои для Dire
  direPositions: number[] = [];
  radiantHeroSelections: Hero[] = []; // Выбор героев для Radiant
  direHeroSelections: Hero[] = []; // Выбор героев для Dire
  bestCombinations: any[] = []; // Лучшие комбинации героев
  errorMessage: string = ''; // Сообщение об ошибке

  a: String[] = []; // Массив для 10 переменных
  b: String[][] = [];

  sendData(): void {
    // Формируем объект postData
    const postData = {
      radiantHeroes: this.radiantHeroSelections,
      radiantPositions: this.radiantPositions,
      direHeroes: this.direHeroSelections,
      direPositions: this.direPositions
    };
    console.log(postData);

    // Отправляем данные через сервис
    this.databaseService.predictStatistics(postData).subscribe({
      next: (response) => {
        console.log('Ответ от сервера:', response);
        this.a = response;
      },
      error: (error) => {
        console.error('Ошибка при отправке данных:', error);
      }
    });
  }

  calculatePositionsForTeam(team: number): void {

    const pickData: Pick = {
      radiantHeroes: this.radiantHeroSelections,
      radiantPositions: this.radiantPositions,
      direHeroes: this.direHeroSelections,
      direPositions: this.direPositions
    };
    console.log(pickData);

    // Вызов метода calculatePositions
    this.databaseService.calculatePositions(pickData, team).subscribe({
      next: (response) => {
        console.log('Ответ от calculatePositions:', response);
        // Преобразуем данные в нужный формат
        this.b = response;
        console.log('Отформатированные данные для b:', this.b); // Проверка
      },
      error: (error) => {
        console.error('Ошибка при расчете позиций:', error);
      }
    });
  }
  

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.loadHeroes(); // Загружаем героев при инициализации компонента
    this.loadHeroNames();
  }

  loadHeroes(): void {
    // Получаем список героев из базы данных
    this.databaseService.getHeroes().subscribe({
      next: (data: Hero[]) => {
        this.heroes = data; // Заполняем список героев
      },
      error: (error) => {
        this.errorMessage = 'Не удалось загрузить данные о героях'; // Обработка ошибки
      }
    });
  }

  loadHeroNames(): void {
    this.databaseService.getHeroNames().subscribe(
      (names: CharacterName[]) => {
        this.heroNames = names;
      },
      error => {
        console.error('Ошибка при загрузке имен героев', error);
      }
    );
  }

  onHeroSelect(hero: Hero, team: 'radiant' | 'dire', index: number): void {
    // Обработчик для выбора героя
    if (team === 'radiant') {
      this.radiantHeroSelections[index] = hero; // Записываем выбранного героя для Radiant
    } else {
      this.direHeroSelections[index] = hero; // Записываем выбранного героя для Dire
    }
  }

  onPositionSelect(position: number, team: 'radiant' | 'dire', index: number): void {
    if (team === 'radiant') {
      this.radiantPositions[index] = position;  // Сохраняем числовое значение
    } else {
      this.direPositions[index] = position;  // Сохраняем числовое значение
    }
  }

  calculateStatistics(): void {
    // Логика для вычисления статистики (например, комбинации героев и ролей)
    // Здесь будет ваш алгоритм для рассчета статистик для команд Radiant и Dire
    this.bestCombinations = this.computeBestCombinations();
  }

  computeBestCombinations(): any[] {
    // Пример вычисления лучших комбинаций героев (сейчас заглушка)
    return [
      { heroes: 'Hero1, Hero2', role: 'Carry', rating: 95 },
      { heroes: 'Hero3, Hero4', role: 'Support', rating: 92 },
      { heroes: 'Hero5, Hero6', role: 'Offlane', rating: 90 },
      { heroes: 'Hero7, Hero8', role: 'Mid', rating: 88 },
      { heroes: 'Hero9, Hero10', role: 'Full Support', rating: 85 },
      { heroes: 'Hero11, Hero12', role: 'Carry', rating: 80 }
    ];
  }

  distributeRoles(team: 'radiant' | 'dire'): void {
    // Логика для распределения ролей для выбранной команды (Radiant или Dire)
    if (team === 'radiant') {
      console.log('Роли для Radiant распределены');
    } else {
      console.log('Роли для Dire распределены');
    }
  }

  arraysEqual(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i].id !== arr2[i].id) {
        return false;
      }
    }
    return true;
  }
}