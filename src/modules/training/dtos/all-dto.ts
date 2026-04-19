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
export class BaseTrainingDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateTraining',
    example: 'Nombre de instancia CreateTraining',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateTrainingDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateTraining).',
    example: 'Fecha de creación de la instancia (CreateTraining).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateTraining).',
    example: 'Fecha de actualización de la instancia (CreateTraining).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateTraining).',
    example:
      'Usuario que realiza la creación de la instancia (CreateTraining).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateTraining).',
    example: 'Estado de activación de la instancia (CreateTraining).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código curso',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código curso', nullable: false })
  courseCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Título',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Título', nullable: false })
  title!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Categoría',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Categoría', nullable: true })
  category?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Horas de duración',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Horas de duración', nullable: true })
  durationHours?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Modalidad',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Modalidad', nullable: false })
  modality!: string;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Obligatorio',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Obligatorio', nullable: false })
  mandatory!: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Auto inscripción',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Auto inscripción', nullable: false })
  selfEnrollable!: boolean;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Meses de vigencia de la certificación',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Meses de vigencia de la certificación', nullable: true })
  validityMonths?: number = 0;

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
  constructor(partial: Partial<BaseTrainingDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class TrainingDto extends BaseTrainingDto {
  // Propiedades específicas de la clase TrainingDto en cuestión

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
  constructor(partial: Partial<TrainingDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<TrainingDto>): TrainingDto {
    const instance = new TrainingDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class TrainingValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => TrainingDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => TrainingDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class TrainingOutPutDto extends BaseTrainingDto {
  // Propiedades específicas de la clase TrainingOutPutDto en cuestión

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
  constructor(partial: Partial<TrainingOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<TrainingOutPutDto>): TrainingOutPutDto {
    const instance = new TrainingOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateTrainingDto extends BaseTrainingDto {
  // Propiedades específicas de la clase CreateTrainingDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateTraining a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateTrainingDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateTrainingDto>): CreateTrainingDto {
    const instance = new CreateTrainingDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateTrainingDto {
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
    type: () => CreateTrainingDto,
    description: 'Instancia CreateTraining o UpdateTraining',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateTrainingDto, { nullable: true })
  input?: CreateTrainingDto | UpdateTrainingDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteTrainingDto {
  // Propiedades específicas de la clase DeleteTrainingDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteTraining a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteTraining a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateTrainingDto extends BaseTrainingDto {
  // Propiedades específicas de la clase UpdateTrainingDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateTraining a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateTrainingDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateTrainingDto>): UpdateTrainingDto {
    const instance = new UpdateTrainingDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



