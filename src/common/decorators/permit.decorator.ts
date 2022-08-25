import { SetMetadata } from '@nestjs/common';
import { PermissionType } from '../types/permission.types';

export const Permit = (...permissions: PermissionType[]) =>
  SetMetadata('permissions', permissions);
