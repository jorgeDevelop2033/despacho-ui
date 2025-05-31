import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-menu.component.html'
})
export class SidebarMenuComponent {
  @Input() currentYear = new Date().getFullYear();
  @Input() menuAbierto = false;
  @Input() toggleMenu!: () => void;
  @Input() navegar!: (ruta: string) => void;
}
