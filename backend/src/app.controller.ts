import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { prisma } from 'prisma/db';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller()
export class AppController {

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const getPrisma = await prisma.user.findFirst({
      where: {
        id: req.user.sub
      }
    })

    return getPrisma
  }
}
