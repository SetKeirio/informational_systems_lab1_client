import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../../algorithms/database.algorithm';
import { SpaceMarineRequest } from '../../entities/SpaceMarineRequest';
import { SpaceMarineEdit } from 'src/app/entities/SpaceMarineEdit';
import { Coordinates } from 'src/app/entities/Coordinates';
import { ChapterResponse } from 'src/app/entities/ChapterResponse';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditSpaceMarineComponent implements OnInit {
  spaceMarine: SpaceMarineRequest = {
    name: '',
    coordinatesId: { x: 0, y: 0 },
    chapterId: 0,
    health: undefined,
    category: '',
    weaponType: '',
    meleeWeapon: '',
    userId: 0,
  };

  spaceMarineEdit: SpaceMarineEdit;
  temp: Coordinates;

  categories: String[] = [];
  weaponTypes: String[] = [];
  meleeWeapons: String[] = [];
  chapters: ChapterResponse[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private databaseService: DatabaseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const spaceMarineId = this.route.snapshot.paramMap.get('id');
    if (spaceMarineId) {
      this.loadSpaceMarineById(Number(spaceMarineId));
    }
    this.loadCategories();
    this.loadWeaponTypes();
    this.loadMeleeWeapons();
    this.loadChapters();
  }

  loadCategories() {
    this.databaseService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  loadWeaponTypes() {
    this.databaseService.getWeaponTypes().subscribe(data => {
      this.weaponTypes = data;
    });
  }

  loadMeleeWeapons() {
    this.databaseService.getMeleeWeapons().subscribe(data => {
      this.meleeWeapons = data;
    });
  }

  loadChapters() {
    this.databaseService.getChapters(0, 0) // Предположим, что вы загружаете все главы
      .subscribe(data => {
        this.chapters = data;
      });
  }

  loadSpaceMarineById(id: number): void{
    this.databaseService.getSpaceMarineById(0, 0, id)
      .subscribe(data => {
        this.spaceMarineEdit = data; // предполагается, что сервер возвращает массив объектов
        console.log(this.spaceMarineEdit);
        this.spaceMarine.name = this.spaceMarineEdit.name;
        this.databaseService.getCoordinates(0, 0, this.spaceMarineEdit.coordinatesId).subscribe(data => {
            this.spaceMarine.coordinatesId.x = data.x;
            this.spaceMarine.coordinatesId.y = data.y;
            console.log(data);
        })
        this.spaceMarine.health = this.spaceMarineEdit.health;
        this.spaceMarine.chapterId = this.spaceMarineEdit.chapterId;
        this.databaseService.getWeaponTypeById(this.spaceMarineEdit.weaponTypeId).subscribe(data => {
            this.spaceMarine.weaponType = data.weaponName;
        })
        this.databaseService.getMeleeWeaponTypeById(this.spaceMarineEdit.meleeWeaponId).subscribe(data => {
            this.spaceMarine.meleeWeapon = data.meleeWeaponName;
        })
        this.databaseService.getAstartesCategoryById(this.spaceMarineEdit.categoryId).subscribe(data => {
            this.spaceMarine.category = data.categoryName;
        })
        // Здесь вы можете установить общее количество элементов, если сервер возвращает это значение
        // this.totalItems = data.totalElements; // пример, в зависимости от ответа сервера
      });
  }

  updateSpaceMarine() {
    const spaceMarineIdString = this.route.snapshot.paramMap.get('id');
    if (spaceMarineIdString) {
    const spaceMarineId: number = +spaceMarineIdString;
    this.databaseService.updateSpaceMarine(this.spaceMarine, spaceMarineId).subscribe({
      next: () => {
        this.successMessage = 'Space Marine успешно обновлен!';
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Ошибка при обновлении Space Marine';
        this.successMessage = '';
        console.error(error);
      }
    });
  }
  }
}