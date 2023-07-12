import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class OpenAi extends BaseEntity {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
    command!: string;

  @Column({ type: 'int' })
    tokens!: number;

  @Column({ type: 'real' })
    cost!: number;

  @CreateDateColumn()
    createdDate!: Date;
}
