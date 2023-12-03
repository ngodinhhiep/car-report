import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { UsersService } from "../users.service";
import { User } from "../user.entity";

declare global {
    namespace Express {
        interface Request {
            currentUser?: User;  // add currentUser as a User entity instance to Request
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware{
    constructor(private usersService: UsersService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.session || {} // check to see if userId exists in session

        if (userId) {
            const user = await this.usersService.findOneUser(userId);
           
            req.currentUser = user;
        }

        next();
    }
}