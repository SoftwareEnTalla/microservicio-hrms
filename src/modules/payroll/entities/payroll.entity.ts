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
import { CreatePayrollDto, UpdatePayrollDto, DeletePayrollDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_payroll_cycle_code', ['cycleCode'], { unique: true })
@Index('idx_payroll_company_period', ['companyCode', 'periodStart', 'periodEnd'])
@Unique('uq_payroll_cycle_code', ['cycleCode'])
@ChildEntity('payroll')
@ObjectType()
export class Payroll extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Payroll",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de Payroll", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia Payroll' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de Payroll",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de Payroll", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia Payroll' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código del ciclo',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código del ciclo', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 80, unique: true, comment: 'Código del ciclo' })
  cycleCode!: string;

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
    nullable: false,
    description: 'Frecuencia',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Frecuencia', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'MONTHLY', comment: 'Frecuencia' })
  frequency!: string;

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Inicio de periodo',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Inicio de periodo', nullable: false })
  @Column({ type: 'timestamp', nullable: false, comment: 'Inicio de periodo' })
  periodStart!: Date;

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Fin de periodo',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Fin de periodo', nullable: false })
  @Column({ type: 'timestamp', nullable: false, comment: 'Fin de periodo' })
  periodEnd!: Date;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Moneda',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Moneda', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 8, default: 'USD', comment: 'Moneda' })
  currency!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Alcance',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Alcance', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'COMPANY', comment: 'Alcance' })
  scopeType!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador del alcance',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Identificador del alcance', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 80, comment: 'Identificador del alcance' })
  scopeId?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'DRAFT', comment: 'Estado' })
  status!: string;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Total bruto',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Total bruto', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 18, scale: 2, comment: 'Total bruto' })
  totalGross?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Total neto',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Total neto', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 18, scale: 2, comment: 'Total neto' })
  totalNet?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Total impuestos',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Total impuestos', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 18, scale: 2, comment: 'Total impuestos' })
  totalTaxes?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Aprobador',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Aprobador', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Aprobador' })
  approvedBy?: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha aprobación',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha aprobación', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha aprobación' })
  approvedAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha pago',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha pago', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha pago' })
  paidAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha cierre',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha cierre', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha cierre' })
  closedAt?: Date = new Date();

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
    // No se definieron business-rules en el DSL.
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'payroll';
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
  static fromDto(dto: CreatePayrollDto): Payroll;
  static fromDto(dto: UpdatePayrollDto): Payroll;
  static fromDto(dto: DeletePayrollDto): Payroll;
  static fromDto(dto: any): Payroll {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(Payroll, dto);
  }
}
