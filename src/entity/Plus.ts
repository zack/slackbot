import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class Plus extends BaseEntity {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
    plusee!: string;

  @Column()
    pluser!: string;

  @Column()
    note!: string;

  @CreateDateColumn()
    createdDate!: Date;
}
