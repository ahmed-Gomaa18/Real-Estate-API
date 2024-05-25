import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { adModelName, adSchema } from './models/ad.model';
import { AdController } from './ad.controller';
import { AdService } from './ad.service';
import { propertyRequestModelName, propertyRequestSchema } from '../propertyRequest/models/propertyRequest.model';

@Module({
  imports: [
    MongooseModule.forFeature([{name: adModelName, schema: adSchema}]),
    MongooseModule.forFeature([{name: propertyRequestModelName, schema: propertyRequestSchema}])
  ],
  controllers: [AdController],
  providers: [AdService],
})
export class AdModule {}