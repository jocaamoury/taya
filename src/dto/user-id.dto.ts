import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UserIdDto {
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'O user_id deve ser um número inteiro.' })
  @IsNotEmpty({ message: 'O user_id é obrigatório.' })
  user_id: number;
}
