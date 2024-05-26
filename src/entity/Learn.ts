import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

@Entity()
@Index(['learnee', 'content'], { unique: true })
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
