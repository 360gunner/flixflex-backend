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

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async search(@Query('query') query: string): Promise<Movie[]> {
    return this.moviesService.search(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<Movie | null> {
    return this.moviesService.findOne(id);
  }

  @Get(':id/trailer')
  @UseGuards(JwtAuthGuard)
  async getTrailer(@Param('id') id: string): Promise<{ trailerUrl: string }> {
    const movie = await this.moviesService.findOne(id);
    return { trailerUrl: movie?.trailerUrl ?? "" };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() movie: Movie): Promise<Movie> {
    return this.moviesService.create(movie);
  }
}