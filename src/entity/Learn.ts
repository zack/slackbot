import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class Learn extends BaseEntity {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
    learnee!: string;

  @Column()
    learner!: string;

  @Column('text')
    content!: string;

  @CreateDateColumn()
    createdDate!: Date;
}
