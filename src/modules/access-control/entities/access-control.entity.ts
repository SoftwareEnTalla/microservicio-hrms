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
import { CreateAccessControlDto, UpdateAccessControlDto, DeleteAccessControlDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_access_credential_code', ['credentialCode'], { unique: true })
@Index('idx_access_credential_employee', ['employeeId'])
@Unique('uq_access_credential_code', ['credentialCode'])
@ChildEntity('accesscontrol')
@ObjectType()
export class AccessControl extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de AccessControl",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de AccessControl", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia AccessControl' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de AccessControl",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de AccessControl", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia AccessControl' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código de la credencial (hash)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código de la credencial (hash)', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 120, unique: true, comment: 'Código de la credencial (hash)' })
  credentialCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Empleado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Empleado', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Empleado' })
  employeeId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, comment: 'Tipo' })
  credentialType!: string;

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Emisión',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Emisión', nullable: false })
  @Column({ type: 'timestamp', nullable: false, comment: 'Emisión' })
  issuedAt!: Date;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Válida desde',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Válida desde', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Válida desde' })
  validFrom?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Válida hasta',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Válida hasta', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Válida hasta' })
  validTo?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'ACTIVE', comment: 'Estado' })
  status!: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha revocación',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha revocación', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha revocación' })
  revokedAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Motivo revocación',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Motivo revocación', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 255, comment: 'Motivo revocación' })
  revocationReason?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Zonas autorizadas',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Zonas autorizadas', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Zonas autorizadas' })
  zoneCodes?: Record<string, any> = {};

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
    // Rule: access-requires-employee
    // La credencial requiere empleado.
    if (!(!(this.employeeId === undefined || this.employeeId === null || (typeof this.employeeId === 'string' && String(this.employeeId).trim() === '') || (Array.isArray(this.employeeId) && this.employeeId.length === 0) || (typeof this.employeeId === 'object' && !Array.isArray(this.employeeId) && Object.prototype.toString.call(this.employeeId) === '[object Object]' && Object.keys(Object(this.employeeId)).length === 0)))) {
      throw new Error('HRMS_AC_001: employeeId requerido');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'accesscontrol';
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
  static fromDto(dto: CreateAccessControlDto): AccessControl;
  static fromDto(dto: UpdateAccessControlDto): AccessControl;
  static fromDto(dto: DeleteAccessControlDto): AccessControl;
  static fromDto(dto: any): AccessControl {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(AccessControl, dto);
  }
}
