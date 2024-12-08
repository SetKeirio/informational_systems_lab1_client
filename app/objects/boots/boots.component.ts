import { Component } from '@angular/core';

@Component({
  selector: 'app-boots',
  templateUrl: './boots.component.html',
  styleUrls: ['./boots.component.css']
})
export class BootsComponent {
  name: string = 'Стригалев Никита Сергеевич'; // Замените на ваше имя
  variantNumber: string = 'Вариант 335099'; // Замените на номер варианта
  groupNumber: string = 'Группа P3312'; // Замените на номер группы
  imageUrl: string = '../../../assets/Zamay.png'; // Укажите путь к вашей картинке
}