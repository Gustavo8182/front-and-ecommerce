import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Tenta pegar o token salvo
  const token = localStorage.getItem('auth-token');

  // --- LOG DE DEBUG ---
  console.log('Interceptando requisição:', req.url);
  console.log('Token encontrado?', token ? 'SIM' : 'NÃO');
  // --------------------

  // 2. Se tiver token, clona a requisição e adiciona o cabeçalho
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  // 3. Se não tiver token, manda como está
  return next(req);
};
