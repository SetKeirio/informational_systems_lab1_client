import { Component } from '@angular/core';

@Component({
  selector: 'app-bottom',
  templateUrl: './bottom.component.html',
  styleUrls: ['./bottom.component.css']
})
export class BoottomComponent {
  name: string = 'Стригалев Никита Сергеевич'; // Замените на ваше имя
  variantNumber: string = 'Вариант 335099'; // Замените на номер варианта
  groupNumber: string = 'Группа P3312'; // Замените на номер группы
  name2: string = 'Файзиев Фаридун Равшанович';
  groupNumber2: string = 'Группа P3312'
  imageUrl: string = '../../../assets/Zamay.png'; // Укажите путь к вашей картинке
}