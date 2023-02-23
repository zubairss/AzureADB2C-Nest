import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { UserRoles } from "src/common/enums/enums";

export class AddRolesDto {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    accessToken: string;

    @ApiProperty({ required: true, default: UserRoles.user })
    @IsEnum(UserRoles)
    @IsNotEmpty()
    role: UserRoles;
}