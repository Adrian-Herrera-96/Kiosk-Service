import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'kiosk', name: 'kiosk_authentication_data' })
export class KioskAuthenticationData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  person_id: number;

  @Column()
  identity_card: string;

  @Column()
  left_text: string;

  @Column()
  right_text: string;

  @Column()
  ocr_state: boolean;

  @Column()
  facial_recognition: boolean;

  @Column()
  recognized_text_captured: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
