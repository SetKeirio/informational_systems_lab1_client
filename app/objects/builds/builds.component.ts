import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/algorithms/database.algorithm';
import { Item } from 'src/app/entities/Item';
import { ActivatedRoute } from '@angular/router';
import { CharacterName } from 'src/app/entities/CharacterName';

@Component({
  selector: 'app-builds',
  templateUrl: './builds.component.html',
  styleUrls: ['./builds.component.css']
})
export class BuildsComponent implements OnInit {
  heroName: string = 'Invoker';  // Имя героя (пример)
  roles = ['Carry', 'Middle', 'Offlane', 'SemiSupport', 'FullSupport'];  // Роли для кнопок
  selectedRole: string = '';  // Выбранная роль
  heroItems: any = {};  // Данные предметов героя по ролям
  heroNames: CharacterName[] = [];
  hero_id = {1: 'Anti-Mage', 2: 'Axe', 3: 'Bane', 4: 'Bloodseeker', 5: 'Crystal Maiden', 6: 'Drow Ranger', 7: 'Earthshaker', 8: 'Juggernaut', 9: 'Mirana', 10: 'Morphling', 11: 'Shadow Fiend', 12: 'Phantom Lancer', 13: 'Puck', 14: 'Pudge', 15: 'Razor', 16: 'Sand King', 17: 'Storm Spirit', 18: 'Sven', 19: 'Tiny', 20: 'Vengeful Spirit', 21: 'Windranger', 22: 'Zeus', 23: 'Kunkka', 24: '', 25: 'Lina', 26: 'Lion', 27: 'Shadow Shaman', 28: 'Slardar', 29: 'Tidehunter', 30: 'Witch Doctor', 31: 'Lich', 32: 'Riki', 33: 'Enigma', 34: 'Tinker', 35: 'Sniper', 36: 'Necrophos', 37: 'Warlock', 38: 'Beastmaster', 39: 'Queen Of Pain', 40: 'Venomancer', 41: 'Faceless Void', 42: 'Wraith King', 43: 'Death Prophet', 44: 'Phantom Assassin', 45: 'Pugna', 46: 'Templar Assassin', 47: 'Viper', 48: 'Luna', 49: 'Dragon Knight', 50: 'Dazzle', 51: 'Clockwerk', 52: 'Leshrac', 53: "Nature'S Prophet", 54: 'Lifestealer', 55: 'Dark Seer', 56: 'Clinkz', 57: 'Omniknight', 58: 'Enchantress', 59: 'Huskar', 60: 'Night Stalker', 61: 'Broodmother', 62: 'Bounty Hunter', 63: 'Weaver', 64: 'Jakiro', 65: 'Batrider', 66: 'Chen', 67: 'Spectre', 68: 'Ancient Apparition', 69: 'Doom', 70: 'Ursa', 71: 'Spirit Breaker', 72: 'Gyrocopter', 73: 'Alchemist', 74: 'Invoker', 75: 'Silencer', 76: 'Outworld Destroyer', 77: 'Lycan', 78: 'Brewmaster', 79: 'Shadow Demon', 80: 'Lone Druid', 81: 'Chaos Knight', 82: 'Meepo', 83: 'Treant Protector', 84: 'Ogre Magi', 85: 'Undying', 86: 'Rubick', 87: 'Disruptor', 88: 'Nyx Assassin', 89: 'Naga Siren', 90: 'Keeper Of The Light', 91: 'Io', 92: 'Visage', 93: 'Slark', 94: 'Medusa', 95: 'Troll Warlord', 96: 'Centaur Warrunner', 97: 'Magnus', 98: 'Timbersaw', 99: 'Bristleback', 100: 'Tusk', 101: 'Skywrath Mage', 102: 'Abaddon', 103: 'Elder Titan', 104: 'Legion Commander', 105: 'Techies', 106: 'Ember Spirit', 107: 'Earth Spirit', 108: 'Underlord', 109: 'Terrorblade', 110: 'Phoenix', 111: 'Oracle', 112: 'Winter Wyvern', 113: 'Arc Warden', 114: 'Monkey King', 115: '', 116: '', 117: '', 118: '', 119: 'Dark Willow', 120: 'Pangolier', 121: 'Grimstroke', 122: '', 123: 'Hoodwink', 124: '', 125: '', 126: 'Void Spirit', 127: '', 128: 'Snapfire', 129: 'Mars', 130: '', 131: 'Ringmaster', 132: '', 133: '', 134: '', 135: 'Dawnbreaker', 136: 'Marci', 137: 'Primal Beast', 138: 'Muerta', 145: 'Kez'};

  constructor(
    private databaseService: DatabaseService,
    private route: ActivatedRoute  // Для доступа к параметрам маршрута
  ) {}


  ngOnInit(): void {
    // Получаем id из параметров маршрута
    this.loadHeroNames();
    this.route.params.subscribe(params => {
      this.heroName = params['id'];  // Получаем имя героя из маршрута
      this.loadHeroItems(this.heroName, 1);  // Загружаем предметы для героя с позицией "Carry"
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

  // Обработчик для изменения выбранной роли
  onRoleChange(role: string) {
    this.selectedRole = role;
    const position = this.getPositionFromRole(role); // Получаем позицию роли
    this.loadHeroItems(this.heroName, position);
  }

  // Метод для загрузки предметов героя по имени и роли
  loadHeroItems(heroName: string, position: number) {
    let id = 0;
    for (let [key, value] of Object.entries(this.hero_id)) {
      if (value === heroName) {
        id = Number(key);  // Преобразуем ключ в число
        break;  // Прерываем цикл, как только нашли нужного героя
      }
    }
    console.log(id, heroName);
    this.databaseService.getHeroItems(heroName, position).subscribe(data => {
      this.heroItems = this.organizeItemsByTiming(data);
    });
  }

  // Преобразуем данные предметов, группируя их по времени (Start, Early, Mid, Late)
  organizeItemsByTiming(items: Item[]) {
    const groupedItems = {
      startItems: items.filter(item => item.timing === 'Start'),
      earlyGameItems: items.filter(item => item.timing === 'Early Game'),
      midGameItems: items.filter(item => item.timing === 'Mid Game'),
      lateGameItems: items.filter(item => item.timing === 'Late Game'),
    };
    return groupedItems;
  }

  // Получаем позицию из строки (например, "Carry" => 1)
  getPositionFromRole(role: string): number {
    const roleMap = {
      Carry: 1,
      Middle: 2,
      Offlane: 3,
      SemiSupport: 4,
      FullSupport: 5
    };
    return roleMap[role as keyof typeof roleMap] || 1;  // Возвращаем 1 по умолчанию, если роль не найдена
  }
}