import { SetMetadata, applyDecorators } from '@nestjs/common';
import { UserType } from '../user.entity';

export const ROLES_KEY = 'roles';
export const ALLOW_OWNER_KEY = 'allowOwner';

export const Roles = (...roles: UserType[]) => SetMetadata(ROLES_KEY, roles);

export const AllowOwner = () => SetMetadata(ALLOW_OWNER_KEY, true);

export const RolesOrOwner = (...roles: UserType[]) => {
  return applyDecorators(Roles(...roles), AllowOwner());
};
