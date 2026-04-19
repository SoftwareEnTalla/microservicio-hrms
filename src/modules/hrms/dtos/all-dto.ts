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
export class BaseHrmsDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateHrms',
    example: 'Nombre de instancia CreateHrms',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateHrmsDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateHrms).',
    example: 'Fecha de creación de la instancia (CreateHrms).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateHrms).',
    example: 'Fecha de actualización de la instancia (CreateHrms).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateHrms).',
    example:
      'Usuario que realiza la creación de la instancia (CreateHrms).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateHrms).',
    example: 'Estado de activación de la instancia (CreateHrms).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo



  // Constructor
  constructor(partial: Partial<BaseHrmsDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class HrmsDto extends BaseHrmsDto {
  // Propiedades específicas de la clase HrmsDto en cuestión

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
  constructor(partial: Partial<HrmsDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<HrmsDto>): HrmsDto {
    const instance = new HrmsDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class HrmsValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => HrmsDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => HrmsDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class HrmsOutPutDto extends BaseHrmsDto {
  // Propiedades específicas de la clase HrmsOutPutDto en cuestión

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
  constructor(partial: Partial<HrmsOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<HrmsOutPutDto>): HrmsOutPutDto {
    const instance = new HrmsOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateHrmsDto extends BaseHrmsDto {
  // Propiedades específicas de la clase CreateHrmsDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateHrms a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateHrmsDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateHrmsDto>): CreateHrmsDto {
    const instance = new CreateHrmsDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateHrmsDto {
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
    type: () => CreateHrmsDto,
    description: 'Instancia CreateHrms o UpdateHrms',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateHrmsDto, { nullable: true })
  input?: CreateHrmsDto | UpdateHrmsDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteHrmsDto {
  // Propiedades específicas de la clase DeleteHrmsDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteHrms a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteHrms a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateHrmsDto extends BaseHrmsDto {
  // Propiedades específicas de la clase UpdateHrmsDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateHrms a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateHrmsDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateHrmsDto>): UpdateHrmsDto {
    const instance = new UpdateHrmsDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



