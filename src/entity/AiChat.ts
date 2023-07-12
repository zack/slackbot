import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class AiChat extends BaseEntity {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
    user!: string;

  @Column('text')
    content!: string;

  @Column()
    role!: string;

  @CreateDateColumn()
    createdDate!: Date;
}
