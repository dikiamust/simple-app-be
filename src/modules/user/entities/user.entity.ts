import { Entity, Column } from 'typeorm';
import { Basic } from 'src/entities/basic.entity';

@Entity({ name: 'users' })
export class User extends Basic {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'text' })
  password?: string;

  @Column({ type: 'integer', name: 'role_id' })
  roleId: number;

  @Column({ type: 'text' })
  salt?: string;
}
