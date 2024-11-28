import { Module } from '@nestjs/common';
import { KioskController } from './kiosk.controller';
import { KioskService } from './kiosk.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KioskAuthenticationData } from './entities/kiosk-authentication-data.entity';

@Module({
  controllers: [KioskController],
  providers: [KioskService],
  imports: [TypeOrmModule.forFeature([KioskAuthenticationData])],
})
export class KioskModule {}
