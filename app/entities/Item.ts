export interface Item {
    id: number;           // ID предмета
    heroName: string;     // Имя героя
    itemName: string;     // Название предмета
    position: number;     // Позиция (например, Carry, Mid, Support)
    pickRate: number;     // Процент выбора (Pick Rate)
    timing: string;       // Время (например, Start, Early, Mid, Late)
    count: number;        // Количество предметов
  }