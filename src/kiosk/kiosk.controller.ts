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
  savePhotos(
    @Payload()
    data: {
      personId: number;
      hasCI: boolean;
      hasFace: boolean;
    },
  ) {
    return this.kioskService.savePhotos(
      data.personId,
      data.hasCI,
      data.hasFace,
    );
  }

  @MessagePattern('kiosk.getFingerprintComparison')
  getFingerprintComparison(@Payload() personId: number) {
    return this.kioskService.getFingerprintComparison(personId);
  }
}
