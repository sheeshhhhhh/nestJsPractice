import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotImplementedException,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { loginDTO, OwnerCreateDto, UserCreateDto } from './dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  prisma = new PrismaClient();

  // for local strategy
  async validateUser({ username, password }: loginDTO) {
    const user = await this.prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user)
      return {
        user: null,
        message: 'wrong username',
      };

    const verifyPassword = bcrypt.compareSync(password, user.password);

    if (!verifyPassword)
      return {
        user: null,
        message: 'wrong password',
      };

    return {
      user,
    };
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      name: user.name,
      sub: user.id,
      role: user.role
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createUser({ name, username, password }: UserCreateDto) {
    try {
      const hashPassword = await bcrypt.hash(password, 10);

      await this.prisma.user.create({
        data: {
          username,
          name,
          password: hashPassword,
        },
      });

      return 'successfully created User';
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('internal serve error');
    }
  }

  async createRestaurantOwner({ name, username, password, restaurant }: OwnerCreateDto) {
    try {
      const hashPassword = await bcrypt.hash(password, 10)
  
      const createUserOwner = await this.prisma.user.create({
        data: {
          username,
          name,
          password: hashPassword,
          role: 'Business'
        }
      })
  
      return this.login(createUserOwner);
    } catch (error) {
      if(error instanceof Prisma.PrismaClientKnownRequestError) {
        if(error.code === 'P2002') {
          throw new NotImplementedException("username already exist!")
        }
      }
    }
  }
  // make otp later

  async check(req: any) {
    if (req.user) {
      return this.prisma.user.findFirst({
        where: {
          id: req.user.sub,
        },
        select: {
          username: true,
          id: true,
          name: true,
          role: true,
          userInfo: {
            select: {
              profile: true,
              address: true
            }
          }
        },
      });
    } else {
      return undefined;
    }
  }
}
