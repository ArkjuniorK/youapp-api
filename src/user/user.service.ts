import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { ProfileDto } from './dto/profile.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './schemas/user.schema';
import { HOROSCOPES, ZODIACS } from './user.constant';
import { RESTResponse, ZodiacAndHoroscope } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private usersModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<RESTResponse> {
    try {
      if (registerDto.password !== registerDto.confirmPassword) {
        throw new Error('mismatch password');
      }

      const rounds = 11;
      const password = await bcrypt.hash(registerDto.password, rounds);

      const user = new User();
      user.email = registerDto.email;
      user.username = registerDto.username;
      user.password = password;

      await this.usersModel.create(user);

      return {
        msg: 'success register',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<RESTResponse> {
    try {
      const user = await this.usersModel.findOne({
        username: loginDto.username,
      });

      if (!user) {
        throw new Error('user or password wrong');
      }

      const isCorrect = await bcrypt.compare(loginDto.password, user.password);
      if (!isCorrect) {
        throw new Error('user or password wrong');
      }

      const payload = { sub: user.id, username: user.username };
      const options: JwtSignOptions = { secret: 'mysecret' };
      const token = await this.jwtService.signAsync(payload, options);

      return {
        msg: 'success login',
        data: user,
        token: token,
      };
    } catch (error) {
      throw error;
    }
  }

  async getProfile(id: string): Promise<RESTResponse> {
    try {
      const user = await this.usersModel.findById(id);
      return { msg: 'success', data: user };
    } catch (error) {
      throw error;
    }
  }

  async setProfile(
    id: string,
    profileDto: ProfileDto,
    profilePic: Express.Multer.File,
  ): Promise<RESTResponse> {
    try {
      const user = await this.usersModel.findById(id);
      user.displayName = profileDto.displayName;
      user.birthday = profileDto.birthday;
      user.weight = profileDto.weight;
      user.height = profileDto.height;

      const zh = this.getHoroscopeAndZodiac(profileDto.birthday.toString());
      user.zodiac = zh.zodiac;
      user.horoscope = zh.horoscope;

      if (profilePic) {
        user.photo = this.setProfilePic(profilePic);
      }

      await user.save();

      return {
        msg: 'success',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  getHoroscopeAndZodiac(date: string): ZodiacAndHoroscope {
    const birthday = new Date(date);
    const birthdayDate = birthday.getDate();
    const birthdayMonth = birthday.getMonth() + 1;
    const birthdayYear = birthday.getFullYear();

    const zodiac = this.getZodiac(birthdayDate, birthdayMonth);
    const horoscope = this.getHoroscope(
      birthdayDate,
      birthdayMonth,
      birthdayYear,
    );

    return { zodiac, horoscope };
  }

  getZodiac(date: number, month: number): string {
    const dateMonth = new Date([month.toString(), date.toString()].join('-'));

    for (const z of ZODIACS) {
      const isGreaterThanStart = dateMonth >= z.start;
      const isLowerThanEnd = dateMonth <= z.end;

      if (isGreaterThanStart && isLowerThanEnd) {
        return z.value;
      }
    }
  }

  getHoroscope(date: number, month: number, year: number): string {
    const dateMonthYear = new Date(
      [year.toString(), month.toString(), date.toString()].join('-'),
    );

    for (const h of HOROSCOPES) {
      const isGreaterThanStart = dateMonthYear >= new Date(h.start);
      const isLowerThanEnd = dateMonthYear <= new Date(h.end);

      if (isGreaterThanStart && isLowerThanEnd) {
        return h.value;
      }
    }
  }

  setProfilePic(file: Express.Multer.File): string {
    console.log(file);
    return '';
  }

  // async findAll() {
  //   const users = await this.usersRepository.find();

  //   return {
  //     msg: 'success',
  //     data: users,
  //   };
  // }

  // async findOne(id: string) {
  //   const user = await this.usersRepository.findOneBy({ id });

  //   return {
  //     msg: 'success',
  //     data: user,
  //   };
  // }

  // async remove(id: string) {
  //   await this.usersRepository.delete({ id });

  //   return {
  //     msg: 'success remove user',
  //   };
  // }
}
