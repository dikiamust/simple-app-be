import { Entity, Column, OneToMany } from 'typeorm';
import { Basic } from 'src/entities/basic.entity';
import { UserLinkedAccount } from './user-linked-account.entity';

@Entity({ name: 'users' })
export class User extends Basic {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  password?: string;

  @Column({ type: 'text', nullable: true })
  salt?: string;

  @Column({ type: 'boolean', name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ default: 0, name: 'login_count' })
  loginCount: number;

  @Column({ type: 'timestamptz', name: 'logout_at', nullable: true })
  logoutAt?: Date;

  @OneToMany(
    () => UserLinkedAccount,
    (userLinkedAccount) => userLinkedAccount.user,
  )
  userLinkedAccounts: UserLinkedAccount[];
}
