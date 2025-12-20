export interface RegisterRequest {
  login: string;        // Email
  password: string;
  role: 'USER' | 'ADMIN';
  fullName: string;
  cpf: string;
  phone: string;
  birthDate: string;    // Formato 'yyyy-MM-dd'
}

// Adicionei este aqui para facilitar seu Login também
export interface LoginRequest {
  login: string;
  password: string;
}
