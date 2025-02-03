import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
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

  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get favorites for the logged-in user' })
  @ApiResponse({ status: 200, description: 'List of favorite movies/series' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getFavorites(@Request() req) {
    return this.usersService.getFavorites(req.user.userId);
  }

  @Put('favorites/:movieId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a movie/series to favorites for the logged-in user' })
  @ApiResponse({ status: 200, description: 'Movie/series added to favorites' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addFavorite(@Request() req, @Param('movieId') movieId: string) {
    return this.usersService.addFavorite(req.user.userId, movieId);
  }

  @Delete('favorites/:movieId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a movie/series from favorites for the logged-in user' })
  @ApiResponse({ status: 200, description: 'Movie/series removed from favorites' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async removeFavorite(@Request() req, @Param('movieId') movieId: string) {
    return this.usersService.removeFavorite(req.user.userId, movieId);
  }
}