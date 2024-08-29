import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";


@Injectable()
export class isOwner implements CanActivate {
    async canActivate(
        context: ExecutionContext
    ): Promise<boolean> {
        try {
            const req = context.switchToHttp().getRequest();
            if(!req.user) {
                throw new Error("jwtAuthGuard is required to user this")
            }

            if(req.user?.role === 'Business') {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log(error)
            return false
        }
    }
}