import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';

import { AppController } from '../implementations/app.controller';
import { Proposal, ProposalStatus, User } from '../entities/entities.entity';

describe('AppController', () => {
  let appController: AppController;
  let proposalRepository: Repository<Proposal>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: getRepositoryToken(Proposal),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            // Adicione outros métodos conforme necessário
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        // ... outros provedores
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    proposalRepository = module.get<Repository<Proposal>>(
      getRepositoryToken(Proposal),
    );
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('getPendingProposals', () => {
    it('should return an array of pending proposals for the authenticated user', async () => {
      const user: User = { id: 1 } as User; // Mock do usuário, assumindo que o id é 1 para o teste
      const mockProposals: Proposal[] = [
        // Mock de duas propostas pendentes conforme a resposta esperada
        {
          id: 6,
          profit: 890,
          status: ProposalStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
          userCreator: {
            id: 1,
            name: 'Mason Blackwood',
            balance: 1123,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdCustomers: [],
            proposals: [],
          },
          customer: {
            id: 6,
            name: 'Mia Rodriguez',
            cpf: '22222222200',
            createdAt: new Date(),
            updatedAt: new Date(),
            userCreator: new User(),
            proposals: [],
          },
        },
      ];

      jest.spyOn(proposalRepository, 'find').mockResolvedValue(mockProposals);

      const result = await appController.getPendingProposals({ user: user });
      expect(result).toEqual(mockProposals);
      expect(proposalRepository.find).toHaveBeenCalledWith({
        where: {
          userCreator: Equal(user.id),
          status: ProposalStatus.PENDING,
        },
        relations: ['userCreator', 'customer'],
      });
    });
  });

  // ... outros testes
});
