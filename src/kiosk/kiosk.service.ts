import { Injectable } from '@nestjs/common';
import { NatsService } from 'src/common';
import { KioskAuthenticationData } from './entities/kiosk-authentication-data.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class KioskService {
  constructor(
    private readonly natsService: NatsService,
    @InjectRepository(KioskAuthenticationData)
    private kioskAuthenticationDataRepository: Repository<KioskAuthenticationData>,
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
}
