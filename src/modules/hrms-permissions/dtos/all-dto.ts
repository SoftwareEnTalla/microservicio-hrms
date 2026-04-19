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
export class BaseHrmsPermissionsDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateHrmsPermissions',
    example: 'Nombre de instancia CreateHrmsPermissions',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateHrmsPermissionsDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateHrmsPermissions).',
    example: 'Fecha de creación de la instancia (CreateHrmsPermissions).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateHrmsPermissions).',
    example: 'Fecha de actualización de la instancia (CreateHrmsPermissions).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateHrmsPermissions).',
    example:
      'Usuario que realiza la creación de la instancia (CreateHrmsPermissions).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateHrmsPermissions).',
    example: 'Estado de activación de la instancia (CreateHrmsPermissions).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Usuario destinatario',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Usuario destinatario', nullable: false })
  userId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Rol HRMS (HR_ADMINISTRATOR, HR_MANAGER, ...)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Rol HRMS (HR_ADMINISTRATOR, HR_MANAGER, ...)', nullable: false })
  roleCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Permiso (módulo:acción:recurso)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Permiso (módulo:acción:recurso)', nullable: false })
  permissionCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Recurso HRMS',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Recurso HRMS', nullable: false })
  resource!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Acción (read, create, update, delete, approve)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Acción (read, create, update, delete, approve)', nullable: false })
  action!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Ámbito (self, team, department, all)',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Ámbito (self, team, department, all)', nullable: true })
  scope?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Efecto',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Efecto', nullable: false })
  effect!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Origen del permiso',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Origen del permiso', nullable: false })
  source!: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de asignación',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de asignación', nullable: true })
  assignedAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de revocación',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de revocación', nullable: true })
  revokedAt?: Date = new Date();

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
  constructor(partial: Partial<BaseHrmsPermissionsDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class HrmsPermissionsDto extends BaseHrmsPermissionsDto {
  // Propiedades específicas de la clase HrmsPermissionsDto en cuestión

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
  constructor(partial: Partial<HrmsPermissionsDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<HrmsPermissionsDto>): HrmsPermissionsDto {
    const instance = new HrmsPermissionsDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class HrmsPermissionsValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => HrmsPermissionsDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => HrmsPermissionsDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class HrmsPermissionsOutPutDto extends BaseHrmsPermissionsDto {
  // Propiedades específicas de la clase HrmsPermissionsOutPutDto en cuestión

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
  constructor(partial: Partial<HrmsPermissionsOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<HrmsPermissionsOutPutDto>): HrmsPermissionsOutPutDto {
    const instance = new HrmsPermissionsOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateHrmsPermissionsDto extends BaseHrmsPermissionsDto {
  // Propiedades específicas de la clase CreateHrmsPermissionsDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateHrmsPermissions a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateHrmsPermissionsDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateHrmsPermissionsDto>): CreateHrmsPermissionsDto {
    const instance = new CreateHrmsPermissionsDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateHrmsPermissionsDto {
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
    type: () => CreateHrmsPermissionsDto,
    description: 'Instancia CreateHrmsPermissions o UpdateHrmsPermissions',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateHrmsPermissionsDto, { nullable: true })
  input?: CreateHrmsPermissionsDto | UpdateHrmsPermissionsDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteHrmsPermissionsDto {
  // Propiedades específicas de la clase DeleteHrmsPermissionsDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteHrmsPermissions a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteHrmsPermissions a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateHrmsPermissionsDto extends BaseHrmsPermissionsDto {
  // Propiedades específicas de la clase UpdateHrmsPermissionsDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateHrmsPermissions a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateHrmsPermissionsDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateHrmsPermissionsDto>): UpdateHrmsPermissionsDto {
    const instance = new UpdateHrmsPermissionsDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



