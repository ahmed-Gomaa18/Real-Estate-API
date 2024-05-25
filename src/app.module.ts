import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertyRequestModule } from './modules/propertyRequest/propertyRequest.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdModule } from './modules/ad/ad.module';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: './.env', isGlobal: true}),
    MongooseModule.forRoot(process.env.MONGOURL),
    ScheduleModule.forRoot(),
    // JwtModule.register({
    //   global: true,
    //   secret: process.env.JWTSECRETKEY,
    //   signOptions: {expiresIn: '24h'}
    // }),
    PropertyRequestModule,
    AuthModule,
    AdModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
