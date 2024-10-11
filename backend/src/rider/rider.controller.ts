import { Body, Controller, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RiderService } from './rider.service';
import { RiderLocationDto } from './dto/RiderLocation.dto';

@UseGuards(JwtAuthGuard)
@Controller('rider')
export class RiderController {
    constructor(
        private readonly riderService: RiderService
    ) {}

    @Get('CurrentOrder')
    async getCurrentOrder(@Request() req: any) {
        return this.riderService.getCurrentOrderForRiders(req)
    }
    
    @Patch('updateGpsLocation')
    async updateGpsLocation(@Request() req: any, @Body() body: RiderLocationDto) {
        const userId = req.user.sub;
        return this.riderService.updateRiderLocation(userId, body)
    }
}
