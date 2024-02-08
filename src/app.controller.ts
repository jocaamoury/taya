import { Controller, Get, Param, Req } from '@nestjs/common';
import { Proposal, User } from './entities/entities.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(Proposal)
    private proposalRepository: Repository<Proposal>,
  ) {}

  @Get('/proposals/:id')
  async getProposalById(
    @Param('id') proposalId: number,
    @Req() req: { user: User },
  ): Promise<Proposal> {
    console.log(req);
    return await this.proposalRepository.findOne({ where: { id: proposalId } });
  }
}
