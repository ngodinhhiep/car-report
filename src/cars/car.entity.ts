import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, JoinColumn } from "typeorm"; 
import { User } from '../users/user.entity';
import { Report } from "../reports/report.entity";

@Entity()
export class Car {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    maker: string;

    @Column()
    price: number;

    @Column({nullable: true})
    photo: string;

    @ManyToOne(() => User, (user) => user.cars)
    @JoinColumn()
    user: User;

    @OneToMany(() => Report, (report) => report.car) // one car has many reports reviewed about it
    reports: Report[]

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;
  
    @DeleteDateColumn({ type: 'datetime' })
    deletedAt: Date;
}