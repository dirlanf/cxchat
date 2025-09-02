/* eslint-disable @typescript-eslint/unbound-method */
import { LoginUserUseCase } from '../../../src/modules/auth/application/use-cases/login-user.usecase';
import { UserRepositoryPort } from '../../../src/modules/auth/domain/ports/user-repository.port';
import { PasswordHasherPort } from '../../../src/modules/auth/domain/ports/password-hasher.port';
import { JwtPort } from '../../../src/modules/auth/domain/ports/jwt.port';

describe('LoginUserUseCase', () => {
  let usersRepo: jest.Mocked<UserRepositoryPort>;
  let hasher: jest.Mocked<PasswordHasherPort>;
  let jwt: jest.Mocked<JwtPort>;
  let useCase: LoginUserUseCase;

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
    jwt = {
      signAccess: jest.fn(),
      verifyAccess: jest.fn(),
    };

    useCase = new LoginUserUseCase(usersRepo, hasher, jwt);
  });

  it('validates password and returns access_token', async () => {
    usersRepo.findByEmail.mockResolvedValue({
      id: 'u1',
      name: 'Alice',
      email: 'a@a.com',
      passwordHash: 'hashed',
    });
    hasher.compare.mockResolvedValue(true);
    jwt.signAccess.mockResolvedValue('jwt.token');

    const output = await useCase.execute({
      email: 'a@a.com',
      password: 'secret',
    });

    expect(hasher.compare).toHaveBeenCalledWith('secret', 'hashed');
    expect(jwt.signAccess).toHaveBeenCalledWith({ sub: 'u1', name: 'Alice' });
    expect(output).toEqual({
      access_token: 'jwt.token',
      user: { id: 'u1', name: 'Alice', email: 'a@a.com' },
    });
  });

  it('fails with invalid credentials', async () => {
    usersRepo.findByEmail.mockResolvedValue(null);
    await expect(
      useCase.execute({ email: 'a@a.com', password: 'x' }),
    ).rejects.toThrow('Invalid credentials');
  });
});
