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
import { CreateConfigurationParameterDto, UpdateConfigurationParameterDto, DeleteConfigurationParameterDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_config_param_scope_key', ['scope', 'scopeId', 'paramKey'])
@Unique('uq_config_param_key_scope_from', ['paramKey', 'scope', 'scopeId', 'effectiveFrom'])
@ChildEntity('configurationparameter')
@ObjectType()
export class ConfigurationParameter extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de ConfigurationParameter",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de ConfigurationParameter", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia ConfigurationParameter' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de ConfigurationParameter",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de ConfigurationParameter", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia ConfigurationParameter' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Clave del parámetro',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Clave del parámetro', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 160, comment: 'Clave del parámetro' })
  paramKey!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Ámbito de aplicación',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Ámbito de aplicación', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'GLOBAL', comment: 'Ámbito de aplicación' })
  scope!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador del scope (companyCode, workCenterCode)',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Identificador del scope (companyCode, workCenterCode)', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 80, comment: 'Identificador del scope (companyCode, workCenterCode)' })
  scopeId?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo del valor',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo del valor', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'STRING', comment: 'Tipo del valor' })
  valueType!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Valor en string',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Valor en string', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 500, comment: 'Valor en string' })
  stringValue?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Valor numérico',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Valor numérico', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 18, scale: 6, comment: 'Valor numérico' })
  numericValue?: number = 0;

  @ApiProperty({
    type: () => Boolean,
    nullable: true,
    description: 'Valor booleano',
  })
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { description: 'Valor booleano', nullable: true })
  @Column({ type: 'boolean', nullable: true, comment: 'Valor booleano' })
  booleanValue?: boolean = false;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Valor JSON',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Valor JSON', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Valor JSON' })
  jsonValue?: Record<string, any> = {};

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Valor fecha',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Valor fecha', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Valor fecha' })
  dateValue?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Vigencia desde',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Vigencia desde', nullable: false })
  @Column({ type: 'timestamp', nullable: false, comment: 'Vigencia desde' })
  effectiveFrom!: Date;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Vigencia hasta',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Vigencia hasta', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Vigencia hasta' })
  effectiveTo?: Date = new Date();

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
    // Rule: config-param-key-required
    // Todo parámetro requiere clave.
    if (!(!(this.paramKey === undefined || this.paramKey === null || (typeof this.paramKey === 'string' && String(this.paramKey).trim() === '') || (Array.isArray(this.paramKey) && this.paramKey.length === 0) || (typeof this.paramKey === 'object' && !Array.isArray(this.paramKey) && Object.prototype.toString.call(this.paramKey) === '[object Object]' && Object.keys(Object(this.paramKey)).length === 0)))) {
      throw new Error('HRMS_CFG_001: Parámetro requiere clave');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'configurationparameter';
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
  static fromDto(dto: CreateConfigurationParameterDto): ConfigurationParameter;
  static fromDto(dto: UpdateConfigurationParameterDto): ConfigurationParameter;
  static fromDto(dto: DeleteConfigurationParameterDto): ConfigurationParameter;
  static fromDto(dto: any): ConfigurationParameter {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(ConfigurationParameter, dto);
  }
}
