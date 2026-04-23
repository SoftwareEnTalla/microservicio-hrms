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

import { Column, Entity, OneToOne, JoinColumn, ChildEntity, ManyToOne, OneToMany, ManyToMany, JoinTable, Index, Check, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CreateEmployeeDto, UpdateEmployeeDto, DeleteEmployeeDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_employee_number', ['employeeNumber'], { unique: true })
@Index('idx_employee_person', ['personId'])
@Unique('uq_employee_number_company', ['employeeNumber', 'companyCode'])
@ChildEntity('employee')
@ObjectType()
export class Employee extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Employee",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de Employee", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia Employee' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de Employee",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de Employee", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia Employee' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Número de empleado',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Número de empleado', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 40, unique: true, comment: 'Número de empleado' })
  employeeNumber!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Persona asociada',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Persona asociada', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Persona asociada' })
  personId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Empresa',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Empresa', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 40, comment: 'Empresa' })
  companyCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Centro de trabajo',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Centro de trabajo', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 40, comment: 'Centro de trabajo' })
  workCenterCode?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Departamento (legacy, preferir organizationUnitCode)',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Departamento (legacy, preferir organizationUnitCode)', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 40, comment: 'Departamento (legacy, preferir organizationUnitCode)' })
  departmentCode?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Código del nodo organizativo asignado (organization-service)',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Código del nodo organizativo asignado (organization-service)', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, comment: 'Código del nodo organizativo asignado (organization-service)' })
  organizationUnitCode?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Path materializado del nodo organizativo (cache)',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Path materializado del nodo organizativo (cache)', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 500, comment: 'Path materializado del nodo organizativo (cache)' })
  organizationUnitPath?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Puesto',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Puesto', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 160, comment: 'Puesto' })
  jobTitle?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Jefe directo',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Jefe directo', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Jefe directo' })
  managerEmployeeId?: string;

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Fecha de ingreso',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Fecha de ingreso', nullable: false })
  @Column({ type: 'timestamp', nullable: false, comment: 'Fecha de ingreso' })
  hiredAt!: Date;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de baja',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de baja', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha de baja' })
  terminatedAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'ONBOARDING', comment: 'Estado' })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de contrato',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de contrato', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'INDEFINITE', comment: 'Tipo de contrato' })
  contractType!: string;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Salario base',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Salario base', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 18, scale: 2, comment: 'Salario base' })
  salary?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Moneda del salario',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Moneda del salario', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 8, comment: 'Moneda del salario' })
  currency?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos' })
  metadata?: Record<string, any> = {};

  protected executeDslLifecycle(): void {
    // Rule: employee-requires-person
    // Empleado requiere personId.
    if (!(!(this.personId === undefined || this.personId === null || (typeof this.personId === 'string' && String(this.personId).trim() === '') || (Array.isArray(this.personId) && this.personId.length === 0) || (typeof this.personId === 'object' && !Array.isArray(this.personId) && Object.prototype.toString.call(this.personId) === '[object Object]' && Object.keys(Object(this.personId)).length === 0)))) {
      throw new Error('HRMS_EMP_001: personId requerido');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'employee';
  }

  // Getters y Setters
  get getName(): string {
    return this.name;
  }
  set setName(value: string) {
    this.name = value;
  }
  get getDescription(): string {
    return this.description;
  }

  // Métodos abstractos implementados
  async create(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async update(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async delete(id: string): Promise<BaseEntity> {
    this.id = id;
    return this;
  }

  // Método estático para convertir DTOs a entidad con sobrecarga
  static fromDto(dto: CreateEmployeeDto): Employee;
  static fromDto(dto: UpdateEmployeeDto): Employee;
  static fromDto(dto: DeleteEmployeeDto): Employee;
  static fromDto(dto: any): Employee {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(Employee, dto);
  }
}
