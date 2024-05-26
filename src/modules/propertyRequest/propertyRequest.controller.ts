import { Body, Controller, Get, Param, Patch, Post, Query, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { PropertyRequestService } from './propertyRequest.service';
import { CreatePropertyRequestDto, UpdatePropertyRequestDto } from '../../dtos/propertyRequest.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { NextFunction, Request, Response } from 'express';
import { AuthValidationGuard } from 'src/guards/auth-validation.guard';
import { UserRole } from 'src/interfaces/auth.interface';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Schema} from "mongoose";


@ApiTags('propertyRequest')
@Controller('propertyRequest')
export class PropertyRequestController {
  constructor(private readonly propertyRequestService: PropertyRequestService) {};


  @Get()
  @ApiQuery({ name: "q", type: String, required: false})
  @ApiQuery({ name: "limit", type: Number, required: false})
  @ApiQuery({ name: "page", type: Number, required: false})
  @ApiQuery({ name: "area", type: Number, required: false})
  @ApiQuery({ name: "price", type: Number, required: false})
  async getPropertyRequests(
    @Query('q') query: string, 
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('area') area: number,
    @Query('price') price: number,
    @Res() res: Response
  ){
    try{
      const filters: any = {};

      if (area) filters.are = area;
      if (price) filters.price = price;

      const result = await this.propertyRequestService.getPropertyRequests(query, +page, +limit, filters);

      return res.status(200).json(result);

    }catch(error){
      return res.status(400).json({error: error.message});
    };
  };

  @Post('/create')
  @ApiBody({
    description: 'This endpoint allow only client to create properties',
    type: CreatePropertyRequestDto
  })
  @UseGuards(new AuthValidationGuard(UserRole.Client))
  @UsePipes(new ValidationPipe(CreatePropertyRequestDto))
  async createPropertyRequest(@Req() req: Request, @Res() res: Response, @Body() body: CreatePropertyRequestDto) {
    try{
        body['userId'] = req['user']['userId'] 
        const result = await this.propertyRequestService.createPropertyRequest(body);
        return res.status(result.status).json({message: result.message, data: result.data})
    }catch(error){
        return res.status(400).json({error: error.message});
    };
  };

  @Patch('/update:propertyRequestId')
  @ApiParam({
    name: "propertyRequestId",
    type: String
  })
  @ApiBody({
    description: 'This endpoint allow only client to update properties but just area, price, description',
    type: UpdatePropertyRequestDto
  })
  @UseGuards(new AuthValidationGuard(UserRole.Client))
  @UsePipes(new ValidationPipe(UpdatePropertyRequestDto))
  async updatePropertyRequest(@Req() req: Request, @Res() res: Response, @Body() body: UpdatePropertyRequestDto) {
    try{
        const propertyRequestId = req.params.propertyRequestId;
        const userId = req['user']['userId']
        const result = await this.propertyRequestService.updatePropertyRequest(propertyRequestId, body, userId);
        
        if(!result.isSuccess){
          return res.status(result.status).json({message: result.message});
        }
        return res.status(result.status).json({message: result.message, data: result.data});
    }catch(error){
        return res.status(400).json({error: error.message});
    };
  };


  @Get('/:propertyRequestId/matches')
  @ApiParam({ name: "propertyRequestId", type: String, required: true})
  @ApiQuery({ name: "page", type: Number, required: false})
  @ApiQuery({ name: "limit", type: Number, required: false})
  async getMatchAdsByPropertyRequestId(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50, 
    @Req() req: Request,
    @Res() res: Response) {
    try{

        const propertyRequestId = req.params.propertyRequestId;
        const result = await this.propertyRequestService.getMatchAdsByPropertyRequestId(propertyRequestId, +page, +limit);
        if (result.isSuccess != true){
            return res.status(result.status).json({message: result.message})
        }

        return res.status(result.status).json({message: result.message, results: result.results})
    }catch(error){
        return res.status(400).json({error: error.message});
    };
  };

}