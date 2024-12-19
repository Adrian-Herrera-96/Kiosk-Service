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
    photoIdentityCard?: Buffer;
    photoFace?: Buffer;
  }) {
    const now = new Date();
    const formattedDate = this.formatCurrentDate(now);
    const basePaths = {
      ci: `Person/images/kiosk/${data.personId}/ci`,
      face: `Person/images/kiosk/${data.personId}/face`,
    };

    if (data.photoIdentityCard) {
      await this.uploadPhotoToFtp(
        data.photoIdentityCard,
        basePaths.ci,
        `${formattedDate}-photoIdentityCard.png`,
      );
    }
    if (data.photoFace) {
      await this.uploadPhotoToFtp(
        data.photoFace,
        basePaths.face,
        `${formattedDate}-face.png`,
      );
    }
    return { message: 'Fotos guardadas correctamente' };
  }
  private formatCurrentDate(date: Date): string {
    const datePart = date.toLocaleDateString('en-GB');
    const timePart = date.toLocaleTimeString('en-GB').replace(/:/g, '');
    return `${datePart.split('/').reverse().join('-')}-${timePart}`;
  }

  private async uploadPhotoToFtp(
    photoBuffer: Buffer,
    basePath: string,
    fileName: string,
  ): Promise<void> {
    const filePath = `${basePath}/${fileName}`;
    await this.ftp.uploadFile(Buffer.from(photoBuffer), basePath, filePath);
  }

  async getFingerprintComparison(personId: number): Promise<any> {
    const person = await this.natsService.fetchAndClean(
      { term: personId },
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
        'deathCertificateNumber',
        'cellPhoneNumber',
        'idPersonSenasir',
        'status',
      ],
    );
    if (person.personFingerprints.length === 0) {
      return [];
    }
    const fingerprintsData = [];
    try {
      for (const fingerprint of person.personFingerprints) {
        try {
          console.log(`Processing fingerprint ID: ${fingerprint.id}`);
          const fileBuffer = await this.ftp.downloadFile(fingerprint.path);
          const wsqBase64 = fileBuffer.toString('base64');
          fingerprintsData.push({
            id: fingerprint.id,
            quality: fingerprint.quality,
            fingerprintType: fingerprint.fingerprintType,
            wsqBase64,
          });
        } catch (error) {
          console.error(
            `Failed to download file at path: ${fingerprint.path}`,
            error,
          );
          throw new Error(
            `Failed to download file at path: ${fingerprint.path}`,
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
    return fingerprintsData;
  }
}
