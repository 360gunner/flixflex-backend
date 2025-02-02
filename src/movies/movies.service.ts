import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from './schemas/movie.schema';

@Injectable()
export class MoviesService {
  constructor(@InjectModel('Movie') private movieModel: Model<Movie>) {}

  async findAll(): Promise<Movie[]> {
    return this.movieModel.find().exec();
  }

  async findOne(id: string): Promise<Movie | null> {
    return this.movieModel.findById(id).exec();
  }

  async create(movie: Movie): Promise<Movie> {
    const newMovie = new this.movieModel(movie);
    return newMovie.save();
  }
}