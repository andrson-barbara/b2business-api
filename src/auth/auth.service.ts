import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CompaniesService } from 'src/companies/companies.service';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
    private companies: CompaniesService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Usuário não encontrado.');

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new UnauthorizedException('Senha inválida.');

    const payload = {
      sub: user.id,
      company_id: user.company?.id ?? null,
      role: user.role,
      is_master: user.is_master,
    };

    const access_token = await this.jwt.signAsync(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        company_id: user.company?.id ?? null,
        is_master: user.is_master,
      },
    };
  }

  /**
   * Cria a empresa e o usuário master (roda uma vez).
   */
  async bootstrapMaster() {
    const masterEmail = 'admin@b2business.local';
    const masterPassword = 'b2business123';

    // Se já existir um master, não recria
    const existing = await this.users.findByEmail(masterEmail);
    if (existing && existing.is_master) {
      return {
        message: 'Usuário master já existe. Use as credenciais abaixo para login.',
        email: masterEmail,
        password: masterPassword,
      };
    }

    // Cria uma empresa genérica para testes (se quiser você muda isso depois)
    const company = await this.companies.create({
      name: 'Andrson Master Company',
      document: null,
      active: true,
    });

    // Cria o usuário master ligado a essa empresa (ou company: null, se preferir global)
    const masterUser = await this.users.create({
      name: 'Administrador Master',
      email: masterEmail,
      password: masterPassword,
      company,
      role: 'MASTER',
      is_master: true,
    });

    return {
      message: 'Usuário master criado com sucesso.',
      email: masterEmail,
      password: masterPassword,
      user_id: masterUser.id,
      company_id: company.id,
    };
  }
}
