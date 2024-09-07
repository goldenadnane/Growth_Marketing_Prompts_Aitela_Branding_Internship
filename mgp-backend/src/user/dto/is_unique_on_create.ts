/* eslint-disable prettier/prettier */
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsUniqueOnUpdate', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const { tableName, column }: IsUniqueConstraintInput = args.constraints[0];

    
      const exists = await this.entityManager
        .getRepository(tableName)
        .createQueryBuilder(tableName)
        .where({ [column]: value })
        .getExists();

      return !exists;
    

  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} already exists`;
  }
}

interface IsUniqueConstraintInput {
  tableName: string;
  column: string;
}

export function IsUnique(options:{ tableName: string, column: string },validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isUniqueOnUpdate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsUniqueConstraint,
    });
  };
}
