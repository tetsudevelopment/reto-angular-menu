import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Dish, MenuStats } from '../interfaces/menu.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private readonly menuStorageKey = 'menu';
  private readonly menuStatsStorageKey = 'menu-stats';

  private readonly storage = inject(StorageService);
  private readonly http = inject(HttpClient);

  async searchMenu(query: string): Promise<Dish[]> {
    const url = environment.apiUrl + '/recipes/complexSearch';

    const params = {
      apiKey: environment.apiKey,
      query,
      addRecipeInformation: true,
      number: 10
    };

    const response = await firstValueFrom(this.http.get<{ results: Dish[] }>(url, { params }));

    return response.results;
  }

  async getDish(id: number): Promise<Dish> {
    const url = environment.apiUrl + '/recipes/' + id + '/information';

    const params = {
      apiKey: environment.apiKey,
      includeNutrition: false
    };

    const response = await firstValueFrom(this.http.get<Dish>(url, { params }));

    return response;
  }

  setMenu(menu: Dish[]): void {
    this.storage.set<Dish[]>(this.menuStorageKey, menu);
    this.computeMenuStats(menu);
  }

  getMenu(): Dish[] {
    return this.storage.get<Dish[]>(this.menuStorageKey) || [];
  }

  private computeMenuStats(menu: Dish[]) {
    const stats: MenuStats = {
      dishes: menu.length,
      vegan: menu.filter(dish => dish.vegan).length,
      nonVegan: menu.filter(dish => !dish.vegan).length,
      pricePerServing: menu.reduce((total, dish) => total + dish.pricePerServing, 0) || 0,
      readyInMinutes: menu.reduce((total, dish) => total + dish.readyInMinutes, 0) / menu.length || 0,
      healthScore: menu.reduce((total, dish) => total + dish.healthScore, 0) / menu.length || 0
    };
    this.setMenuStats(stats);
  }

  private setMenuStats(stats: MenuStats): void {
    this.storage.set<MenuStats>(this.menuStatsStorageKey, stats);
  }

  getMenuStats(): MenuStats {
    return this.storage.get<MenuStats>(this.menuStatsStorageKey) || {
      dishes: 0,
      vegan: 0,
      nonVegan: 0,
      pricePerServing: 0,
      readyInMinutes: 0,
      healthScore: 0
    };
  }
}
