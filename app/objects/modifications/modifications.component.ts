import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/algorithms/database.algorithm';
import { SpaceMarine } from 'src/app/entities/SpaceMarine';
import { TableComponent } from '../table/table.component';
import { ChapterResponse } from 'src/app/entities/ChapterResponse';
import { SpaceMarineEdit } from 'src/app/entities/SpaceMarineEdit';

@Component({
  selector: 'app-modifications',
  templateUrl: './modifications.component.html',
  styleUrls: ['./modifications.component.css']
})
export class ModificationComponent {
  @ViewChild(TableComponent) tableComponent!: TableComponent;

  averageHealthForm: FormGroup;
  categoryCountForm: FormGroup;
  healthFilterForm: FormGroup;
  demoteForm: FormGroup;
  dissolveChapterForm: FormGroup;

  healthValue: number = 0;
  categoryCount: number = 0;
  healthThreshold: number = 0;
  marineId: number = 0;
  categoryId: number = 0;

  requestHealthValue: number = 0;
  requestCategoryCount: number = 0;

  answerHealthValue: number = -1;
  answerCategoryCount: number = -1;
  answerAstartesCategory1: string = '';
  answerAstartesCategory2: string = '';

  filteredSpaceMarines: SpaceMarineEdit[] = [];
  selectedSpaceMarineId: number = 0;
  categories: String[] = [];
  selectedCategory: string = '';
  nowCategory: string = '';
  nowCategory2: string = '';
  chapters: ChapterResponse[] = [];
  demotedSpaceMarine: SpaceMarine;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private databaseService: DatabaseService) {
    this.averageHealthForm = this.fb.group({
      health: [null, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]]
    });
    this.categoryCountForm = this.fb.group({
      categoryId: [null, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]]
    });
    this.healthFilterForm = this.fb.group({
      health: [null, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]]
    });
    this.demoteForm = this.fb.group({
      id: [null, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]]
    });
    this.dissolveChapterForm = this.fb.group({
      chapterId: [null, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]]
    });
    this.loadCategories();
  }

  calculateAverageHealth() {
    this.databaseService.calculateAverageHealth()
      .subscribe(data => {
        console.log(data);
        this.answerHealthValue = data; // предполагается, что сервер возвращает массив объектов
        // Здесь вы можете установить общее количество элементов, если сервер возвращает это значение
        // this.totalItems = data.totalElements; // пример, в зависимости от ответа сервера
      });
  }

  loadCategories() {
    this.databaseService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  loadSpaceMarinesByCategory() {
    if (this.nowCategory2) {
        this.databaseService.getSpaceMarineByCategory(this.nowCategory2).subscribe(data => {
          this.filteredSpaceMarines = data;});
    } else {
        this.filteredSpaceMarines = []; // Очистка списка, если категория не выбрана
    }
}


  getCategoryCount() {
    this.databaseService.getCategoryCount(this.categoryCount)
      .subscribe(data => {
        console.log(data);
        this.answerCategoryCount = data; // предполагается, что сервер возвращает массив объектов
        // Здесь вы можете установить общее количество элементов, если сервер возвращает это значение
        // this.totalItems = data.totalElements; // пример, в зависимости от ответа сервера
      });
}

  getHealthFilteredSpaceMarines() {
    this.tableComponent.loadHealthFilteredSpaceMarines(this.healthThreshold);
  }

  demoteSpaceMarine() {
    this.databaseService.excludeSpaceMarineFromCategoryById(0, 0, this.selectedSpaceMarineId).subscribe({
      next: (response: SpaceMarine[]) => {
        console.log(response);
        this.errorMessage = 'Исключен из ордена spacemarine с id ' + this.selectedSpaceMarineId;
      },
      error: (error) => {
        this.answerAstartesCategory1 = error.error;
        this.errorMessage = 'Невозможно исключить spacemarine с таким id из категории. Либо это не ваш объект, либо spacemarine с таким id не существует.'
      }
  });;
  }

  dissolveChapter() {
    if (this.nowCategory) {
        // Получаем categoryId по имени категории
        this.databaseService.getCategoryIdByName(this.nowCategory).subscribe({
            next: (categoryId: number) => {
                // После получения categoryId, вызываем метод для удаления категории
                this.databaseService.removeAstartesCategory(categoryId).subscribe({
                    next: (response: string) => {
                        console.log(response);
                        this.answerAstartesCategory2 = response;
                        this.errorMessage = '';
                    },
                    error: (error) => {
                        this.answerAstartesCategory2 = error.error;
                        this.errorMessage = 'Невозможно исключить ни одного spacemarine из категории.';
                    }
                });
            },
            error: (error) => {
                this.errorMessage = 'Не удалось получить ID категории по имени.';
            }
        });
    } else {
        this.errorMessage = 'Выбранная категория не найдена.';
    }
}
}