import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('ApplicationConfig')
export class ApplicationConfigModel {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'boolean', default: false })
  applicationsOpen: boolean;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  updatedBy: string;
}