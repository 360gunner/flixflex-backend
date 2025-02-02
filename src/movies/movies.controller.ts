import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './schemas/movie.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query('page') page: number = 1): Promise<Movie[]> {
    return this.moviesService.findAll(page);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<Movie | null> {
    return this.moviesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() movie: Movie): Promise<Movie> {
    return this.moviesService.create(movie);
  }
}