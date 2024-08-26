import { PartialType } from "@nestjs/mapped-types";
import { CreateMenuDto } from "./CreateMenu.dto";

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}