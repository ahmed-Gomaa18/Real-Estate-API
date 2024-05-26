import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { adModelName, adType } from "./models/ad.model";
import { Model } from 'mongoose';
import { CreateAdDto } from "src/dtos/ad.dto";
import { Schema} from "mongoose";
import { propertyRequestModelName, propertyRequestType } from "../propertyRequest/models/propertyRequest.model";


@Injectable()
export class AdService {
    constructor(@InjectModel(adModelName) private readonly adModel: Model<adType>, @InjectModel(propertyRequestModelName) private readonly propertyRequestModel: Model<propertyRequestType>){}

    async getAds(query: string, page: number, limit: number, filters: any){
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
            this.adModel.find(searchCriteria)
                .skip(offset)
                .limit(limit)
                .exec(),
            this.adModel.countDocuments(searchCriteria).exec()
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

    async createAd(ad: CreateAdDto){

        const newAd = new this.adModel(ad);
        await newAd.save();
        return {
            status: 201,
            message: "Ad created successfully.",
            data: newAd
        };
    };

    async getMatchPropertyRequestsByAdId(adId: string, page: number, limit: number){

        const ad = await this.adModel.findById(adId);

        if (!ad){
            return {
                isSuccess: false,
                status: 400,
                message: "Sory.. Ad not found."
            }
        };

        // price tolerance of +/- 10% 
        const priceTolerance = 0.1 * ad.price;
        const minPrice = ad.price - priceTolerance;
        const maxPrice = ad.price + priceTolerance;

        const matchCriteria = {
            district: ad.district,
            price: { $gte: minPrice, $lte: maxPrice },
            area: ad.area
        };

        const matches = await this.propertyRequestModel.aggregate([
            { $match: matchCriteria },
            { $sort: { refreshedAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit }
        ]);

        const totalMatches = await this.propertyRequestModel.countDocuments(matchCriteria);

        // Determine pagination metadata
        const hasNextPage = (page * limit) < totalMatches;
        const hasPreviousPage = page > 1;

        return{
            isSuccess: true,
            status: 200,
            message: "Get matches propertyRequests Successfully.",
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