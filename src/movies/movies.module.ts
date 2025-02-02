import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TmdbService } from '../tmdb/tmdb.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService, TmdbService, ConfigService],
})
export class MoviesModule {}