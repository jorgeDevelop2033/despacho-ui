import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { CuadreReporteComponent } from '../pages/cuadre/reportes/cuadre-reporte.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
// Puedes importar íconos de lucide-angular si los usas
import { LucideAngularModule, Folder, ChevronDown, LineChart, Calendar, User, BarChart, Truck, Key, Users, UserPlus, LogOut } from 'lucide-angular';

@Component({
  selector: 'app-layout-principal',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    SidebarMenuComponent,
    CuadreReporteComponent,
    LucideAngularModule
  ]
})
export class LayoutComponent {
  menuAbierto: boolean = false;
  currentYear: number = new Date().getFullYear();
  userRole: string | null = null;
  mostrarSubmenuBalance: boolean = false;
  mostrarSubmenuUsuarios: boolean = false;
  mostrarSubmenuProductos: boolean = false;

  constructor(private router: Router) {
    this.obtenerRolUsuario();
  }

  obtenerRolUsuario(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.userRole = decoded?.role ?? null;
      } catch (error) {
        console.error('Error decodificando el token:', error);
        this.userRole = null;
      }
    } else {
      this.userRole = null;
    }
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  navegar(ruta: string): void {
    this.menuAbierto = false; // Cierra el menú al hacer clic
    this.router.navigate([ruta]);
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    this.userRole = null;
    this.menuAbierto = false;
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    const isClickInsideMenu = targetElement.closest('aside');
    const isMenuButton = targetElement.closest('button[aria-label="Menú"]');
    if (!isClickInsideMenu && !isMenuButton && this.menuAbierto) {
      this.menuAbierto = false;
    }
  }

  // Métodos para alternar submenús con íconos
  toggleSubmenuBalance(): void {
    this.mostrarSubmenuBalance = !this.mostrarSubmenuBalance;
    this.mostrarSubmenuUsuarios = false; // Opcional: cierra otros submenús
  }

  toggleSubmenuUsuarios(): void {
    this.mostrarSubmenuUsuarios = !this.mostrarSubmenuUsuarios;
    this.mostrarSubmenuBalance = false; // Opcional: cierra otros submenús
  }
}
