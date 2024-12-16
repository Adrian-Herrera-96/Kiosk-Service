import { Controller } from '@nestjs/common';
import { KioskService } from './kiosk.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('kiosk')
export class KioskController {
  constructor(private readonly kioskService: KioskService) {}

  @MessagePattern('kiosk.getDataPerson')
  getDataPerson(@Payload() identityCard: string) {
    return this.kioskService.getDataPerson(identityCard);
  }
  @MessagePattern('kiosk.saveDataKioskAuth')
  saveDataKioskAuth(@Payload() data: any) {
    return this.kioskService.saveDataKioskAuth(data);
  }

  @MessagePattern('kiosk.savePhotos')
  async savePhotos(
    @Payload()
    data: {
      personId: number;
      photoIdentityCard: Buffer;
      photoFace: Buffer;
    },
  ) {
    return this.kioskService.savePhotos(data);
  }

  @MessagePattern('kiosk.getFingerprintComparison')
  getFingerprintComparison(@Payload() personId: number) {
    return this.kioskService.getFingerprintComparison(personId);
  }
}
