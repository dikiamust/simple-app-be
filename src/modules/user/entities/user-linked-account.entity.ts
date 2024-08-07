import { Basic } from 'src/entities/basic.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { LinkedAccountTypeEnum } from '../enums';

@Entity('user_linked_accounts')
export class UserLinkedAccount extends Basic {
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.userLinkedAccounts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: LinkedAccountTypeEnum,
    name: 'linked_account_type',
  })
  linkedAccountType: LinkedAccountTypeEnum;

  @Column({ type: 'varchar' })
  email: string;
}
