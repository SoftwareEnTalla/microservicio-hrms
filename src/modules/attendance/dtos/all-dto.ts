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
export class BaseAttendanceDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateAttendance',
    example: 'Nombre de instancia CreateAttendance',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateAttendanceDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateAttendance).',
    example: 'Fecha de creación de la instancia (CreateAttendance).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateAttendance).',
    example: 'Fecha de actualización de la instancia (CreateAttendance).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateAttendance).',
    example:
      'Usuario que realiza la creación de la instancia (CreateAttendance).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateAttendance).',
    example: 'Estado de activación de la instancia (CreateAttendance).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Empleado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Empleado', nullable: false })
  employeeId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de fichaje',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de fichaje', nullable: false })
  entryType!: string;

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Timestamp del fichaje',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Timestamp del fichaje', nullable: false })
  occurredAt!: Date;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Centro de trabajo',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Centro de trabajo', nullable: true })
  workCenterCode?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Canal',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Canal', nullable: false })
  channel!: string;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Latitud',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Latitud', nullable: true })
  geoLat?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Longitud',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Longitud', nullable: true })
  geoLon?: number = 0;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de timesheet consolidada',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de timesheet consolidada', nullable: true })
  timesheetDate?: Date = new Date();

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Horas regulares consolidadas',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Horas regulares consolidadas', nullable: true })
  regularHours?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Horas extra consolidadas',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Horas extra consolidadas', nullable: true })
  overtimeHours?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Supervisor que aprueba',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Supervisor que aprueba', nullable: true })
  approvedBy?: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha aprobación',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha aprobación', nullable: true })
  approvedAt?: Date = new Date();

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
  constructor(partial: Partial<BaseAttendanceDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class AttendanceDto extends BaseAttendanceDto {
  // Propiedades específicas de la clase AttendanceDto en cuestión

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
  constructor(partial: Partial<AttendanceDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<AttendanceDto>): AttendanceDto {
    const instance = new AttendanceDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class AttendanceValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => AttendanceDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => AttendanceDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class AttendanceOutPutDto extends BaseAttendanceDto {
  // Propiedades específicas de la clase AttendanceOutPutDto en cuestión

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
  constructor(partial: Partial<AttendanceOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<AttendanceOutPutDto>): AttendanceOutPutDto {
    const instance = new AttendanceOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateAttendanceDto extends BaseAttendanceDto {
  // Propiedades específicas de la clase CreateAttendanceDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateAttendance a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateAttendanceDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateAttendanceDto>): CreateAttendanceDto {
    const instance = new CreateAttendanceDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateAttendanceDto {
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
    type: () => CreateAttendanceDto,
    description: 'Instancia CreateAttendance o UpdateAttendance',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateAttendanceDto, { nullable: true })
  input?: CreateAttendanceDto | UpdateAttendanceDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteAttendanceDto {
  // Propiedades específicas de la clase DeleteAttendanceDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteAttendance a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteAttendance a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateAttendanceDto extends BaseAttendanceDto {
  // Propiedades específicas de la clase UpdateAttendanceDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateAttendance a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateAttendanceDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateAttendanceDto>): UpdateAttendanceDto {
    const instance = new UpdateAttendanceDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



