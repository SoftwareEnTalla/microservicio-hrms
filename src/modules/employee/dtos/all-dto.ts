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
export class BaseEmployeeDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateEmployee',
    example: 'Nombre de instancia CreateEmployee',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateEmployeeDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateEmployee).',
    example: 'Fecha de creación de la instancia (CreateEmployee).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateEmployee).',
    example: 'Fecha de actualización de la instancia (CreateEmployee).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateEmployee).',
    example:
      'Usuario que realiza la creación de la instancia (CreateEmployee).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateEmployee).',
    example: 'Estado de activación de la instancia (CreateEmployee).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Número de empleado',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Número de empleado', nullable: false })
  employeeNumber!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Persona asociada',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Persona asociada', nullable: false })
  personId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Empresa',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Empresa', nullable: false })
  companyCode!: string;

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
    nullable: true,
    description: 'Departamento',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Departamento', nullable: true })
  departmentCode?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Puesto',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Puesto', nullable: true })
  jobTitle?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Jefe directo',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Jefe directo', nullable: true })
  managerEmployeeId?: string;

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Fecha de ingreso',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Fecha de ingreso', nullable: false })
  hiredAt!: Date;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de baja',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de baja', nullable: true })
  terminatedAt?: Date = new Date();

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
    nullable: false,
    description: 'Tipo de contrato',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de contrato', nullable: false })
  contractType!: string;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Salario base',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Salario base', nullable: true })
  salary?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Moneda del salario',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Moneda del salario', nullable: true })
  currency?: string = '';

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
  constructor(partial: Partial<BaseEmployeeDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class EmployeeDto extends BaseEmployeeDto {
  // Propiedades específicas de la clase EmployeeDto en cuestión

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
  constructor(partial: Partial<EmployeeDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<EmployeeDto>): EmployeeDto {
    const instance = new EmployeeDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class EmployeeValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => EmployeeDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => EmployeeDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class EmployeeOutPutDto extends BaseEmployeeDto {
  // Propiedades específicas de la clase EmployeeOutPutDto en cuestión

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
  constructor(partial: Partial<EmployeeOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<EmployeeOutPutDto>): EmployeeOutPutDto {
    const instance = new EmployeeOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateEmployeeDto extends BaseEmployeeDto {
  // Propiedades específicas de la clase CreateEmployeeDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateEmployee a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateEmployeeDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateEmployeeDto>): CreateEmployeeDto {
    const instance = new CreateEmployeeDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateEmployeeDto {
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
    type: () => CreateEmployeeDto,
    description: 'Instancia CreateEmployee o UpdateEmployee',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateEmployeeDto, { nullable: true })
  input?: CreateEmployeeDto | UpdateEmployeeDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteEmployeeDto {
  // Propiedades específicas de la clase DeleteEmployeeDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteEmployee a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteEmployee a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateEmployeeDto extends BaseEmployeeDto {
  // Propiedades específicas de la clase UpdateEmployeeDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateEmployee a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateEmployeeDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateEmployeeDto>): UpdateEmployeeDto {
    const instance = new UpdateEmployeeDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



