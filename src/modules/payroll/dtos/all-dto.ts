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
export class BasePayrollDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreatePayroll',
    example: 'Nombre de instancia CreatePayroll',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreatePayrollDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreatePayroll).',
    example: 'Fecha de creación de la instancia (CreatePayroll).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreatePayroll).',
    example: 'Fecha de actualización de la instancia (CreatePayroll).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreatePayroll).',
    example:
      'Usuario que realiza la creación de la instancia (CreatePayroll).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreatePayroll).',
    example: 'Estado de activación de la instancia (CreatePayroll).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código del ciclo',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código del ciclo', nullable: false })
  cycleCode!: string;

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
    nullable: false,
    description: 'Frecuencia',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Frecuencia', nullable: false })
  frequency!: string;

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Inicio de periodo',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Inicio de periodo', nullable: false })
  periodStart!: Date;

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Fin de periodo',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Fin de periodo', nullable: false })
  periodEnd!: Date;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Moneda',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Moneda', nullable: false })
  currency!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Alcance',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Alcance', nullable: false })
  scopeType!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador del alcance',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Identificador del alcance', nullable: true })
  scopeId?: string = '';

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
    type: () => Number,
    nullable: true,
    description: 'Total bruto',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Total bruto', nullable: true })
  totalGross?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Total neto',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Total neto', nullable: true })
  totalNet?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Total impuestos',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Total impuestos', nullable: true })
  totalTaxes?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Aprobador',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Aprobador', nullable: true })
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
    type: () => Date,
    nullable: true,
    description: 'Fecha pago',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha pago', nullable: true })
  paidAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha cierre',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha cierre', nullable: true })
  closedAt?: Date = new Date();

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
  constructor(partial: Partial<BasePayrollDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class PayrollDto extends BasePayrollDto {
  // Propiedades específicas de la clase PayrollDto en cuestión

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
  constructor(partial: Partial<PayrollDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<PayrollDto>): PayrollDto {
    const instance = new PayrollDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class PayrollValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => PayrollDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => PayrollDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class PayrollOutPutDto extends BasePayrollDto {
  // Propiedades específicas de la clase PayrollOutPutDto en cuestión

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
  constructor(partial: Partial<PayrollOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<PayrollOutPutDto>): PayrollOutPutDto {
    const instance = new PayrollOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreatePayrollDto extends BasePayrollDto {
  // Propiedades específicas de la clase CreatePayrollDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreatePayroll a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreatePayrollDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreatePayrollDto>): CreatePayrollDto {
    const instance = new CreatePayrollDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdatePayrollDto {
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
    type: () => CreatePayrollDto,
    description: 'Instancia CreatePayroll o UpdatePayroll',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreatePayrollDto, { nullable: true })
  input?: CreatePayrollDto | UpdatePayrollDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeletePayrollDto {
  // Propiedades específicas de la clase DeletePayrollDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeletePayroll a eliminar',
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
      'Se proporciona una lista de identificadores de DeletePayroll a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdatePayrollDto extends BasePayrollDto {
  // Propiedades específicas de la clase UpdatePayrollDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdatePayroll a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdatePayrollDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdatePayrollDto>): UpdatePayrollDto {
    const instance = new UpdatePayrollDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



