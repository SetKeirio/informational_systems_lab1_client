export interface SpaceMarine {
    id: number;
    name: string;
    coordinates: string;
    creationDate: string;
    chapter: string;
    health?: number;
    category?: string; // используйте соответствующий тип для категории
    weaponType: string; // используйте соответствующий тип для оружия
    meleeWeapon: string; // используйте соответствующий тип для ближнего оружия
    username: number; // добавьте поле для ID пользователя
  }