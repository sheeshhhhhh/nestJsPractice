import { Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { changePassword, loginDTO, UserCreate } from './dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  prisma = new PrismaClient();
  
  // for local strategy
  async validateUser({ username, password }: loginDTO) {
    const user = await this.prisma.user.findFirst({
      where: {
        username: username
      }
    })

    if(!user) return {
      user: null,
      message: 'wrong username'
    }

    const verifyPassword = bcrypt.compareSync(password, user.password);

    if(!verifyPassword) return {
      user: null,
      message: 'wrong password'
    }

    return {
      user
    }
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      name: user.name,
      sub: user.id
    }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }

  async createUser({ name, username, password }: UserCreate) {
    try {
    
      const hashPassword = await bcrypt.hash(password, 10)

      await this.prisma.user.create({
        data: {
          username,
          name,
          password: hashPassword
        }
      })

      return "successfully created User"
    } catch (error) {
      console.log(error.message)
      throw new InternalServerErrorException("internal serve error")
    }
  }

  async changePassword(req: any ,{ password, newPassword, confirmPassword }: changePassword) {
    if(newPassword !== confirmPassword) {
      throw new NotAcceptableException("new password and confirm password is not equal")
    }
    // const userId = req.user.sub
    console.log(req.user)
  }

  async check(req: any) {
    if(req.user) {
      
      return this.prisma.user.findFirst({
        where: {
          id: req.user.sub
        },
        select: {
          username: true,
          id: true,
          name: true
        }
      })

    } else { 
      return undefined
    }
  }
}
