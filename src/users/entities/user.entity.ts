import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Service } from 'src/services/entities/service.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';


export enum UserRoles {
  ADMIN = 'ADMIN',
  WORKER = 'WORKER',
  CLIENT = 'CLIENT',
}


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: 'client' })
  role: string;

  @Column({ type: 'enum', enum: UserRoles, default:UserRoles.CLIENT })
  status: UserRoles;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Appointment, (appointment) => appointment.client)
  clients: Appointment[];

  @OneToMany(() => Appointment, (appointment) => appointment.worker)
  workers: Appointment[];

  @ManyToMany(() => Service, service => service.users)
  @JoinTable()
  services: Service[];

}
