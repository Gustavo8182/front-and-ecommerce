export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Índice da página (0, 1, 2...)
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}
