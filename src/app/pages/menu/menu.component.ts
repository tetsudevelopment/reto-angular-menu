import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DishComponent } from '../../shared/dish/dish.component';
import { Dish, MenuStats } from '../../interfaces/menu.interface';
import { MenuService } from '../../services/menu.service';
import { MenuStatsComponent } from "../../shared/menu-stats/menu-stats.component";


@Component({
  templateUrl: './menu.component.html',
  imports: [DishComponent, MenuStatsComponent]
})
export default class MenuComponent implements OnInit {
  menu = signal<Dish[]>([]);
  menuStats = signal<MenuStats>({
    dishes: 0,
    vegan: 0,
    nonVegan: 0,
    pricePerServing: 0,
    readyInMinutes: 0,
    healthScore: 0,
  });

  private readonly router = inject(Router);
  private readonly menuService = inject(MenuService);

  ngOnInit() {
    this.loadMenu();
  }

  loadMenu() {
    this.menu.set(this.menuService.getMenu());
    this.menuStats.set(this.menuService.getMenuStats());
  }

  removeDish(id: number) {
    const newMenu = this.menu().filter(dish => dish.id !== id);
    this.menuService.setMenu(newMenu);
    this.loadMenu();
  }

  goToAddDish() {
    this.router.navigate(['/search']);
  }
}
