import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userModelName, userSchema } from './models/user.model';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';


@Module({
  imports: [
    MongooseModule.forFeature([{name: userModelName, schema: userSchema}]),
    
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}