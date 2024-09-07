/* eslint-disable prettier/prettier */
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsUniqueOnUpdate', async: true })
@Injectable()
export class IsUniqueOnUpdateConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const { tableName, column, checkUniqueness }: IsUniqueOnUpdateConstraintInput = args.constraints[0];

    if (checkUniqueness) {
      const exists = await this.entityManager
        .getRepository(tableName)
        .createQueryBuilder(tableName)
        .where({ [column]: value })
        .getExists();

      return !exists;
    }

    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} already exists`;
  }
}

interface IsUniqueOnUpdateConstraintInput {
  tableName: string;
  column: string;
  checkUniqueness: boolean;
}

export function IsUniqueOnUpdate(options:{ tableName: string, column: string, checkUniqueness:boolean },validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isUniqueOnUpdate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsUniqueOnUpdateConstraint,
    });
  };
}
