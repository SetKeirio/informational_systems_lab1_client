import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpaceMarine } from '../entities/SpaceMarine'; // импортируйте ваш интерфейс модели
import { AdminApproval } from '../entities/AdminApproval';
import { SpaceMarineRequest } from '../entities/SpaceMarineRequest';
import { ChapterRequest } from '../entities/ChapterRequest';
import { HttpHeaders } from '@angular/common/http';
import { ChapterResponse } from '../entities/ChapterResponse';
import { SpaceMarineEdit } from '../entities/SpaceMarineEdit';
import { Coordinates } from '../entities/Coordinates';
import { Weapon } from '../entities/Weapon';
import { MeleeWeapon } from '../entities/MeleeWeapon';
import { AstartesCategory } from '../entities/AstartesCategory';
import { Data } from './data';
import { FileService } from './file.algorithm';
import { Import } from '../entities/Import';
import { Hero } from '../entities/Hero';
import { CharacterName } from '../entities/CharacterName';
import { CharacterWinRate } from '../entities/CharacterWinRate';
import { Item } from '../entities/Item';
import { Pick } from '../entities/Pick';
import { Combination } from '../entities/Combination';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private serverUrl = this.data.http + this.data.host + this.data.port;
  private dotaUrl = this.data.http + this.data.host + this.data.dota;
  private url = this.serverUrl + '/spacemarines'; // ваш API
  private userUrl = this.serverUrl + '/users';
  private adminUrl = this.serverUrl + '/adminapprovals';
  private meleeWeaponUrl = this.serverUrl + '/meleeweapons';
  private weaponUrl = this.serverUrl + '/weapons';
  private categoryUrl = this.serverUrl + '/astartescategory';
  private chapterUrl = this.serverUrl + '/chapters'; // API для chapters
  private coordinatesUrl = this.serverUrl + '/coordinates'; // API для chapters
  private heroesUrl = this.dotaUrl + '/heroes'; // API для chapters
  private characterWinratesUrl = this.dotaUrl + '/herowinrates';
  private itemsUrl = this.dotaUrl + '/itemusage';

  constructor(private http: HttpClient, private data: Data) {}

  getTokenHeader(): HttpHeaders{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return headers;
  }

  predictStatistics(pick: Pick): Observable<String[]> {
    return this.http.post<String[]>(`${this.characterWinratesUrl}/predict`, pick);
  }

  calculatePositions(pick: Pick, team: number): Observable<String[][]> {
    return this.http.post<String[][]>(`${this.characterWinratesUrl}/position/${team}`, pick);
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.heroesUrl}`); // Пример API для получения типов оружия
  }

  getHeroNames(): Observable<CharacterName[]> {
    return this.http.get<CharacterName[]>(`${this.heroesUrl}/names`);
  }

  getCharacterWinRates(): Observable<CharacterWinRate[]> {
    return this.http.get<CharacterWinRate[]>(this.characterWinratesUrl);  // Запрос для получения всех винрейтов героев
  }

  getHeroItems(characterName: String, position: number): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.itemsUrl}/items/${characterName}/${position}`);  // Запрос для получения предметов героя
  }

  getSpaceMarines(page: number, size: number): Observable<SpaceMarine[]> {
    return this.http.get<SpaceMarine[]>(`${this.url}/table`);
  }

  getCategoryCount(categoryId: number): Observable<number> {
    return this.http.get<number>(`${this.url}/category-greater-than/${categoryId}`);
  }

  calculateAverageHealth(): Observable<number> {
    
    return this.http.get<number>(`${this.url}/average-health`);
  }

  getHealthFilteredSpaceMarines(page: number, size: number, health: number): Observable<SpaceMarine[]> {
    return this.http.get<SpaceMarine[]>(`${this.url}/health-less-than/${health}`);
  }

  getSpaceMarineById(page: number, size: number, id: number): Observable<SpaceMarineEdit> {
    return this.http.get<SpaceMarineEdit>(`${this.url}/${id}`);
  }

  getSpaceMarineByCategory(name: string): Observable<SpaceMarineEdit[]> {
    const headers = this.getTokenHeader();
    return this.http.get<SpaceMarineEdit[]>(`${this.url}/category/${name}`, { headers });
  }
  
  excludeSpaceMarineFromCategoryById(page: number, size: number, id: number): Observable<SpaceMarine[]> {
    return this.http.get<SpaceMarine[]>(`${this.url}/exclude/${id}`);
  }

  removeAstartesCategory(categoryId: number): Observable<string> {
    return this.http.get(`${this.url}/remove-category/${categoryId}`, { responseType: 'text' });
}

  approveUser(id: number): Observable<string> {
      return this.http.get(`${this.userUrl}/${id}/approve`, { responseType: 'text' });
  }

  rejectUser(id: number): Observable<string> {
    return this.http.get(`${this.userUrl}/${id}/reject`, { responseType: 'text' });
  }

  requestAdminRights(id: number): Observable<string> {
    return this.http.get(`${this.adminUrl}/request-admin-rigths/${id}`, { responseType: 'text' });
  }

  getAdminRequests(): Observable<AdminApproval[]> {
    return this.http.get<AdminApproval[]>(`${this.adminUrl}/admin-requests`);
  }

  getUsernameFromId(id: number): Observable<string> {
    return this.http.get(`${this.userUrl}/user/${id}`, { responseType: 'text' });
  }

  getCategories() {
    return this.http.get<String[]>(`${this.categoryUrl}/names`); // Пример API для получения категорий
  }
  
  uploadFile(formData: FormData): Observable<any> {
    const headers = this.getTokenHeader();
    return this.http.post<any[]>(`${this.serverUrl}/importhistory/add`, formData, { headers });
  }

  getImportHistory(): Observable<Import[]> {
    const headers = this.getTokenHeader();
    return this.http.get<Import[]>(`${this.serverUrl}/importhistory/table`, { headers });
  }

  downloadFile(id: number): Observable<ArrayBuffer> {
    const headers = this.getTokenHeader();
    return this.http.get(`${this.serverUrl}/importhistory/download/${id}`, { headers, responseType: 'arraybuffer' });
  }

  getCategoryIdByName(id: string) {
    return this.http.get<number>(`${this.categoryUrl}/name/${id}`); // Пример API для получения категорий
  }
  
  getWeaponTypes() {
    return this.http.get<String[]>(`${this.weaponUrl}/names`); // Пример API для получения типов оружия
  }
  
  getMeleeWeapons() {
    return this.http.get<String[]>(`${this.meleeWeaponUrl}/names`); // Пример API для получения типов ближнего оружия
  }

  createSpaceMarine(spaceMarine: SpaceMarineRequest): Observable<SpaceMarineRequest> {
    const headers = this.getTokenHeader();
    return this.http.post<SpaceMarineRequest>(`${this.url}/create`, spaceMarine, { headers });
  }

  updateSpaceMarine(spaceMarine: SpaceMarineRequest, id: number): Observable<SpaceMarineRequest> {
    const headers = this.getTokenHeader();
    return this.http.put<SpaceMarineRequest>(`${this.url}/update/${id}`, spaceMarine, { headers });
  }

  deleteSpaceMarine(id: number): Observable<any> {
    const headers = this.getTokenHeader();  // Получаем заголовки с токеном
    return this.http.delete(`${this.url}/delete/${id}`, { headers });  // Отправляем запрос на удаление с заголовками
  }

  isSpaceMarineBelongsToUser(id: number): Observable<boolean>{
    const headers = this.getTokenHeader();  // Получаем заголовки с токеном
    return this.http.get<boolean>(`${this.url}/belongsToUser/${id}`, { headers });  // Отправляем запрос на удаление с заголовками
  }

  createChapter(chapter: ChapterRequest): Observable<ChapterRequest> {
    return this.http.post<ChapterRequest>(`${this.chapterUrl}/create`, chapter);
  }

  getChapters(page: number, size: number): Observable<ChapterResponse[]> {
    return this.http.get<ChapterResponse[]>(`${this.chapterUrl}/table`);
  }

  getCoordinates(page: number, size: number, id: number): Observable<Coordinates> {
    return this.http.get<Coordinates>(`${this.coordinatesUrl}/${id}`);
  }

  getWeaponTypeById(id: number) {
    return this.http.get<Weapon>(`${this.weaponUrl}/${id}`); // Пример API для получения типов оружия
  }

  getMeleeWeaponTypeById(id: number) {
    return this.http.get<MeleeWeapon>(`${this.meleeWeaponUrl}/${id}`); // Пример API для получения типов оружия
  }

  getAstartesCategoryById(id: number) {
    return this.http.get<AstartesCategory>(`${this.categoryUrl}/${id}`); // Пример API для получения типов оружия
  }

  // добавьте другие методы (создание, обновление, удаление)
}