import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999999),
          email,
          password,
        } as User; // treat it as a User entity
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('yeap@yeap.com', 'asdf');
    expect(service.signup('yeap@yeap.com', 'asdf')).rejects.toThrow();
  });

  it('throws if signin is called with an unused email', () => {
    expect(
      service.signin('asdfsadf@asdfsdf.com', 'asdfasdf'),
    ).rejects.toThrow();
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('email@email.com', 'pass');

    expect(service.signin('email@email.com', 'wrong pass')).rejects.toThrow();
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('abc@abc.com', 'password');
    const user = await service.signin('abc@abc.com', 'password');
    expect(user).toBeDefined();
  });
});
