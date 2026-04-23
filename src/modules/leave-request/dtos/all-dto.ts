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
export class BaseLeaveRequestDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateLeaveRequest',
    example: 'Nombre de instancia CreateLeaveRequest',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateLeaveRequestDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateLeaveRequest).',
    example: 'Fecha de creación de la instancia (CreateLeaveRequest).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateLeaveRequest).',
    example: 'Fecha de actualización de la instancia (CreateLeaveRequest).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateLeaveRequest).',
    example:
      'Usuario que realiza la creación de la instancia (CreateLeaveRequest).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateLeaveRequest).',
    example: 'Estado de activación de la instancia (CreateLeaveRequest).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Empleado solicitante',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Empleado solicitante', nullable: false })
  employeeId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de permiso',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de permiso', nullable: false })
  leaveType!: string;

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Inicio',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Inicio', nullable: false })
  dateFrom!: Date;

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Fin',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Fin', nullable: false })
  dateTo!: Date;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Días',
  })
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Float, { description: 'Días', nullable: false })
  days!: number;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Motivo',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Motivo', nullable: true })
  reason?: string = '';

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
    description: 'Aprobador',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Aprobador', nullable: true })
  approverEmployeeId?: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de decisión',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de decisión', nullable: true })
  decidedAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Justificante adjunto',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Justificante adjunto', nullable: true })
  attachmentUrl?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Saldo resultante si aprobado',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Saldo resultante si aprobado', nullable: true })
  balanceAfterDays?: number = 0;

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
  constructor(partial: Partial<BaseLeaveRequestDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class LeaveRequestDto extends BaseLeaveRequestDto {
  // Propiedades específicas de la clase LeaveRequestDto en cuestión

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
  constructor(partial: Partial<LeaveRequestDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<LeaveRequestDto>): LeaveRequestDto {
    const instance = new LeaveRequestDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class LeaveRequestValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => LeaveRequestDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => LeaveRequestDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class LeaveRequestOutPutDto extends BaseLeaveRequestDto {
  // Propiedades específicas de la clase LeaveRequestOutPutDto en cuestión

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
  constructor(partial: Partial<LeaveRequestOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<LeaveRequestOutPutDto>): LeaveRequestOutPutDto {
    const instance = new LeaveRequestOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateLeaveRequestDto extends BaseLeaveRequestDto {
  // Propiedades específicas de la clase CreateLeaveRequestDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateLeaveRequest a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateLeaveRequestDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateLeaveRequestDto>): CreateLeaveRequestDto {
    const instance = new CreateLeaveRequestDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateLeaveRequestDto {
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
    type: () => CreateLeaveRequestDto,
    description: 'Instancia CreateLeaveRequest o UpdateLeaveRequest',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateLeaveRequestDto, { nullable: true })
  input?: CreateLeaveRequestDto | UpdateLeaveRequestDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteLeaveRequestDto {
  // Propiedades específicas de la clase DeleteLeaveRequestDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteLeaveRequest a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteLeaveRequest a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateLeaveRequestDto extends BaseLeaveRequestDto {
  // Propiedades específicas de la clase UpdateLeaveRequestDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateLeaveRequest a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateLeaveRequestDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateLeaveRequestDto>): UpdateLeaveRequestDto {
    const instance = new UpdateLeaveRequestDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



