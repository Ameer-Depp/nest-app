/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, ALLOW_OWNER_KEY } from '../decorators/roles.decorator';
import { UserType } from '../user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const allowOwner = this.reflector.getAllAndOverride<boolean>(
      ALLOW_OWNER_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required and owner access is not allowed, skip authorization
    if (!requiredRoles && !allowOwner) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    let hasRole = false;
    if (requiredRoles) {
      hasRole = requiredRoles.some((role) => user.userType === role);
    }

    let isOwner = false;
    if (allowOwner) {
      const resourceId = parseInt(request.params.id, 10);
      isOwner = user.id === resourceId;
    }

    const hasAccess = hasRole || isOwner;

    if (!hasAccess) {
      const roleRequirement = requiredRoles
        ? `Required role(s): ${requiredRoles.join(', ')}`
        : '';
      const ownerRequirement = allowOwner ? 'or be the resource owner' : '';
      const separator = roleRequirement && ownerRequirement ? ' ' : '';

      throw new ForbiddenException(
        `Access denied. ${roleRequirement}${separator}${ownerRequirement}`,
      );
    }

    return true;
  }
}
