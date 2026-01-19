import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('auth-token'); // Ou use seu AuthService

  if (token) {
    return true; // Tem token, pode passar
  } else {
    router.navigate(['/login']); // Sem token, vai pro login
    return false;
  }
};
