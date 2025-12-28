import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, hashSync } from 'bcrypt';
import { onSaveDBError } from 'src/common/helpers/db-exception.helper';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashSync(createUserDto.password, 10),
      });
      await this.userRepository.save(user);

      delete (user as Partial<User>).password;
      return { ...user, token: this.getJwtToken(user) };
    } catch (error) {
      onSaveDBError(error, this.logger);
    }
  }

  async logIn(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
      select: { password: true, email: true, id: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid (email)');
    }

    const isPasswordValid = compareSync(loginUserDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credentials are not valid (password)');
    }

    delete (user as Partial<User>).password;

    return { ...user, token: this.getJwtToken(user) };
  }

  private getJwtToken(user: User) {
    const payload: JwtPayload = { id: user.id };
    const token = this.jwtService.sign(payload);
    return token;
  }
}
