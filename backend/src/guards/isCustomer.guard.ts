import { CanActivate, ExecutionContext, GoneException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";


@Injectable()
export class isCustomer implements CanActivate {
    canActivate(context: ExecutionContext): 
    boolean {
        try {
            const req = context.switchToHttp().getRequest();
            if(!req.user) {
                throw new Error("not authenticated")
            }

            if(req.user.role !== 'Customer') {
                return false
            } else {
                return true
            }

        } catch (error) {
            throw new GoneException('error in the authentication')
        }
    }
}