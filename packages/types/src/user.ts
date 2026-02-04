export type UserRole = 'USER' | 'ADMIN' | 'WAREHOUSE';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
}

export interface Employee {
  id: string;
  name: string;
  lastname: string;
  nss: string;
  rfc: string;
  address: string;
  salary: number;
  vacationDays: number;
  birthdate: Date;
  isRehired: boolean;
  createdAt: Date;
  userId: string;
}

export type UserWithEmployee = User & { employee: Employee | null };
export type SafeUser = Omit<User, 'password'>;

export type CreateUserInput = Omit<User, 'id'>;
export type UpdateUserInput = Partial<Omit<CreateUserInput, 'password'>> & {
  password?: string;
};
