import { SetMetadata } from '@nestjs/common';

export const TENANT_REQUIRED_KEY = 'tenant_required';
export const TenantRequired = () => SetMetadata(TENANT_REQUIRED_KEY, true);
