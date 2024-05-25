import { Body, Controller, Get, Post, Query, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { LoginDto, RegisterDto } from 'src/dtos/auth.dto';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthValidationGuard } from 'src/guards/auth-validation.guard';
import { UserRole } from 'src/interfaces/auth.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {};


    @Post('/register')
    @ApiBody({
        description: 'This endpoint used to register as new user',
        type: RegisterDto,
    })
    @UsePipes(new ValidationPipe(RegisterDto))
    async register(@Res() res: Response, @Body() body: RegisterDto){
        try{

            const result = await this.authService.register(body);
            
            return res.status(result.status).json({message: result.message, data: result.data});

        }catch(error){
            return res.status(400).json(error.message);
        }
    }

    @Post('/login')
    @ApiBody({
        description: 'Login through this endpoint',
        type: LoginDto,
    })
    @UsePipes(new ValidationPipe(LoginDto))
    async login(@Res() res: Response, @Body() body: LoginDto){
        try{

            const result = await this.authService.login(body);

            if (result.isSuccess == true){
                return res.status(result.status).json({message: result.message, data: result.data})
            }

            return res.status(result.status).json({message: result.message})

        }catch(error){
            return res.status(400).json({error: error.message});
        }
    };


    @Get('/userStats')
    @ApiQuery({ name: "page", type: Number, required: false})
    @ApiQuery({ name: "limit", type: Number, required: false})
    @UseGuards(new AuthValidationGuard(UserRole.Admin))
    async userStats(@Query('page') page: number = 1, @Query('limit') limit: number = 50, @Res() res: Response){
        try{
            const result = await this.authService.userStats(+page, +limit); 
              
            return res.status(result.status).json({message: result.message, results: result.results})
        }catch(error){
            return res.status(400).json({error: error.message});
        };
    };



}