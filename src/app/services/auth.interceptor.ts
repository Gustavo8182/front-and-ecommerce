import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Recupera o token do localStorage
  const token = localStorage.getItem('auth-token');

  // 2. Se tiver token, clona a requisição e adiciona o cabeçalho Authorization
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }

  // 3. Se não tiver token, segue normal (para login ou rotas públicas)
  return next(req);
};
