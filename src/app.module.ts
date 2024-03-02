import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    MulterModule.registerAsync({ useFactory: () => ({ dest: './uploads/' }) }),
    MongooseModule.forRoot(
      'mongodb://root:rootexample123@localhost:27017/youapp?authSource=admin',
    ),
    UserModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
