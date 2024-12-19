import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableKioskAuthenticationData1734549612254
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        schema: 'kiosk',
        name: 'kiosk_authentication_data',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'person_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'identity_card',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'left_text',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'right_text',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'ocr_state',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'facial_recognition',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'recognized_text_captured',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('kiosk.kiosk_authentication_data', true);
  }
}
