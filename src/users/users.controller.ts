import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':username')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user details by username' })
  @ApiParam({ name: 'username', description: 'The username of the user' })
  @ApiResponse({ status: 200, description: 'User details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Get(':userId/favorites')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user favorites' })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @ApiResponse({ status: 200, description: 'List of favorite movies/series' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getFavorites(@Param('userId') userId: string) {
    const user = await this.usersService.findOne(userId);
    return user?.favorites ?? [];
  }

  @Put(':userId/favorites/:movieId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a movie/series to favorites' })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @ApiParam({ name: 'movieId', description: 'The ID of the movie/series' })
  @ApiResponse({ status: 200, description: 'Movie/series added to favorites' })
  @ApiResponse({ status: 404, description: 'User or movie/series not found' })
  async addFavorite(
    @Param('userId') userId: string,
    @Param('movieId') movieId: string,
  ) {
    return this.usersService.addFavorite(userId, movieId);
  }

  @Delete(':userId/favorites/:movieId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a movie/series from favorites' })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @ApiParam({ name: 'movieId', description: 'The ID of the movie/series' })
  @ApiResponse({ status: 200, description: 'Movie/series removed from favorites' })
  @ApiResponse({ status: 404, description: 'User or movie/series not found' })
  async removeFavorite(
    @Param('userId') userId: string,
    @Param('movieId') movieId: string,
  ) {
    return this.usersService.removeFavorite(userId, movieId);
  }
}