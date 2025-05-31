import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    console.warn('No token found.');
    return router.createUrlTree(['/login']);
  }

  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (!decoded.exp || decoded.exp < currentTime) {
      console.warn('Token expired.');
      return router.createUrlTree(['/login']);
    }

    console.log('Decoded token:', decoded);

    // Lista de roles permitidos
    const rolesPermitidos = ['Administrador', 'Jefes', 'Operador']; // Añade más roles según necesites

    if (!rolesPermitidos.includes(decoded.role)) {
      console.warn(`Access denied: role ${decoded.role}`);
      return router.createUrlTree(['/login']);
    }

    return true;
  } catch (e) {
    console.error('Invalid token:', e);
    return router.createUrlTree(['/login']);
  }
};
