import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserModel } from './UserModel';
import { FormType } from '../types/Enums';
import { Application, Waiver } from '../types/Application';

@Entity('Response')
export class ResponseModel extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne((type) => UserModel, (user) => user.responses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user' })
  @Index('response_by_user_index')
  user: UserModel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('enum', {
    enum: FormType,
  })
  formType: FormType;

  @Column({ type: 'json' })
  data: Application | Waiver;
}
