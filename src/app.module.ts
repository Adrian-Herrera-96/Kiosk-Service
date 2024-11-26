import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { KioskModule } from './kiosk/kiosk.module';

@Module({
  imports: [ConfigModule.forRoot(), CommonModule, KioskModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
