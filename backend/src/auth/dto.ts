import { PartialType } from "@nestjs/mapped-types";

export class loginDTO {
  username: string;
  password: string;
}

export class UserCreate {
  username: string;
  name: string;
  password: string;
};

export class changePassword {
  password: string;
  confirmPassword: string;
  newPassword: string;
}

export class UserUpdate extends PartialType(UserCreate) {}