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
import { CreateReportsDto, UpdateReportsDto, DeleteReportsDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_report_code', ['reportCode'], { unique: true })
@Unique('uq_report_code', ['reportCode'])
@ChildEntity('reports')
@ObjectType()
export class Reports extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Reports",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de Reports", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia Reports' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de Reports",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de Reports", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia Reports' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código de reporte',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código de reporte', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 120, unique: true, comment: 'Código de reporte' })
  reportCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Título',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Título', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 180, comment: 'Título' })
  title!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Categoría',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Categoría', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'CUSTOM', comment: 'Categoría' })
  category!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador de la consulta',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Identificador de la consulta', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 180, comment: 'Identificador de la consulta' })
  queryRef?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Formatos permitidos: PDF,CSV,JSON,EXCEL',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Formatos permitidos: PDF,CSV,JSON,EXCEL', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Formatos permitidos: PDF,CSV,JSON,EXCEL' })
  allowedFormats?: Record<string, any> = {};

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Roles que pueden ejecutarlo',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Roles que pueden ejecutarlo', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Roles que pueden ejecutarlo' })
  allowedRoles?: Record<string, any> = {};

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Accesible a EXTERNAL_AUDITOR',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Accesible a EXTERNAL_AUDITOR', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Accesible a EXTERNAL_AUDITOR' })
  auditable!: boolean;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Esquema JSON de parámetros',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Esquema JSON de parámetros', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Esquema JSON de parámetros' })
  parametersSchema?: Record<string, any> = {};

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Última ejecución',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Última ejecución', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Última ejecución' })
  lastExecutionId?: string;

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
    // Rule: report-code-required
    // reportCode requerido.
    if (!(!(this.reportCode === undefined || this.reportCode === null || (typeof this.reportCode === 'string' && String(this.reportCode).trim() === '') || (Array.isArray(this.reportCode) && this.reportCode.length === 0) || (typeof this.reportCode === 'object' && !Array.isArray(this.reportCode) && Object.prototype.toString.call(this.reportCode) === '[object Object]' && Object.keys(Object(this.reportCode)).length === 0)))) {
      throw new Error('HRMS_RPT_001: reportCode requerido');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'reports';
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
  static fromDto(dto: CreateReportsDto): Reports;
  static fromDto(dto: UpdateReportsDto): Reports;
  static fromDto(dto: DeleteReportsDto): Reports;
  static fromDto(dto: any): Reports {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(Reports, dto);
  }
}
