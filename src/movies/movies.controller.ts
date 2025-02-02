import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ContentType } from '../types/types';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetch popular movies or series with pagination' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'type', required: false, description: 'Content type (movie or series)', enum: ContentType })
  @ApiResponse({ status: 200, description: 'List of movies/series' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('type') type: ContentType = ContentType.Movie,
  ) {
    return this.moviesService.findAll(page, type);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search for movies or series' })
  @ApiQuery({ name: 'query', required: true, description: 'Search query', example: 'avengers' })
  @ApiQuery({ name: 'type', required: false, description: 'Content type (movie or series)', enum: ContentType })
  @ApiResponse({ status: 200, description: 'Search results' })
  async search(
    @Query('query') query: string,
    @Query('type') type?: ContentType,
  ) {
    return this.moviesService.search(query, type);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetch details of a movie or series' })
  @ApiParam({ name: 'id', description: 'The ID of the movie/series', example: '12345' })
  @ApiQuery({ name: 'type', required: false, description: 'Content type (movie or series)', enum: ContentType })
  @ApiResponse({ status: 200, description: 'Movie/series details' })
  @ApiResponse({ status: 404, description: 'Movie/series not found' })
  async findOne(
    @Param('id') id: string,
    @Query('type') type: ContentType = ContentType.Movie,
  ) {
    return this.moviesService.findOne(id, type);
  }

  @Get(':id/trailer')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetch the trailer URL of a movie or series' })
  @ApiParam({ name: 'id', description: 'The ID of the movie/series', example: '12345' })
  @ApiQuery({ name: 'type', required: false, description: 'Content type (movie or series)', enum: ContentType })
  @ApiResponse({ status: 200, description: 'Trailer URL' })
  @ApiResponse({ status: 404, description: 'Movie/series not found' })
  async getTrailer(
    @Param('id') id: string,
    @Query('type') type: ContentType = ContentType.Movie,
  ) {
    return this.moviesService.getTrailer(id, type);
  }
}