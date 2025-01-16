import { Component } from '@angular/core';
import { CharacterWinRate } from 'src/app/entities/CharacterWinRate';
import { DatabaseService } from 'src/app/algorithms/database.algorithm';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-updates',
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.css']
})
export class UpdatesComponent implements OnInit {
    heroes: CharacterWinRate[] = [];  // Массив для хранения всех героев
    filteredHeroes: CharacterWinRate[] = [];  // Массив для фильтрации героев
    positions = [
        { name: 'Carry', value: 1 },
        { name: 'Mid', value: 2 },
        { name: 'Offlane', value: 3 },
        { name: 'Semi Support', value: 4 },
        { name: 'Full Support', value: 5}
      ];
    patches: string[] = [];
    heroNames: string[] = [];
    
    selectedPosition: string = '';
    selectedPatch: string = '';
    selectedHero: string = '';
  
    currentPage = 1;
    itemsPerPage = 5;
  
    constructor(private databaseService: DatabaseService) {}
  
    ngOnInit(): void {
      // Загружаем данные с сервера при инициализации компонента
      this.databaseService.getCharacterWinRates().subscribe(data => {
        this.heroes = data;  // Сохраняем полученные данные
        this.filteredHeroes = [...this.heroes];  // Копируем данные для фильтрации
        this.patches = Array.from(new Set(this.heroes.map(hero => hero.patch)));
        this.heroNames = Array.from(new Set(this.heroes.map(hero => hero.heroName)));

        // Если патч не выбран, установить пустое значение по умолчанию
        if (this.selectedPatch && !this.patches.includes(this.selectedPatch)) {
          this.selectedPatch = '';
        }
      });
    }
  
    // Фильтрация по позиции и патчу
    filterTable() {
        this.filteredHeroes = this.heroes.filter(hero => {
          // Конвертируем выбранную позицию в число
          const selectedPositionValue = this.selectedPosition ? parseInt(this.selectedPosition, 10) : null;
          const heroPositionValue = Number(hero.position); // Предполагаем, что hero.position - это строка

          const matchesPosition = selectedPositionValue !== null ? heroPositionValue === selectedPositionValue : true;
          const matchesPatch = this.selectedPatch ? hero.patch === this.selectedPatch : true;

          return matchesPosition && matchesPatch;
        });

        

        // Сортировка по винрейту (от самого высокого к самому низкому)
        this.filteredHeroes.sort((a, b) => b.winrate - a.winrate);
        
        // Сброс текущей страницы при изменении фильтров
        this.currentPage = 1;
    }

    aggregateHeroes(heroes: CharacterWinRate[]): CharacterWinRate[] {
        const aggregated: { [key: string]: CharacterWinRate } = {};

        heroes.forEach(hero => {
            const key = `${hero.heroName}_${hero.patch}`;  // Добавляем патч в ключ для агрегации
            if (!aggregated[key]) {
                aggregated[key] = { 
                    heroName: hero.heroName, 
                    position: 'Все',  // Позиция будет "Все" для агрегированного героя
                    patch: hero.patch,
                    matches: 0,
                    winrate: 0
                };
            }

            aggregated[key].matches += hero.matches;
            aggregated[key].winrate += hero.winrate * hero.matches;
        });

        // Расчитываем средний винрейт для каждого героя
        const aggregatedHeroes = Object.values(aggregated).map(hero => {
            hero.winrate /= hero.matches;  // Средний винрейт
            return hero;
        });

        return aggregatedHeroes;
    }
  
    // Обработчик смены страницы
    onPageChange(page: number) {
      this.currentPage = page;
    }
  
    // Метод для получения текущей страницы элементов
    get currentHeroes(): CharacterWinRate[] {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredHeroes.slice(start, end);  // Возвращаем только элементы для текущей страницы
    }
}