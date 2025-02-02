import { Injectable } from '@nestjs/common';
import { TmdbService } from '../tmdb/tmdb.service';
import { ContentType } from '../types/types';

@Injectable()
export class MoviesService {
  constructor(private readonly tmdbService: TmdbService) {}

  async findAll(page: number = 1, type: ContentType = ContentType.Movie) {
    return this.tmdbService.fetchMoviesWithPagination(page, type);
  }

  async findOne(id: string, type: ContentType = ContentType.Movie) {
    return this.tmdbService.fetchMovieDetails(id, type);
  }

  async search(query: string, type?: ContentType) {
    return this.tmdbService.generalSearch(query, type);
  }

  async getTrailer(id: string, type: ContentType = ContentType.Movie) {
    const trailerUrl = await this.tmdbService.fetchMovieTrailer(id, type);
    return { url: trailerUrl };
  }
}