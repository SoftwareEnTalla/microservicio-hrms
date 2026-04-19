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
export class BasePersonDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreatePerson',
    example: 'Nombre de instancia CreatePerson',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreatePersonDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreatePerson).',
    example: 'Fecha de creación de la instancia (CreatePerson).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreatePerson).',
    example: 'Fecha de actualización de la instancia (CreatePerson).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreatePerson).',
    example:
      'Usuario que realiza la creación de la instancia (CreatePerson).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreatePerson).',
    example: 'Estado de activación de la instancia (CreatePerson).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código interno de persona',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código interno de persona', nullable: false })
  personCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de documento',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de documento', nullable: false })
  documentType!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Número de documento',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Número de documento', nullable: false })
  documentNumber!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Nombre',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Nombre', nullable: false })
  firstName!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Segundo nombre',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Segundo nombre', nullable: true })
  middleName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Apellido paterno',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Apellido paterno', nullable: false })
  lastName!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Apellido materno',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Apellido materno', nullable: true })
  secondLastName?: string = '';

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de nacimiento',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de nacimiento', nullable: true })
  birthDate?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Género',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Género', nullable: true })
  gender?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Email principal',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Email principal', nullable: true })
  email?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Teléfono principal',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Teléfono principal', nullable: true })
  phone?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Nacionalidad',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Nacionalidad', nullable: true })
  nationality?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de persona',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de persona', nullable: false })
  status!: string;

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
  constructor(partial: Partial<BasePersonDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class PersonDto extends BasePersonDto {
  // Propiedades específicas de la clase PersonDto en cuestión

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
  constructor(partial: Partial<PersonDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<PersonDto>): PersonDto {
    const instance = new PersonDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class PersonValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => PersonDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => PersonDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class PersonOutPutDto extends BasePersonDto {
  // Propiedades específicas de la clase PersonOutPutDto en cuestión

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
  constructor(partial: Partial<PersonOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<PersonOutPutDto>): PersonOutPutDto {
    const instance = new PersonOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreatePersonDto extends BasePersonDto {
  // Propiedades específicas de la clase CreatePersonDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreatePerson a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreatePersonDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreatePersonDto>): CreatePersonDto {
    const instance = new CreatePersonDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdatePersonDto {
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
    type: () => CreatePersonDto,
    description: 'Instancia CreatePerson o UpdatePerson',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreatePersonDto, { nullable: true })
  input?: CreatePersonDto | UpdatePersonDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeletePersonDto {
  // Propiedades específicas de la clase DeletePersonDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeletePerson a eliminar',
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
      'Se proporciona una lista de identificadores de DeletePerson a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdatePersonDto extends BasePersonDto {
  // Propiedades específicas de la clase UpdatePersonDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdatePerson a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdatePersonDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdatePersonDto>): UpdatePersonDto {
    const instance = new UpdatePersonDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



