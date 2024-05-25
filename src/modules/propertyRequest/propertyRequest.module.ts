import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { propertyRequestModelName, propertyRequestSchema } from './models/propertyRequest.model';
import { PropertyRequestController } from './propertyRequest.controller';
import { PropertyRequestService } from './propertyRequest.service';
import { adModelName, adSchema } from 'src/modules/ad/models/ad.model';

@Module({
  imports: [
    MongooseModule.forFeature([{name: propertyRequestModelName, schema: propertyRequestSchema}]),
    MongooseModule.forFeature([{name: adModelName, schema: adSchema}])
  ],
  controllers: [PropertyRequestController],
  providers: [PropertyRequestService],
})
export class PropertyRequestModule {}
