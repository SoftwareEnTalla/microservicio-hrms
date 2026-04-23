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
import { CreateLeaveRequestDto, UpdateLeaveRequestDto, DeleteLeaveRequestDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_leave_employee', ['employeeId', 'dateFrom'])
@ChildEntity('leaverequest')
@ObjectType()
export class LeaveRequest extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de LeaveRequest",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de LeaveRequest", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia LeaveRequest' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de LeaveRequest",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de LeaveRequest", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia LeaveRequest' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Empleado solicitante',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Empleado solicitante', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Empleado solicitante' })
  employeeId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de permiso',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de permiso', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, comment: 'Tipo de permiso' })
  leaveType!: string;

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Inicio',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Inicio', nullable: false })
  @Column({ type: 'timestamp', nullable: false, comment: 'Inicio' })
  dateFrom!: Date;

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Fin',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Fin', nullable: false })
  @Column({ type: 'timestamp', nullable: false, comment: 'Fin' })
  dateTo!: Date;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Días',
  })
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Float, { description: 'Días', nullable: false })
  @Column({ type: 'decimal', nullable: false, precision: 6, scale: 2, comment: 'Días' })
  days!: number;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Motivo',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Motivo', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 500, comment: 'Motivo' })
  reason?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'PENDING', comment: 'Estado' })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Aprobador',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Aprobador', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Aprobador' })
  approverEmployeeId?: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de decisión',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de decisión', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha de decisión' })
  decidedAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Justificante adjunto',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Justificante adjunto', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 500, comment: 'Justificante adjunto' })
  attachmentUrl?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Saldo resultante si aprobado',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Saldo resultante si aprobado', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 6, scale: 2, comment: 'Saldo resultante si aprobado' })
  balanceAfterDays?: number = 0;

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
    this.type = 'leaverequest';
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
  static fromDto(dto: CreateLeaveRequestDto): LeaveRequest;
  static fromDto(dto: UpdateLeaveRequestDto): LeaveRequest;
  static fromDto(dto: DeleteLeaveRequestDto): LeaveRequest;
  static fromDto(dto: any): LeaveRequest {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(LeaveRequest, dto);
  }
}
