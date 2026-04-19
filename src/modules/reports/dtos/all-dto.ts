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
export class BaseReportsDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateReports',
    example: 'Nombre de instancia CreateReports',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateReportsDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateReports).',
    example: 'Fecha de creación de la instancia (CreateReports).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateReports).',
    example: 'Fecha de actualización de la instancia (CreateReports).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateReports).',
    example:
      'Usuario que realiza la creación de la instancia (CreateReports).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateReports).',
    example: 'Estado de activación de la instancia (CreateReports).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código de reporte',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código de reporte', nullable: false })
  reportCode!: string;

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
    nullable: false,
    description: 'Categoría',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Categoría', nullable: false })
  category!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador de la consulta',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Identificador de la consulta', nullable: true })
  queryRef?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Formatos permitidos: PDF,CSV,JSON,EXCEL',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Formatos permitidos: PDF,CSV,JSON,EXCEL', nullable: true })
  allowedFormats?: Record<string, any> = {};

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Roles que pueden ejecutarlo',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Roles que pueden ejecutarlo', nullable: true })
  allowedRoles?: Record<string, any> = {};

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Accesible a EXTERNAL_AUDITOR',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Accesible a EXTERNAL_AUDITOR', nullable: false })
  auditable!: boolean;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Esquema JSON de parámetros',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Esquema JSON de parámetros', nullable: true })
  parametersSchema?: Record<string, any> = {};

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Última ejecución',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Última ejecución', nullable: true })
  lastExecutionId?: string;

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
  constructor(partial: Partial<BaseReportsDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class ReportsDto extends BaseReportsDto {
  // Propiedades específicas de la clase ReportsDto en cuestión

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
  constructor(partial: Partial<ReportsDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ReportsDto>): ReportsDto {
    const instance = new ReportsDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class ReportsValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => ReportsDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => ReportsDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class ReportsOutPutDto extends BaseReportsDto {
  // Propiedades específicas de la clase ReportsOutPutDto en cuestión

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
  constructor(partial: Partial<ReportsOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ReportsOutPutDto>): ReportsOutPutDto {
    const instance = new ReportsOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateReportsDto extends BaseReportsDto {
  // Propiedades específicas de la clase CreateReportsDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateReports a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateReportsDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateReportsDto>): CreateReportsDto {
    const instance = new CreateReportsDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateReportsDto {
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
    type: () => CreateReportsDto,
    description: 'Instancia CreateReports o UpdateReports',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateReportsDto, { nullable: true })
  input?: CreateReportsDto | UpdateReportsDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteReportsDto {
  // Propiedades específicas de la clase DeleteReportsDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteReports a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteReports a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateReportsDto extends BaseReportsDto {
  // Propiedades específicas de la clase UpdateReportsDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateReports a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateReportsDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateReportsDto>): UpdateReportsDto {
    const instance = new UpdateReportsDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



