import { Role } from '../enums';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  organizationId: string;
}

export interface RequestUser {
  id: string;
  email: string;
  role: Role;
  organizationId: string;
}
