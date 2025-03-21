import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Movie } from 'src/movies/schemas/movie.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
  
    const savedUser = await newUser.save();
    const userObject = savedUser.toObject() as Omit<User, 'password'>; 
  
    delete (userObject as any).password;
    return userObject;
  }

  async findOne(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async getFavorites(userId: string): Promise<Movie[]> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      return [];
    }
    const favorites = await this.movieModel
      .find({ apiId: { $in: user.favorites } })
      .exec();

    return favorites;
  }

  async addFavorite(userId: string, movieId: string): Promise<any[]> {
    await this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: movieId } },
      { new: true },
    );
    return this.getFavorites(userId);
  }

  async removeFavorite(userId: string, movieId: string): Promise<any[]> {
    await this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { favorites: movieId } },
      { new: true },
    );
    return this.getFavorites(userId);
  }
}