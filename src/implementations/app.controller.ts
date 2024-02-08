// eslint-disable-next-line prettier/prettier
import { Controller, Get, HttpException, HttpStatus, Param, Post, Req } from '@nestjs/common';
import { ApiHeader, ApiOperation } from '@nestjs/swagger';

import { User } from '../entities/entities.entity';
import { AppService } from './app.service.service';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get('/proposals')
  @ApiOperation({ summary: 'Obter propostas pendentes de um usuário' })
  @ApiHeader({
    name: 'user_id',
    description: 'ID do usuário',
    required: true,
  })
  async getPendingProposals(@Req() req: { user: User }) {
    return await this.appService.getPendingProposals(req.user.id);
  }

  @Get('/proposals/refused')
  @ApiHeader({
    name: 'user_id',
    description: 'ID do usuário',
    required: true,
  })
  @ApiOperation({
    summary: 'Obter propostas rejeitadas criadas por um usuário',
  })
  async getRefusedProposals(@Req() req: { user: User }) {
    return await this.appService.getRefusedProposals(req.user.id);
  }

  @Get('/proposals/all')
  @ApiOperation({ summary: 'Obter todas as propostas' })
  async getAllProposals() {
    return await this.appService.getAllProposals();
  }
  @Get('/proposals/:id')
  @ApiHeader({
    name: 'user_id',
    description: 'ID do usuário',
    required: true,
  })
  @ApiOperation({ summary: 'Obter uma proposta por ID' })
  async getProposalById(
    @Param('id') proposalId: number,
    @Req() req: { user: User },
  ) {
    try {
      return await this.appService.getProposalById(proposalId, req.user.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/users')
  @ApiOperation({ summary: 'Lista todos os usuários' })
  async getAllUsers() {
    return await this.appService.getAllUsers();
  }

  @Post('/proposals/:proposal_id/approve')
  @ApiHeader({
    name: 'user_id',
    description: 'ID do usuário',
    required: true,
  })
  @ApiOperation({ summary: 'Aprovar uma proposta pendente por ID' })
  async approveProposal(
    @Param('proposal_id') proposalId: number,
    @Req() req: { user: User },
  ) {
    try {
      return await this.appService.approveProposal(proposalId, req.user.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/admin/profit-by-status')
  @ApiOperation({ summary: 'Obter o lucro agrupado por status de proposta' })
  async getProfitByStatus(): Promise<any> {
    try {
      return await this.appService.getProfitByStatus();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/admin/best-users')
  @ApiOperation({
    summary:
      'Obter os usuários com o maior lucro de propostas em sucesso vinculado',
  })
  async getBestUsers() {
    return await this.appService.getBestUsers();
  }
}
