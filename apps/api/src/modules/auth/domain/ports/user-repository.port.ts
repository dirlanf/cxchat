export interface UserRepositoryPort {
  findByEmail(email: string): Promise<{
    id: string;
    name: string;
    email: string;
    passwordHash: string;
  } | null>;
  findById(
    id: string,
  ): Promise<{ id: string; name: string; email: string } | null>;
  create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<{ id: string; name: string; email: string }>;
}

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');
