import { Component, computed, EventEmitter, inject, input, OnInit, Output, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Dish, MenuStats } from '../../interfaces/menu.interface';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-dish',
  imports: [],
  templateUrl: './dish.component.html',
})
export class DishComponent {
  menu = input.required<Dish[]>();
  menuStats = input.required<MenuStats>();
  dish = input.required<Dish>();
  inSearch = input<Boolean>();
  @Output() remove = new EventEmitter();
  @Output() add = new EventEmitter();

  menuIds = computed(() => this.menu().map((dish) => dish.id));
  canAdd = computed(() =>
    this.inSearch() &&
    !this.menuIds().includes(this.dish().id) &&
    this.menuStats().dishes < 4 &&
    (!this.dish().vegan || this.menuStats().vegan < 2) &&
    (this.dish().vegan || this.menuStats().nonVegan < 2)
  );

  private readonly router = inject(Router);
  private readonly menuService = inject(MenuService);

  viewDetails(id: number) {
    this.router.navigate(['/detail', id]);
  }

  removeDish() {
    this.remove.emit();
  }

  addToMenu() {
    this.add.emit();
  }
}
