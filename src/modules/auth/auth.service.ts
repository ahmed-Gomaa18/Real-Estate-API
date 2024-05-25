import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { userModelName, userType } from "./models/user.model";
import { LoginDto, RegisterDto } from "src/dtos/auth.dto";
import * as bcrypt from 'bcryptjs';
import { JwtUtil } from "src/utils/app.utils";


@Injectable()
export class AuthService {
    constructor(@InjectModel(userModelName) private readonly userModel: Model<userType>){}

    async register(user: RegisterDto){
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;

        const newUser = new this.userModel(user);
        await newUser.save();
        
        delete user.password
        
        return{
            status: 201,
            message: "Register Successfully... Please Login",
            data: {...user}
        }

    };

    async login(loginUser: LoginDto){
        const user = await this.userModel.findOne({phone: loginUser.phone});
        if (!user){
            return{
                status: 400,
                isSuccess: false,
                message: "Your phone OR password Invalid"
            }
        }
        const passwordValid = await bcrypt.compare(loginUser.password, user.password);
        if (!passwordValid){
            return{
                status: 400,
                isSuccess: false,
                message: "Your phone OR password Invalid"
            }
        }

        const payload = { phone: user.phone, role: user.role, name: user.name, userId: user.id };

        return{
            status: 200,
            isSuccess: true,
            message: "Login Successfully.",
            data: {
                access_token: JwtUtil.sign(payload)
            }
        }
    };


    async userStats(page: number, limit: number){
        
        const users = await this.userModel.aggregate([
            {
            $lookup: {
                from: 'ads',
                localField: '_id',
                foreignField: 'userId',
                as: 'ads'
            }
            },
            {
            $lookup: {
                from: 'propertyrequests',
                localField: '_id',
                foreignField: 'userId',
                as: 'requests'
            }
            },
            {
            $project: {
                name: 1,
                role: 1,
                phone: 1,
                adsCount: { $size: '$ads' },
                totalAdsAmount: { $sum: '$ads.price' },
                requestsCount: { $size: '$requests' },
                totalRequestsAmount: { $sum: '$requests.price' }
            }
            },
            { $skip: (page - 1) * limit },
            { $limit: limit }
        ]);
  
        const total = await this.userModel.countDocuments();
        const hasNextPage = page * limit < total;
        const hasPreviousPage = page > 1;

        return{
            status: 200,
            message: "Get matches propertyRequests Successfully.",
            results:{
                data: users,
                page: page,
                limit: limit,
                total: total,
                hasNextPage: hasNextPage,
                hasPreviousPage: hasPreviousPage
            }
        }
    };

};