import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';

import { Proposal, ProposalStatus, User } from '../entities/entities.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Proposal)
    private proposalRepository: Repository<Proposal>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getPendingProposals(userId: number): Promise<Proposal[]> {
    return this.proposalRepository.find({
      where: { userCreator: Equal(userId), status: ProposalStatus.PENDING },
      relations: ['userCreator', 'customer'],
    });
  }

  async getRefusedProposals(userId: number): Promise<Proposal[]> {
    return this.proposalRepository.find({
      where: { userCreator: Equal(userId), status: ProposalStatus.REFUSED },
    });
  }

  async getProposalById(proposalId: number, userId: number): Promise<Proposal> {
    const proposal = await this.proposalRepository.findOne({
      where: { id: proposalId, userCreator: Equal(userId) },
      relations: ['userCreator'],
    });

    if (!proposal) {
      throw new Error('Proposal not found or unauthorized access');
    }

    return proposal;
  }

  async getAllProposals(): Promise<Proposal[]> {
    return this.proposalRepository.find({
      relations: ['userCreator', 'customer'],
    });
  }

  async approveProposal(proposalId: number, userId: number): Promise<Proposal> {
    let proposal = await this.getProposalById(proposalId, userId);

    if (proposal.status !== ProposalStatus.PENDING) {
      throw new Error('Proposal not found or not pending');
    }

    proposal.status = ProposalStatus.SUCCESSFUL;
    proposal = await this.proposalRepository.save(proposal);

    const user = await this.userRepository.findOneBy({ id: userId });
    if (user) {
      user.balance += proposal.profit;
      await this.userRepository.save(user);
    }

    return proposal;
  }
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getProfitByStatus(): Promise<any> {
    const profits = await this.proposalRepository
      .createQueryBuilder('proposal')
      .select('proposal.userCreatorId', 'userId')
      .addSelect('proposal.status', 'status')
      .addSelect('SUM(proposal.profit)', 'totalProfit')
      .groupBy('proposal.status')
      .addGroupBy('proposal.userCreatorId')
      .getRawMany();

    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id IN (:...ids)', {
        ids: profits.map((profit) => profit.userId),
      })
      .getMany();

    const usersMap = new Map(users.map((user) => [user.id, user]));

    const results = profits.reduce((acc, { userId, status, totalProfit }) => {
      if (!acc[userId]) {
        const user = usersMap.get(userId);
        acc[userId] = {
          userCreator: {
            id: user.id,
            name: user.name,
            balance: user.balance,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          profitsByStatus: {},
        };
      }

      acc[userId].profitsByStatus[status] = +totalProfit;

      return acc;
    }, {});

    return Object.values(results);
  }

  async getBestUsers(): Promise<any> {
    const usersWithProfit = await this.proposalRepository
      .createQueryBuilder('proposal')
      .select('user.id', 'id')
      .addSelect('user.name', 'fullName')
      .addSelect('SUM(proposal.profit)', 'totalProposal')
      .innerJoin('proposal.userCreator', 'user')
      .where('proposal.status = :status', { status: 'SUCCESSFUL' })
      .groupBy('user.id')
      .orderBy('totalProposal', 'DESC')
      .getRawMany();

    return usersWithProfit.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      totalProposal: parseFloat(user.totalProposal),
    }));
  }
}
