import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';


@Entity('InterestFormResponse')
export class InterestFormResponseModel {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ nullable: true, unique: true })
  email?: string;

  @Column({ nullable: true, unique: true })
  phone?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;



}
