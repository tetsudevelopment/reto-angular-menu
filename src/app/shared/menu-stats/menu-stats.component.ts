import { Component, input } from '@angular/core';
import { MenuStats } from '../../interfaces/menu.interface';

@Component({
  selector: 'app-menu-stats',
  imports: [],
  templateUrl: './menu-stats.component.html',
})
export class MenuStatsComponent {
  stats = input.required<MenuStats>();
}
