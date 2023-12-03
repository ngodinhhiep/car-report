import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Car } from '../cars/car.entity';


@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column({ nullable: true })
    photo: string;

    @ManyToOne(() => User, (user) => user.reports)
    @JoinColumn()
    user: User;

    @ManyToOne(() => Car, (car) => car.reports, { onDelete: 'CASCADE' }) // many reports can be applied to a car
    @JoinColumn()
    car: Car

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;
  
    @DeleteDateColumn({ type: 'datetime' })
    deletedAt: Date;
    
}