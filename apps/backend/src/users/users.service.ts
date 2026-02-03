import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import type { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(email: string, password: string, fullname: string): Promise<User> {
    const hash = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { email, password: hash, fullname, username: email },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async validateUser(email: string, pwd: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(pwd, user.password);
    if (!match) return null;
    // omit passwordHash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        fullname: true,
        username: true,
      },
      orderBy: {
        email: 'asc',
      },
    });
  }
}
