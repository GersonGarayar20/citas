import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Role } from 'src/common/enum/role.enum';
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

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.CLIENT })
  role: Role;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Appointment, (appointment) => appointment.client)
  clients: Appointment[];

  @OneToMany(() => Appointment, (appointment) => appointment.worker)
  workers: Appointment[];

  @ManyToMany(() => Service, (service) => service.users)
  @JoinTable()
  services: Service[];
}
