import { IsBoolean, IsString } from 'class-validator';

export class SaveDataKioskAuthDto {
  @IsString()
  identity_card: string;

  @IsString()
  person_id: string;

  @IsString()
  left_text: string;

  @IsString()
  right_text: string;

  @IsString()
  recognized_text_captured: string;

  @IsBoolean()
  ocr_state: boolean;

  @IsBoolean()
  facial_recognition: boolean;
}
