import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ProposalStatus {
  SUCCESSFUL = 'SUCCESSFUL',
  REFUSED = 'REFUSED',
  ERROR = 'ERROR',
  PENDING = 'PENDING',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Customer, (customer) => customer.userCreator)
  createdCustomers: Customer[];

  @OneToMany(() => Proposal, (proposal) => proposal.userCreator)
  proposals: Proposal[];

  @Column({ nullable: false, type: 'varchar', length: 200 })
  name: string;

  @Column({ nullable: false, type: 'decimal', default: 0 })
  balance: number;

  @Column({ type: 'datetime' })
  createdAt: Date;

  @Column({ type: 'datetime' })
  updatedAt: Date;
}

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.proposals)
  userCreator: User;

  @OneToMany(() => Proposal, (proposal) => proposal.customer)
  proposals: Proposal[];

  @Column({ nullable: false, type: 'varchar', length: 200 })
  name: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  cpf: string;

  @Column({ type: 'datetime' })
  createdAt: Date;

  @Column({ type: 'datetime' })
  updatedAt: Date;
}

@Entity({ name: 'proposals' })
export class Proposal {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.proposals)
  userCreator: User;

  @ManyToOne(() => Customer, (customer) => customer.proposals)
  customer: Customer;

  @Column({ nullable: false, type: 'decimal', default: 0 })
  profit: number;

  @Column({
    nullable: false,
    type: 'varchar',
    default: ProposalStatus.PENDING,
  })
  status: ProposalStatus;

  @Column({ type: 'datetime' })
  createdAt: Date;

  @Column({ type: 'datetime' })
  updatedAt: Date;
}
