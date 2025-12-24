import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TENANT_REQUIRED_KEY } from './tenant-required.decorator';
import { RequestUser } from './request-user.type';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const tenantRequired = this.reflector.getAllAndOverride<boolean>(
      TENANT_REQUIRED_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Se a rota não exige tenant, não valida company_id
    if (!tenantRequired) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as RequestUser;

    // Sem user = sem acesso
    if (!user) throw new ForbiddenException('Acesso negado.');

    // MASTER pode acessar qualquer rota
    if (user.role === 'MASTER' || user.is_master) return true;

    // Qualquer outro perfil deve ter company_id
    if (!user.company_id) {
      throw new ForbiddenException('Usuário sem empresa vinculada (company_id ausente).');
    }

    return true;
  }
}
