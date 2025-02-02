import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ContentType } from '../types/types';

@Injectable()
export class TmdbService {
  private readonly apiUrl = 'https://api.themoviedb.org/3';
  private readonly apiToken: string;

  constructor(private configService: ConfigService) {
    this.apiToken = this.configService.get<string>('TMDB_API_TOKEN') || "";
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

  async fetchMovieDetails(movieApiId: string, type: ContentType) {
    const response = await this.getAxiosInstance().get(`/${type}/${movieApiId}`);
    return response.data;
  }

  async fetchMovieTrailer(movieApiId: string, type: ContentType) {
    const response = await this.getAxiosInstance().get(`/${type}/${movieApiId}/videos`);
    const trailer = response.data.results.find(
      (video: any) => video.site === 'YouTube' && video.type === 'Trailer',
    );
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  }

  async fetchMoviesWithPagination(page: number = 1, type: ContentType) {
    const ITEMS_PER_PAGE = 10;
    const response = await this.getAxiosInstance().get(
      `/${type}/popular?language=en-US&page=${Math.ceil(page / 2)}`,
    );
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
      return response.data.results.slice(0, 5);
    } else {
      const movieResponse = await this.getAxiosInstance().get(`/movie/top_rated?page=1`);
      const seriesResponse = await this.getAxiosInstance().get(`/tv/top_rated?page=1`);
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
      return response.data.results;
    } else {
      const movieResponse = await this.getAxiosInstance().get(
        `/search/movie?query=${encodeURIComponent(query)}`,
      );
      const seriesResponse = await this.getAxiosInstance().get(
        `/search/tv?query=${encodeURIComponent(query)}`,
      );
      return {
        movies: movieResponse.data.results,
        series: seriesResponse.data.results,
      };
    }
  }
}