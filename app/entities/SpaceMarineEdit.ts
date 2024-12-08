export interface SpaceMarineEdit {
  id: number,
    name: string;
    coordinatesId: number;
    chapterId: number; // Или можете использовать строку, если это имя главы
    health?: number;
    categoryId: number; // ID категории
    weaponTypeId: number; // ID типа оружия
    meleeWeaponId: number; // ID ближнего оружия
  }