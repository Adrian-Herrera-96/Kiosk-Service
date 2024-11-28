import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { KioskModule } from './kiosk/kiosk.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, CommonModule, KioskModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
