import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getToken(
    id: string,
    handle: string,
    displayName: string,
    // permissions: string[],
  ) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          id,
          handle,
          displayName,
          // permissions,
        },
        { secret: 'at-secret', expiresIn: 60 * 60 },
      ),
      this.jwtService.signAsync(
        {
          id,
          handle,
          displayName,
          // permissions,
        },
        { secret: 'rt-secret', expiresIn: 60 * 60 * 24 * 7 },
      ),
    ]);

    return {
      access_token: at,
      refesh_token: rt,
    };
  }

  async updateRefreshTokenHash(id: string, refreshToken: string) {
    const hashedToken = await hash(refreshToken, 10);

    await this.prismaService.user.update({
      where: { id },
      data: { refreshToken: hashedToken },
    });
  }

  async signinLocal(dto: AuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: { handle: dto.email },
    });
    if (!user) throw new ForbiddenException('Access denied.');

    const passwordMatches = await compare(dto.password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Access denied.');

    // const roles = await this.prismaService.role.findMany({
    //   where: { users: { every: { id: user.id } } },
    // });

    // const roleIds = roles.map((role) => {
    //   return role.id;
    // });

    // const permissions = await this.prismaService.permission.findMany({
    //   where: { roles: { every: { id: { in: roleIds } } } },
    // });

    // const permissionIds = permissions.map((permission) => {
    //   return permission.code;
    // });

    const tokens = await this.getToken(
      user.id,
      user.handle,
      user.displayName,
      // permissionIds,
    );
    await this.updateRefreshTokenHash(user.id, tokens.refesh_token);
    return tokens;
  }

  async logout(id: string) {
    await this.prismaService.user.updateMany({
      where: { id: id, refreshToken: { not: null } },
      data: { refreshToken: null },
    });
  }

  async refresh(id: string, refreshToken: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access denied.');

    const tokenMatches = await compare(refreshToken, user.refreshToken);
    if (!tokenMatches) throw new ForbiddenException('Access denied.');

    const tokens = await this.getToken(
      user.id,
      user.handle,
      user.displayName,
      //    [
      //   '',
      // ]
    );
    await this.updateRefreshTokenHash(user.id, tokens.refesh_token);
    return tokens;
  }
}
