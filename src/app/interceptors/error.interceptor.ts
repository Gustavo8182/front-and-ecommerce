import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router); // Injeção de dependência moderna

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocorreu um erro inesperado! Tente novamente.';

      // Lógica para ler o JSON que criamos no Java (StandardError)
      if (error.error instanceof ErrorEvent) {
        // Erro do lado do cliente (Angular)
        errorMessage = `Erro no cliente: ${error.error.message}`;
      } else {
        // Erro que veio do Back-end (Java)
        // Verificamos se tem o campo "message" do nosso DTO Java
        if (error.error && error.error.message) {
          errorMessage = error.error.message;

          // Se for erro de validação (ValidationError do Java), temos a lista 'errors'
          if (error.status === 400 && error.error.errors) {
            // Transforma o array [{"fieldName": "cpf", "message": "inválido"}] em texto
            const validationMessages = error.error.errors
              .map((e: any) => `${e.fieldName}: ${e.message}`)
              .join(' | ');
            errorMessage = `Validação: ${validationMessages}`;
          }
        }
      }

      // Tratamentos Específicos por Status Code
      if (error.status === 401 || error.status === 403) {
        alert('Sessão expirada ou sem permissão. Faça login novamente.');
        router.navigate(['/login']);
      } else {
        // Exibe o alerta com a mensagem tratada
        alert(errorMessage);
      }

      console.error('Erro capturado:', error);
      return throwError(() => error);
    })
  );
};
