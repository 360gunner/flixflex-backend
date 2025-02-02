import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  @Get(':username')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('username') username: string): Promise<User | null> {
    return this.usersService.findOne(username);
  }

  @Get(':userId/favorites')
  @UseGuards(JwtAuthGuard)
  async getFavorites(@Param('userId') userId: string): Promise<string[]> {
    const user = await this.usersService.findOne(userId);
    return user?.favorites ?? [];
  }

  @Put(':userId/favorites/:movieId')
  @UseGuards(JwtAuthGuard)
  async addFavorite(
    @Param('userId') userId: string,
    @Param('movieId') movieId: string,
  ): Promise<User | null> {
    return this.usersService.addFavorite(userId, movieId);
  }

  @Delete(':userId/favorites/:movieId')
  @UseGuards(JwtAuthGuard)
  async removeFavorite(
    @Param('userId') userId: string,
    @Param('movieId') movieId: string,
  ): Promise<User | null> {
    return this.usersService.removeFavorite(userId, movieId);
  }
}
