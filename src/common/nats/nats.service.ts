import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NATS_SERVICE } from '../../config';

export class NatsService {
  private logger = new Logger('MicroserviceUtils');

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  async firstValue(service: string, data: any): Promise<any> {
    return firstValueFrom(
      this.client.send(service, data).pipe(
        map((response) => ({
          ...response,
          status: true,
        })),
        catchError((error) => {
          this.logger.error(
            `Error calling microservice: ${service}`,
            error.message,
          );
          return of({
            status: false,
            message: 'Microservice call failed',
          });
        }),
      ),
    );
  }

  async fetchAndClean(entityId: object, service: string, keysToOmit: string[]) {
    const data = await this.firstValue(service, entityId);
    if (!data) return null;
    keysToOmit.forEach((key) => delete data[key]);
    return data;
  }
  async fetchValidatedRelation(
    entityId: number,
    service: string,
    keysToOmit: string[],
  ) {
    if (!entityId) return null;
    return await this.fetchAndClean({ id: entityId }, service, keysToOmit);
  }
}
