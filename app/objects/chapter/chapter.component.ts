import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Импортируем FormBuilder, FormGroup и Validators
import { ChapterRequest } from 'src/app/entities/ChapterRequest';
import { DatabaseService } from 'src/app/algorithms/database.algorithm';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.css']
})
export class ChapterComponent implements OnInit {
  chapterForm: FormGroup; // Для создания формы
  showErrorMessage: string | null = null; // Для отображения ошибки

  constructor(private databaseService: DatabaseService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    // Инициализация формы с валидаторами
    this.chapterForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1)]], // Валидатор на пустую строку
      marinesCount: [null, [Validators.required, Validators.min(1), Validators.max(1000)]], // Для проверки значений от 1 до 1000
    });
  }

  // Проверка состояния формы
  get name() {
    return this.chapterForm.get('name');
  }

  get marinesCount() {
    return this.chapterForm.get('marinesCount');
  }

  // Отправка данных
  onSubmit() {
    if (this.chapterForm.valid) {
      const chapterData: ChapterRequest = this.chapterForm.value; // Получаем данные из формы

      // Отправляем данные на сервер
      this.databaseService.createChapter(chapterData).subscribe(
        (response) => {
          console.log('Chapter успешно создан', response);
        },
        (error) => {
          console.error('Ошибка при создании Chapter', error);
        }
      );
    }
  }

  // Проверка, можно ли активировать кнопку отправки
  isSubmitDisabled(): boolean {
    return this.chapterForm.invalid;
  }
}