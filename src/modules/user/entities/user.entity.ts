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

  @Column({ type: 'text' })
  salt?: string;

  @Column({ type: 'boolean', name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ default: 0, name: 'login_count' })
  loginCount: number;

  @Column({ type: 'timestamptz', name: 'logout_at', nullable: true })
  logoutAt?: Date;
}
