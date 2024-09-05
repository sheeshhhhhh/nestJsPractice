import {
  GoneException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { prisma } from 'prisma/db';
import { changePasswordDto } from './dto/ChangePasswordDto';
import { changeUserInfoDto } from './dto/ChangeUserInfo';

@Injectable()
export class UserService {

  async changePassword(
    { password, newPassword, confirmPassword }: changePasswordDto,
    req: any,
  ) {
    if (newPassword !== confirmPassword) {
      throw new NotAcceptableException('confirmPassword is not in sync');
    }

    const userId = req.user.sub;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }
    
    const verifyPassword = bcrypt.compareSync(password, user.password);
    if (!verifyPassword) {
      throw new UnauthorizedException('wrong password');
    }

    // update password
    const hashNewPassword = bcrypt.hashSync(newPassword, 10); // hash the new password
    const updatePassword = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashNewPassword,
      },
    });

    console.log(updatePassword);
    return {
      success: true,
      message: 'password has been changed!',
    };
  }

  async changeAvatar(req: any, file: Express.Multer.File) {
    const userId = req.user.sub;
    const fileInfo = file;
    const profileLink = process.env.BASE_URL + '/public/' + fileInfo.filename;

    // add delete profile later // it should be use when a user already has profile so that we don't have
    // profile that is not being used

    const updateProfile = await prisma.userInfo.upsert({
      where: {
        userId: userId,
      },
      update: {
        profile: profileLink,
      },
      create: {
        userId: userId,
        profile: profileLink,
      },
      select: {
        profile: true,
      },
    });

    return {
      success: true,
      message: 'profile changed',
      newProfile: profileLink,
    };
  }

  async changeUsername(req: any, newusername: string) {
    try {
      const userId = req.user.sub;

      const updateUsername = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          username: newusername,
        },
        select: {
          username: true,
        },
      });

      return {
        success: true,
        message: 'username has been changed',
        newUsername: updateUsername.username,
      };
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // catching the unique contraints
        if (error.code === 'P2002') {
          throw new NotImplementedException('username already exist!');
        }
      } else {
        throw new InternalServerErrorException()
      }
    }
  }

  async changeUserInfo(req: any, { name, email, bio }: changeUserInfoDto) {
    try {
      const userId = req.user.sub;

      const updateUserInfo = await prisma.$transaction(async (txprisma) => {
        const updateName = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            name: name,
          },
        });

        const updateUserInfo = await prisma.userInfo.upsert({
          where: {
            userId: userId,
          },
          update: {
            email: email,
            bio: bio,
          },
          create: {
            userId: userId,
            email: email,
            bio: bio,
          },
        });

        return {
          name: name,
          email: email,
          bio: bio,
        };
      });

      return updateUserInfo;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new NotImplementedException('email already exist');
        }
      }
    }
  }

  async changeAddress(req: any, address: string) {
    const userId = req.user.sub

    const changeAddress = await prisma.userInfo.upsert({
      where: {
        userId: userId
      },
      update: {
        address: address
      },
      create: {
        userId: userId,
        address: address
      },
      select: {
        address: true
      }
    })

    return {
      success: true,
      message: 'address has been changed',
      newAddress: changeAddress.address
    }
  }

  async deleteUser(req: any)  {
    try {
      const userId = req.user.id;

      // decide if it's better to preserve the restaurant in history instead of giving it in 
      // it will be automatically delete anyway because of cascade delete
      const deleteUser = await prisma.user.delete({
        where: {
          id: userId
        }
      })

      if(!deleteUser) {
        throw new GoneException('failed to delete')
      }

      return {
        success: true,
        message: "Successfully deleted user",
        userId: deleteUser.id
      }

    } catch (error) {
      throw new InternalServerErrorException("internal server error")
    }
  }

}
