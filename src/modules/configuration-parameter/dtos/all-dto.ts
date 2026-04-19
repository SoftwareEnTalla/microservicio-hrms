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
export class BaseConfigurationParameterDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateConfigurationParameter',
    example: 'Nombre de instancia CreateConfigurationParameter',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateConfigurationParameterDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateConfigurationParameter).',
    example: 'Fecha de creación de la instancia (CreateConfigurationParameter).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateConfigurationParameter).',
    example: 'Fecha de actualización de la instancia (CreateConfigurationParameter).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateConfigurationParameter).',
    example:
      'Usuario que realiza la creación de la instancia (CreateConfigurationParameter).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateConfigurationParameter).',
    example: 'Estado de activación de la instancia (CreateConfigurationParameter).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Clave del parámetro',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Clave del parámetro', nullable: false })
  paramKey!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Ámbito de aplicación',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Ámbito de aplicación', nullable: false })
  scope!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador del scope (companyCode, workCenterCode)',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Identificador del scope (companyCode, workCenterCode)', nullable: true })
  scopeId?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo del valor',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo del valor', nullable: false })
  valueType!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Valor en string',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Valor en string', nullable: true })
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
    type: () => Object,
    nullable: true,
    description: 'Valor JSON',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Valor JSON', nullable: true })
  jsonValue?: Record<string, any> = {};

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
    type: () => Date,
    nullable: false,
    description: 'Vigencia desde',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Vigencia desde', nullable: false })
  effectiveFrom!: Date;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Vigencia hasta',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Vigencia hasta', nullable: true })
  effectiveTo?: Date = new Date();

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
  constructor(partial: Partial<BaseConfigurationParameterDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class ConfigurationParameterDto extends BaseConfigurationParameterDto {
  // Propiedades específicas de la clase ConfigurationParameterDto en cuestión

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
  constructor(partial: Partial<ConfigurationParameterDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ConfigurationParameterDto>): ConfigurationParameterDto {
    const instance = new ConfigurationParameterDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class ConfigurationParameterValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => ConfigurationParameterDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => ConfigurationParameterDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class ConfigurationParameterOutPutDto extends BaseConfigurationParameterDto {
  // Propiedades específicas de la clase ConfigurationParameterOutPutDto en cuestión

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
  constructor(partial: Partial<ConfigurationParameterOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ConfigurationParameterOutPutDto>): ConfigurationParameterOutPutDto {
    const instance = new ConfigurationParameterOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateConfigurationParameterDto extends BaseConfigurationParameterDto {
  // Propiedades específicas de la clase CreateConfigurationParameterDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateConfigurationParameter a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateConfigurationParameterDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateConfigurationParameterDto>): CreateConfigurationParameterDto {
    const instance = new CreateConfigurationParameterDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateConfigurationParameterDto {
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
    type: () => CreateConfigurationParameterDto,
    description: 'Instancia CreateConfigurationParameter o UpdateConfigurationParameter',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateConfigurationParameterDto, { nullable: true })
  input?: CreateConfigurationParameterDto | UpdateConfigurationParameterDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteConfigurationParameterDto {
  // Propiedades específicas de la clase DeleteConfigurationParameterDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteConfigurationParameter a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteConfigurationParameter a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateConfigurationParameterDto extends BaseConfigurationParameterDto {
  // Propiedades específicas de la clase UpdateConfigurationParameterDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateConfigurationParameter a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateConfigurationParameterDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateConfigurationParameterDto>): UpdateConfigurationParameterDto {
    const instance = new UpdateConfigurationParameterDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



