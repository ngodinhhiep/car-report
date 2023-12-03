import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Report } from '../reports/report.entity';
import { Car } from '../cars/car.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column()
  address: string;

  @Column()
  phone: number;

  @Column({ default: false })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user, { onDelete: 'CASCADE', cascade: true })
  reports: Report[];

  @OneToMany(() => Car, (car) => car.user, { onDelete: 'CASCADE', cascade: true })
  cars: Car[];

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime' })
  deletedAt: Date;
  
}
