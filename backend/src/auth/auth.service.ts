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

  async validateGoogle(user: any) {
    try {
      
      const userPrisma = await this.prisma.user.findFirst({
        where: {
          oauthId: user.id
        }
      })

      // if user does not exist in the database then it's his first time and we should make him an
      // account
      if(!userPrisma) {
        const createUser = await this.prisma.$transaction(async txprisma => {
          const createUser = await txprisma.user.create({
            data: {
              username: user.displayName,
              name: user.displayName,
              oauthId: user.id
            }
          })
          
          const createUserInfo = await txprisma.userInfo.create({
            data: {
                email: user.emails[0].value,
                profile: user.photos[0].value,
                userId: createUser.id
            }
          })

          return {
            ...createUser,
            userInfo: createUserInfo
          }
        })

        return this.login(createUser)
      }

      return this.login(userPrisma)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('error in the google auth')
    }
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      name: user.name,
      sub: user.id,
      role: user.role,
      oauthId: user.oauthId
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createUser({ name, username, password, role }: UserCreateDto) {
    try {
      const hashPassword = await bcrypt.hash(password, 10);
      await this.prisma.user.create({
        data: {
          username,
          name,
          password: hashPassword,
          role: role
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
          oauthId: true,
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
