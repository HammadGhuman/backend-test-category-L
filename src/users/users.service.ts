import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  create(createUserInput: CreateUserInput) {
    const newUser = this.userRepository.create(createUserInput);
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    const key = 'allUsers';
    const cachedUsers = await this.cacheManager.get<User[]>(key);

    if (cachedUsers) {
      return cachedUsers;
    }

    const users = this.userRepository.find();
    await this.cacheManager.set(key, users, 1000 * 60);
    return users;
  }

  async findOne(id: number): Promise<User> {
    const key = `user_id_${id}`;
    const cachedUser = await this.cacheManager.get<User>(key);

    if (cachedUser) {
      return cachedUser;
    }

    const user = this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('no user found');
    }
    await this.cacheManager.set(key, user, 1000 * 60);
    return user;
  }

  async getUserByUsername(username: string): Promise<User> {
    const key = `user_username_${username}`;
    const cachedUser = await this.cacheManager.get<User>(key);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException('no user');
    }

    await this.cacheManager.set(key, user, 1000 * 600);

    return user;
  }

  async update(
    id: number,
    updateUserInput: UpdateUserInput,
    user: User,
  ): Promise<User> {
    if (id != user.id) {
      throw new ForbiddenException('canot update found');
    }
    const existingUser = await this.userRepository.findOne({
      where: { id },
    });
    if (!existingUser) {
      throw new NotFoundException('no user found');
    }
    const data = await this.userRepository.save({
      ...existingUser,
      ...updateUserInput,
    });

    await this.cacheManager.del(`user_id_${id}`);

    return data;
  }

  async remove(id: number) {
    const existingUser = this.userRepository.findOneBy({ id });

    if (!existingUser) {
      throw new NotFoundException('no user found');
    }
    await this.cacheManager.del(`user_id_${id}`);
    await this.cacheManager.del(`allUsers`);
    return this.userRepository.delete({ id });
  }
}
