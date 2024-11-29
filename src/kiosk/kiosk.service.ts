import { Injectable } from '@nestjs/common';
import { FtpService, NatsService } from 'src/common';
import { KioskAuthenticationData } from './entities/kiosk-authentication-data.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class KioskService {
  constructor(
    private readonly natsService: NatsService,
    @InjectRepository(KioskAuthenticationData)
    private kioskAuthenticationDataRepository: Repository<KioskAuthenticationData>,
    private readonly ftp: FtpService,
  ) {}

  async getDataPerson(identityCard: string) {
    const dataPerson = await this.natsService.fetchAndClean(
      { term: identityCard },
      'person.findOne',
      [
        'uuidColumn',
        'cityBirthId',
        'pensionEntityId',
        'financialEntityId',
        'dueDate',
        'isDuedateUndefined',
        'gender',
        'civilStatus',
        'surnameHusband',
        'deathCertificationNumber',
        'reasonDeath',
        'phoneNumber',
        'nua',
        'accountNumber',
        'sigepStatus',
        'idPersonSeansir',
        'dateLastContribution',
        'personAffiliates',
        'birthDate',
        'dateDeath',
        'deathCertification',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'personFingerprints',
        'deathCertificateNumber',
        'cellPhoneNumber',
        'idPersonSenasir',
        'status',
      ],
    );
    const { firstName, lastName, secondName, mothersLastName, ...data } =
      dataPerson;
    return {
      fullName: [firstName, secondName, lastName, mothersLastName]
        .filter(Boolean)
        .join(' '),
      ...data,
    };
  }
  async saveDataKioskAuth(data: any) {
    const dataSaved = await this.kioskAuthenticationDataRepository.save(data);
    return dataSaved;
  }

  async savePhotos(data: {
    personId: number;
    photoIdentityCard: Buffer;
    photoFace: Buffer;
  }) {
    const now = new Date();
    const datePart = now.toLocaleDateString('en-GB');
    const timePart = now.toLocaleTimeString('en-GB').replace(/:/g, '');
    const formattedDate = `${datePart.split('/').reverse().join('-')}-${timePart}`;
    const basePathCi = `Person/images/kiosk/${data.personId}/ci`;
    const basePathFace = `Person/images/kiosk/${data.personId}/face`;
    const identityCardPath = `${basePathCi}/${formattedDate}-photoIdentityCard.png`;
    const facePath = `${basePathFace}/${formattedDate}-face.png`;
    await this.ftp.connectToFtp();
    await this.ftp.uploadFile(
      Buffer.from(data.photoIdentityCard),
      basePathCi,
      identityCardPath,
    );
    await this.ftp.uploadFile(
      Buffer.from(data.photoFace),
      basePathFace,
      facePath,
    );

    await this.ftp.onDestroy();
    return { message: 'Fotos guardadas correctamente' };
  }
}
