import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContentType } from '../types/types';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query('page') page: number = 1, @Query('type') type: ContentType = ContentType.Movie) {
    return this.moviesService.findAll(page, type);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async search(@Query('query') query: string, @Query('type') type?: ContentType) {
    return this.moviesService.search(query, type);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Query('type') type: ContentType = ContentType.Movie) {
    return this.moviesService.findOne(id, type);
  }

  @Get(':id/trailer')
  @UseGuards(JwtAuthGuard)
  async getTrailer(@Param('id') id: string, @Query('type') type: ContentType = ContentType.Movie) {
    return this.moviesService.getTrailer(id, type);
  }
}