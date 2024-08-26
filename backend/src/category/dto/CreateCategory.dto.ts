import { PartialType } from "@nestjs/mapped-types";


export class CreateCategoryDto {
    CategoryName: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}