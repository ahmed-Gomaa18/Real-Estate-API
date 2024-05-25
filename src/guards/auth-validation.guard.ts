import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";

import { Observable } from "rxjs";
import { UserRole } from "src/interfaces/auth.interface";
import { JwtUtil } from "src/utils/app.utils";

@Injectable()
export class AuthValidationGuard implements CanActivate {
    constructor( private readonly userRole: UserRole){}
    
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try{
            
            const req = context.switchToHttp().getRequest();
            
            if(!req.headers['authorization']){
                throw new Error('Unauthorized User');
            }
            // verify
            const decodedToken = JwtUtil.verify(req.headers['authorization'].split(' ')[1]);
            
            // check authorization
            if(this.userRole != decodedToken['role']){
                throw new Error('Unauthorized User');
            };
            
            // inject user in request
            req.user = decodedToken;

            return true;
        }catch(error: any){
            throw new UnauthorizedException(error.message);
        };
    }
};