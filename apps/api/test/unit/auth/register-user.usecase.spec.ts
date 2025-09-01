/* eslint-disable @typescript-eslint/unbound-method */
import { RegisterUserUseCase } from '../../../src/modules/auth/application/use-cases/register-user.usecase';
import { UserRepositoryPort } from '../../../src/modules/auth/domain/ports/user-repository.port';
import { PasswordHasherPort } from '../../../src/modules/auth/domain/ports/password-hasher.port';

describe('RegisterUserUseCase', () => {
  let usersRepo: jest.Mocked<UserRepositoryPort>;
  let hasher: jest.Mocked<PasswordHasherPort>;
  let useCase: RegisterUserUseCase;

  beforeEach(() => {
    usersRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    };
    hasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    useCase = new RegisterUserUseCase(usersRepo, hasher);
  });

  it('hashes password and creates the user', async () => {
    usersRepo.findByEmail.mockResolvedValue(null);
    hasher.hash.mockResolvedValue('hashed_pw');
    usersRepo.create.mockResolvedValue({
      id: 'u1',
      name: 'Alice',
      email: 'a@a.com',
    });

    const output = await useCase.execute({
      name: 'Alice',
      email: 'a@a.com',
      password: 'secret',
    });

    expect(usersRepo.findByEmail).toHaveBeenCalledWith('a@a.com');
    expect(hasher.hash).toHaveBeenCalledWith('secret');
    expect(usersRepo.create).toHaveBeenCalledWith({
      name: 'Alice',
      email: 'a@a.com',
      passwordHash: 'hashed_pw',
    });
    expect(output).toEqual({ id: 'u1', name: 'Alice', email: 'a@a.com' });
  });

  it('fails if email is already in use', async () => {
    usersRepo.findByEmail.mockResolvedValue({
      id: 'x',
      name: 'X',
      email: 'a@a.com',
      passwordHash: 'pw',
    });

    await expect(
      useCase.execute({ name: 'Alice', email: 'a@a.com', password: 'secret' }),
    ).rejects.toThrow('Email already in use');
  });
});
