import { applyDecorators, UseGuards } from "@nestjs/common"
import { ApiBearerAuth } from "@nestjs/swagger"
import { UserRoles } from "src/common/enums/enums"
import { AzureADGuard } from "./azure-ad.strategy"
import { Roles } from "./roles.decorator"
import { RolesGuard } from "./roles.guard"

export const AzureAuth = (...roles: Array<UserRoles>) => {

    if (roles.length > 0) {
        return applyDecorators(
            ApiBearerAuth(),
            UseGuards(AzureADGuard, RolesGuard),
            Roles(...roles),);
    }

    return applyDecorators(
        ApiBearerAuth(),
        UseGuards(AzureADGuard)
    )
}

