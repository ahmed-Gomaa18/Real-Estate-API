import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { propertyRequestModelName, propertyRequestType } from "./models/propertyRequest.model";
import { Model } from 'mongoose';
import { CreatePropertyRequestDto, UpdatePropertyRequestDto } from '../../dtos/propertyRequest.dto';
import { Schema} from "mongoose";
import { adModelName, adType } from "src/modules/ad/models/ad.model";
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PropertyRequestService {
    constructor(@InjectModel(adModelName) private readonly adModel: Model<adType>, @InjectModel(propertyRequestModelName) private readonly propertyRequestModel: Model<propertyRequestType>){}

    // Run this function every three days
    @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_10AM)
    async refreshRequests(){
        try {
            this.propertyRequestModel.updateMany({}, {$set: {refreshedAt: new Date()}});
            console.log(`Successfully updated requests.`);
        } catch (error) {
            console.error('Error updating requests:', error);
        }
    };

    async getPropertyRequests(query: string, page: number, limit: number, filters: any){
        const offset = (page - 1) * limit;

        const searchCriteria = {...filters};
        // check if user enter query search return query search else return all
        if(query){
            searchCriteria.$or = [
                { propertyType: new RegExp(query, 'i') },
                { city: new RegExp(query, 'i') },
                { district: new RegExp(query, 'i') },
                { description: new RegExp(query, 'i') }
            ];
        };

        const [data, total] = await Promise.all([
            this.propertyRequestModel.find(searchCriteria)
                .skip(offset)
                .limit(limit)
                .exec(),
            this.propertyRequestModel.countDocuments(searchCriteria).exec()
        ]);

        // Determine pagination metadata
        const hasNextPage = (page * limit) < total;
        const hasPreviousPage = page > 1;

        return {
            page,
            data,
            totalData: data.length,
            totalPage: Math.ceil(total / limit),
            hasNextPage,
            hasPreviousPage
        };


    };

    async createPropertyRequest(propertyRequest: CreatePropertyRequestDto){
        const newPropertyRequest = new this.propertyRequestModel(propertyRequest);
        await newPropertyRequest.save();
        return {
            status: 201,
            message: "property created successfully.",
            data: newPropertyRequest
        };
    };

    async updatePropertyRequest(propertyRequestId: string, propertyRequest: UpdatePropertyRequestDto, userId: string,){

        const nPropertyRequest = await this.propertyRequestModel.findById(propertyRequestId);

        if (nPropertyRequest.userId.toString() != userId){
            return {
                isSuccess: false,
                status: 400,
                message: "property Request not belong to this user."
            };
        }

        let updatedFileds = {
            refreshedAt: new Date()
        };
        if(propertyRequest.price){
            updatedFileds['price'] = propertyRequest.price
        };
        if(propertyRequest.area){
            updatedFileds['area'] = propertyRequest.area
        };
        if(propertyRequest.description){
            updatedFileds['description'] = propertyRequest.description
        };

        const updatedPropertyRequest = await this.propertyRequestModel.findByIdAndUpdate(propertyRequestId, {$set: updatedFileds}, {new: true})

        return {
            isSuccess: true,
            status: 200,
            message: "property Request updated successfully.",
            data: updatedPropertyRequest
        };
    };

    async getMatchAdsByPropertyRequestId(PropertyRequestId: string, page: number, limit: number){

        const propertyRequest = await this.propertyRequestModel.findById(PropertyRequestId);

        if (!propertyRequest){
            return {
                isSuccess: false,
                status: 400,
                message: "Sory.. propertyRequest not found."
            }
        };

        // price tolerance of +/- 10% 
        const priceTolerance = 0.1 * propertyRequest.price;
        const minPrice = propertyRequest.price - priceTolerance;
        const maxPrice = propertyRequest.price + priceTolerance;

        const matchCriteria = {
            district: propertyRequest.district,
            price: { $gte: minPrice, $lte: maxPrice },
            area: propertyRequest.area
        };

        const matches = await this.adModel.aggregate([
            { $match: matchCriteria },
            { $sort: { refreshedAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit }
        ]);

        const totalMatches = await this.adModel.countDocuments(matchCriteria);

        // Determine pagination metadata
        const hasNextPage = (page * limit) < totalMatches;
        const hasPreviousPage = page > 1;

        return{
            isSuccess: true,
            status: 200,
            message: "Get matches ads Successfully.",
            results:{
                data: matches,
                page: page,
                limit: limit,
                total: totalMatches,
                hasNextPage: hasNextPage,
                hasPreviousPage: hasPreviousPage
            }
        }
    };

};