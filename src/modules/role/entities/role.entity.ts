import { Entity, Column } from 'typeorm';
import { Basic } from 'src/entities/basic.entity';

@Entity({ name: 'roles' })
export class Role extends Basic {
  @Column({ type: 'varchar', length: 150 })
  name: string;
}
