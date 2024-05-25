import * as jwt from 'jsonwebtoken';

export class JwtUtil {
    static sign(payload: Object | string | Buffer){
        return jwt.sign(payload, process.env.JWTSECRETKEY, {expiresIn: '24h'});
    };

    static verify(token: string){
        return jwt.verify(token, process.env.JWTSECRETKEY)
    }
};