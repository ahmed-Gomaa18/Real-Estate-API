import { Body, Controller, Get, Param, Patch, Post, Query, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { AdService } from './ad.service';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { NextFunction, Request, Response } from 'express';
import { AuthValidationGuard } from 'src/guards/auth-validation.guard';
import { UserRole } from 'src/interfaces/auth.interface';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Schema} from "mongoose";
import { CreateAdDto } from 'src/dtos/ad.dto';

@ApiTags('ad')
@Controller('ad')
export class AdController {
  constructor(private readonly adService: AdService) {};

  @Post('/create')
  @ApiBody({
    description: 'This endpoint allow only Agent to create ads',
    type: CreateAdDto
  })
  @UseGuards(new AuthValidationGuard(UserRole.Agent))
  @UsePipes(new ValidationPipe(CreateAdDto))
  async createAd(@Req() req: Request, @Res() res: Response, @Body() body: CreateAdDto) {
    try{
        body['userId'] = req['user']['userId'] 
        const result = await this.adService.createAd(body);
        return res.status(result.status).json({message: result.message, data: result.data})
    }catch(error){
        return res.status(400).json({error: error.message});
    };
  };

  @Get('/:adId/matches')
  @ApiParam({ name: "adId", type: String, required: true})
  @ApiQuery({ name: "page", type: Number, required: false})
  @ApiQuery({ name: "limit", type: Number, required: false})
  async getMatchPropertyRequestsByAdId(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50, 
    @Req() req: Request,
    @Res() res: Response,) {
    try{

        const adId = req.params.adId;
        const result = await this.adService.getMatchPropertyRequestsByAdId(adId, +page, +limit);
        if (result.isSuccess != true){
            return res.status(result.status).json({message: result.message})
        }

        return res.status(result.status).json({message: result.message, results: result.results})
    }catch(error){
        return res.status(400).json({error: error.message});
    };
  };
  

}