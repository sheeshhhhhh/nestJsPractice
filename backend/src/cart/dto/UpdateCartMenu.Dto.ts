import { PartialType } from "@nestjs/mapped-types";
import { CreateCartMenuDto } from "./CreateCartMenu.dto";


export class UpdateCartMenuDto extends PartialType(CreateCartMenuDto) {}