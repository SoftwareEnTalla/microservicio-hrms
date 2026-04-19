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
export class BasePersonAttributeDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreatePersonAttribute',
    example: 'Nombre de instancia CreatePersonAttribute',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreatePersonAttributeDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreatePersonAttribute).',
    example: 'Fecha de creación de la instancia (CreatePersonAttribute).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreatePersonAttribute).',
    example: 'Fecha de actualización de la instancia (CreatePersonAttribute).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreatePersonAttribute).',
    example:
      'Usuario que realiza la creación de la instancia (CreatePersonAttribute).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreatePersonAttribute).',
    example: 'Estado de activación de la instancia (CreatePersonAttribute).',
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
    description: 'Contiene PII sensible (cifrado)',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Contiene PII sensible (cifrado)', nullable: false })
  isSensitive!: boolean;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Valores permitidos si enum',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Valores permitidos si enum', nullable: true })
  enumValues?: Record<string, any> = {};

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Ámbito',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Ámbito', nullable: false })
  scope!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Persona portadora del valor (null si es solo definición)',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Persona portadora del valor (null si es solo definición)', nullable: true })
  personId?: string;

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
    description: 'Valor JSON/estructurado',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Valor JSON/estructurado', nullable: true })
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
  constructor(partial: Partial<BasePersonAttributeDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class PersonAttributeDto extends BasePersonAttributeDto {
  // Propiedades específicas de la clase PersonAttributeDto en cuestión

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
  constructor(partial: Partial<PersonAttributeDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<PersonAttributeDto>): PersonAttributeDto {
    const instance = new PersonAttributeDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class PersonAttributeValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => PersonAttributeDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => PersonAttributeDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class PersonAttributeOutPutDto extends BasePersonAttributeDto {
  // Propiedades específicas de la clase PersonAttributeOutPutDto en cuestión

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
  constructor(partial: Partial<PersonAttributeOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<PersonAttributeOutPutDto>): PersonAttributeOutPutDto {
    const instance = new PersonAttributeOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreatePersonAttributeDto extends BasePersonAttributeDto {
  // Propiedades específicas de la clase CreatePersonAttributeDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreatePersonAttribute a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreatePersonAttributeDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreatePersonAttributeDto>): CreatePersonAttributeDto {
    const instance = new CreatePersonAttributeDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdatePersonAttributeDto {
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
    type: () => CreatePersonAttributeDto,
    description: 'Instancia CreatePersonAttribute o UpdatePersonAttribute',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreatePersonAttributeDto, { nullable: true })
  input?: CreatePersonAttributeDto | UpdatePersonAttributeDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeletePersonAttributeDto {
  // Propiedades específicas de la clase DeletePersonAttributeDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeletePersonAttribute a eliminar',
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
      'Se proporciona una lista de identificadores de DeletePersonAttribute a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdatePersonAttributeDto extends BasePersonAttributeDto {
  // Propiedades específicas de la clase UpdatePersonAttributeDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdatePersonAttribute a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdatePersonAttributeDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdatePersonAttributeDto>): UpdatePersonAttributeDto {
    const instance = new UpdatePersonAttributeDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



