import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async findOne(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async addFavorite(userId: string, movieId: string): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: movieId } },
      { new: true },
    );
  }

  async removeFavorite(userId: string, movieId: string): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { favorites: movieId } },
      { new: true },
    );
  }
}