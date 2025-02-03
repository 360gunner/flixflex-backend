import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ContentType } from '../types/types';
import { Movie } from '../movies/schemas/movie.schema';

@Injectable()
export class TmdbService {
  private readonly apiUrl = 'https://api.themoviedb.org/3';
  private readonly apiToken: string;

  constructor(
    private configService: ConfigService,
    @InjectModel(Movie.name) private movieModel: Model<Movie>, 
  ) {
    this.apiToken = this.configService.get<string>('TMDB_API_TOKEN') || '';
  }

  private getAxiosInstance() {
    return axios.create({
      baseURL: this.apiUrl,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.apiToken}`,
      },
    });
  }

  private async cacheMovies(movies: any[], isMovie: boolean) {
    const operations = movies.map((movie) => ({
      updateOne: {
        filter: { apiId: movie.id }, 
        update: { $set: { title: movie.title, isMovie, details: movie } },
        upsert: true, 
      },
    }));

    try {
      await this.movieModel.bulkWrite(operations);
    } catch (error) {
      console.error('Error caching movies:', error);
    }
  }

  async fetchMovieDetails(movieApiId: string, type: ContentType) {
    const response = await this.getAxiosInstance().get(`/${type}/${movieApiId}`);
    const details = response.data;

    await this.cacheMovies([details], type === ContentType.Movie);

    return details;
  }

  async fetchMovieTrailer(movieApiId: string, type: ContentType) {
    let movie = await this.movieModel.findOne({ apiId: movieApiId });
    if (movie && movie.trailer) {
      return { url: movie.trailer };
    }

    const response = await this.getAxiosInstance().get(`/${type}/${movieApiId}/videos`);
    const trailer = response.data.results.find(
      (video: any) => video.site === 'YouTube' && video.type === 'Trailer',
    );
    let trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;

    if (!trailerUrl) {
      if (movie && movie.details && movie.details.imdb_id) {
        trailerUrl = `https://www.imdb.com/title/${movie.details.imdb_id}`;
      } else {
        const details = await this.fetchMovieDetails(movieApiId, type);
        if (details.imdb_id) {
          trailerUrl = `https://www.imdb.com/title/${details.imdb_id}`;
          movie = await this.movieModel.findOneAndUpdate(
            { apiId: movieApiId },
            { $set: { trailer: trailerUrl, details: details } },
            { new: true, upsert: true },
          );
        }
      }
    } else {
      movie = await this.movieModel.findOneAndUpdate(
        { apiId: movieApiId },
        { $set: { trailer: trailerUrl } },
        { new: true, upsert: true },
      );
    }

    return { url: trailerUrl };
  }

  async fetchMoviesWithPagination(page: number = 1, type: ContentType) {
    const ITEMS_PER_PAGE = 10;
    const response = await this.getAxiosInstance().get(
      `/${type}/popular?language=en-US&page=${Math.ceil(page / 2)}`,
    );

    await this.cacheMovies(response.data.results, type === ContentType.Movie);

    const startIndex = page % 2 === 1 ? 0 : ITEMS_PER_PAGE;
    const results = response.data.results.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    return {
      page: page,
      results: results,
      total_results: response.data.total_results,
      total_pages: Math.ceil(response.data.total_pages * 2),
    };
  }

  async fetchTopMoviesOrSeries(type?: ContentType) {
    if (type) {
      const response = await this.getAxiosInstance().get(`/${type}/top_rated?page=1`);

      // Cache the fetched movies/series
      await this.cacheMovies(response.data.results, type === ContentType.Movie);

      return response.data.results.slice(0, 5);
    } else {
      const movieResponse = await this.getAxiosInstance().get(`/movie/top_rated?page=1`);
      const seriesResponse = await this.getAxiosInstance().get(`/tv/top_rated?page=1`);

      // Cache the fetched movies and series
      await Promise.allSettled([
        this.cacheMovies(movieResponse.data.results, true),
        this.cacheMovies(seriesResponse.data.results, false),
      ]);

      return {
        movies: movieResponse.data.results.slice(0, 5),
        series: seriesResponse.data.results.slice(0, 5),
      };
    }
  }

  async generalSearch(query: string, type?: ContentType) {
    if (type) {
      const response = await this.getAxiosInstance().get(
        `/search/${type}?query=${encodeURIComponent(query)}`,
      );

      // Cache the fetched movies/series
      await this.cacheMovies(response.data.results, type === ContentType.Movie);

      return response.data.results;
    } else {
      const movieResponse = await this.getAxiosInstance().get(
        `/search/movie?query=${encodeURIComponent(query)}`,
      );
      const seriesResponse = await this.getAxiosInstance().get(
        `/search/tv?query=${encodeURIComponent(query)}`,
      );

      // Cache the fetched movies and series
      await Promise.allSettled([
        this.cacheMovies(movieResponse.data.results, true),
        this.cacheMovies(seriesResponse.data.results, false),
      ]);

      return {
        movies: movieResponse.data.results,
        series: seriesResponse.data.results,
      };
    }
  }
}