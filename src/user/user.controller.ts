import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Put,
  Get,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { ProfileDto } from './dto/profile.dto';
import { RegisterDto } from './dto/register.dto';
import { RESTResponse } from './user.interface';
import { UserService } from './user.service';

const validator = new ParseFilePipe({
  fileIsRequired: false,
  validators: [
    new MaxFileSizeValidator({ maxSize: 100000 }),
    new FileTypeValidator({ fileType: 'image/jpeg' }),
  ],
});

@Controller('/api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.userService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data: RESTResponse = await this.userService.login(loginDto);
    res.cookie('id', data.data['id']);
    res.cookie('token', data.token);

    return data;
  }

  @Get('getProfile')
  async getProfile(@Req() req: Request) {
    const id = req.cookies['id'];
    return await this.userService.getProfile(id);
  }

  @UseInterceptors(FileInterceptor('profilePic'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Profile data', type: ProfileDto })
  @Post('createProfile')
  async createProfile(
    @Req() req: Request,
    @Body() profileDto: ProfileDto,
    @UploadedFile(validator) profilePic: Express.Multer.File,
  ) {
    const id = req.cookies['id'];
    return await this.userService.setProfile(id, profileDto, profilePic);
  }

  @UseInterceptors(FileInterceptor('profilePic'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Profile data', type: ProfileDto })
  @Put('updateProfile')
  async updateProfile(
    @Req() req: Request,
    @Body() profileDto: ProfileDto,
    @UploadedFile(validator) profilePic: Express.Multer.File,
  ) {
    const id = req.cookies['id'];
    return await this.userService.setProfile(id, profileDto, profilePic);
  }
}
