import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  @Get(':username')
  async findOne(@Param('username') username: string): Promise<User | null> {
    return this.usersService.findOne(username);
  }

  @Put(':userId/favorites/:movieId')
  async addFavorite(
    @Param('userId') userId: string,
    @Param('movieId') movieId: string,
  ): Promise<User | null> {
    return this.usersService.addFavorite(userId, movieId);
  }

  @Delete(':userId/favorites/:movieId')
  async removeFavorite(
    @Param('userId') userId: string,
    @Param('movieId') movieId: string,
  ): Promise<User | null> {
    return this.usersService.removeFavorite(userId, movieId);
  }
}