import { Entity, Column } from 'typeorm';
import { Basic } from 'src/entities/basic.entity';

@Entity({ name: 'agendas' })
export class Agenda extends Basic {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'timestamptz', name: 'start_date_time' })
  startDateTime: Date;

  @Column({ type: 'timestamptz', name: 'end_date_time' })
  endDateTime: Date;

  @Column({ type: 'simple-array', name: 'assigned_user' })
  assignedUser: number[];
}
