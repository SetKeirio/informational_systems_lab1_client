export interface SpaceMarineRequest {
    name: string;
    coordinatesId: {
      x: number;
      y: number;
    };
    chapterId: number; // Или можете использовать строку, если это имя главы
    health?: number;
    category: string; // ID категории
    weaponType: string; // ID типа оружия
    meleeWeapon: string; // ID ближнего оружия
    userId: number; // ID пользователя, который создает
  }