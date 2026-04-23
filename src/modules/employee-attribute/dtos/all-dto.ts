/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 * CEOs: 
 *       Persy Morell Guerra      Email: pmorellpersi@gmail.com  Phone : +53-5336-4654 Linkedin: https://www.linkedin.com/in/persy-morell-guerra-288943357/
 *       Dailyn García Domínguez  Email: dailyngd@gmail.com      Phone : +53-5432-0312 Linkedin: https://www.linkedin.com/in/dailyn-dominguez-3150799b/
 *
 * CTO: Persy Morell Guerra
 * COO: Dailyn García Domínguez and Persy Morell Guerra
 * CFO: Dailyn García Domínguez and Persy Morell Guerra
 *
 * Repositories: 
 *               https://github.com/SoftwareEnTalla 
 *
 *               https://github.com/apokaliptolesamale?tab=repositories
 *
 *
 * Social Networks:
 *
 *              https://x.com/SoftwarEnTalla
 *
 *              https://www.facebook.com/profile.php?id=61572625716568
 *
 *              https://www.instagram.com/softwarentalla/
 *              
 *
 *
 */

import { InputType, Field, Float, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
  IsUUID,
  ValidateNested,
} from 'class-validator';




@InputType()
export class BaseEmployeeAttributeDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateEmployeeAttribute',
    example: 'Nombre de instancia CreateEmployeeAttribute',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateEmployeeAttributeDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateEmployeeAttribute).',
    example: 'Fecha de creación de la instancia (CreateEmployeeAttribute).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateEmployeeAttribute).',
    example: 'Fecha de actualización de la instancia (CreateEmployeeAttribute).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateEmployeeAttribute).',
    example:
      'Usuario que realiza la creación de la instancia (CreateEmployeeAttribute).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateEmployeeAttribute).',
    example: 'Estado de activación de la instancia (CreateEmployeeAttribute).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Clave del atributo',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Clave del atributo', nullable: false })
  attributeKey!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Nombre visible',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Nombre visible', nullable: true })
  displayName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo', nullable: false })
  dataType!: string;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Obligatorio',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Obligatorio', nullable: false })
  isRequired!: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Sensible',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Sensible', nullable: false })
  isSensitive!: boolean;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Valores permitidos',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Valores permitidos', nullable: true })
  enumValues?: Record<string, any> = {};

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Empleado portador del valor',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Empleado portador del valor', nullable: true })
  employeeId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Valor string',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Valor string', nullable: true })
  stringValue?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Valor numérico',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Valor numérico', nullable: true })
  numericValue?: number = 0;

  @ApiProperty({
    type: () => Boolean,
    nullable: true,
    description: 'Valor booleano',
  })
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { description: 'Valor booleano', nullable: true })
  booleanValue?: boolean = false;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Valor fecha',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Valor fecha', nullable: true })
  dateValue?: Date = new Date();

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Valor JSON',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Valor JSON', nullable: true })
  jsonValue?: Record<string, any> = {};

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseEmployeeAttributeDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class EmployeeAttributeDto extends BaseEmployeeAttributeDto {
  // Propiedades específicas de la clase EmployeeAttributeDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<EmployeeAttributeDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<EmployeeAttributeDto>): EmployeeAttributeDto {
    const instance = new EmployeeAttributeDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class EmployeeAttributeValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => EmployeeAttributeDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => EmployeeAttributeDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class EmployeeAttributeOutPutDto extends BaseEmployeeAttributeDto {
  // Propiedades específicas de la clase EmployeeAttributeOutPutDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<EmployeeAttributeOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<EmployeeAttributeOutPutDto>): EmployeeAttributeOutPutDto {
    const instance = new EmployeeAttributeOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateEmployeeAttributeDto extends BaseEmployeeAttributeDto {
  // Propiedades específicas de la clase CreateEmployeeAttributeDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateEmployeeAttribute a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateEmployeeAttributeDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateEmployeeAttributeDto>): CreateEmployeeAttributeDto {
    const instance = new CreateEmployeeAttributeDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateEmployeeAttributeDto {
  @ApiProperty({
    type: () => String,
    description: 'Identificador',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  @ApiProperty({
    type: () => CreateEmployeeAttributeDto,
    description: 'Instancia CreateEmployeeAttribute o UpdateEmployeeAttribute',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateEmployeeAttributeDto, { nullable: true })
  input?: CreateEmployeeAttributeDto | UpdateEmployeeAttributeDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteEmployeeAttributeDto {
  // Propiedades específicas de la clase DeleteEmployeeAttributeDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteEmployeeAttribute a eliminar',
    default: '',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id: string = '';

  @ApiProperty({
    type: () => String,
    description: 'Lista de identificadores de instancias a eliminar',
    example:
      'Se proporciona una lista de identificadores de DeleteEmployeeAttribute a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateEmployeeAttributeDto extends BaseEmployeeAttributeDto {
  // Propiedades específicas de la clase UpdateEmployeeAttributeDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateEmployeeAttribute a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateEmployeeAttributeDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateEmployeeAttributeDto>): UpdateEmployeeAttributeDto {
    const instance = new UpdateEmployeeAttributeDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



