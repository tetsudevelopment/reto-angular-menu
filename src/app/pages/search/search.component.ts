import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Dish, MenuStats } from '../../interfaces/menu.interface';
import { MenuService } from '../../services/menu.service';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { DishComponent } from "../../shared/dish/dish.component";
import Swal from 'sweetalert2';
import { MenuStatsComponent } from "../../shared/menu-stats/menu-stats.component";
import { Router } from '@angular/router';

@Component({
  templateUrl: './search.component.html',
  imports: [ReactiveFormsModule, DishComponent, MenuStatsComponent],
})
export default class SearchComponent implements OnInit {
  searchControl = new FormControl('');
  results = signal<Dish[]>([]);

  menu = signal<Dish[]>([]);
  menuStats = signal<MenuStats>({
    dishes: 0,
    vegan: 0,
    nonVegan: 0,
    pricePerServing: 0,
    readyInMinutes: 0,
    healthScore: 0,
  })

  private readonly menuService = inject(MenuService);
  private readonly router = inject(Router);

  loadMenu() {
    this.menu.set(this.menuService.getMenu());
    this.menuStats.set(this.menuService.getMenuStats());
  }

  ngOnInit() {
    this.loadMenu();
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (!query || query.length < 3) {
            return of<Dish[]>([]);
          }
          return this.menuService.searchMenu(query);
        })
      ).subscribe((dishes) => {
        this.results.set(dishes);
      });

  }

  addToMenu(dish: Dish) {
    this.menuService.setMenu([...this.menuService.getMenu(), dish]);
    this.loadMenu();
    this.showSuccess(dish);
  }

  showSuccess(dish: Dish) {
    Swal.fire({
      title: 'Agregado al menú',
      text: `${dish.title} ha sido agregado al menú`,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  gotTohome () {
    this.router.navigate(['/']);
  }
}
