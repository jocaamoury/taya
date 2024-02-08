// eslint-disable-next-line prettier/prettier
import { BadRequestException, Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';

import { UserIdDto } from './dto/user-id.dto';
import { User } from './entities/entities.entity';

// Certifique-se de que o caminho para o DTO esteja correto

@Injectable()
export class UserMiddleware implements NestMiddleware {
  private readonly logger = new Logger(UserMiddleware.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    this.logger.log('UserMiddleware is running...');

    const userIdHeader = req.headers['user_id'];

    if (!userIdHeader) {
      this.logger.error('User ID not provided');
      throw new UnauthorizedException('User ID not provided');
    }

    try {
      // Verifica se o userIdHeader é uma string ou um array e pega o primeiro valor se for um array
      const userIdValue = Array.isArray(userIdHeader)
        ? userIdHeader[0]
        : userIdHeader;

      // Transforma e valida o userId
      const userIdDto = plainToInstance(UserIdDto, {
        user_id: parseInt(userIdValue, 10),
      });
      await validateOrReject(userIdDto);

      // Busca o usuário com o ID validado
      const user = await this.userRepository.findOneBy({
        id: userIdDto.user_id,
      });
      if (!user) {
        this.logger.error('Invalid user ID');
        throw new UnauthorizedException('Invalid user ID');
      }

      // Atribui o usuário à solicitação
      (req as any).user = user;
    } catch (error) {
      // Se a validação falhar ou o parse não for possível, lança um erro
      this.logger.error('Validation failed for user ID');
      throw new BadRequestException('Validation failed for user ID');
    }

    this.logger.log('UserMiddleware completed.');
    next();
  }
}
