import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*)/, {
    message:
      'password too weak. It must contain at least one uppercase letter, one lowercase letter and one number',
  })
  password: string;

  @IsString()
  @MinLength(1)
  fullName: string;
}
