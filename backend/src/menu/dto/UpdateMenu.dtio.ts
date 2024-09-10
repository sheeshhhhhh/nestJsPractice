import { PartialType } from "@nestjs/mapped-types";
import { CreateMenuDto } from "./CreateMenu.dto";
import { IsOptional, IsString } from "class-validator";

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
        @IsString()
        @IsOptional()
        file?: string
}