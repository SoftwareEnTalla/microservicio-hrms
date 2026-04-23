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
import { CreateAttendanceDto, UpdateAttendanceDto, DeleteAttendanceDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_attendance_employee_date', ['employeeId', 'occurredAt'])
@Unique('uq_attendance_employee_timestamp_type', ['employeeId', 'occurredAt', 'entryType'])
@ChildEntity('attendance')
@ObjectType()
export class Attendance extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Attendance",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de Attendance", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia Attendance' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de Attendance",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de Attendance", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia Attendance' })
  private description!: string;

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
    description: 'Tipo de fichaje',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de fichaje', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, comment: 'Tipo de fichaje' })
  entryType!: string;

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Timestamp del fichaje',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Timestamp del fichaje', nullable: false })
  @Column({ type: 'timestamp', nullable: false, comment: 'Timestamp del fichaje' })
  occurredAt!: Date;

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
    nullable: false,
    description: 'Canal',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Canal', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'WEB', comment: 'Canal' })
  channel!: string;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Latitud',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Latitud', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 9, scale: 6, comment: 'Latitud' })
  geoLat?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Longitud',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Longitud', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 9, scale: 6, comment: 'Longitud' })
  geoLon?: number = 0;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de timesheet consolidada',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de timesheet consolidada', nullable: true })
  @Column({ type: 'date', nullable: true, comment: 'Fecha de timesheet consolidada' })
  timesheetDate?: Date = new Date();

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Horas regulares consolidadas',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Horas regulares consolidadas', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 6, scale: 2, comment: 'Horas regulares consolidadas' })
  regularHours?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Horas extra consolidadas',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Horas extra consolidadas', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 6, scale: 2, comment: 'Horas extra consolidadas' })
  overtimeHours?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'RECORDED', comment: 'Estado' })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Supervisor que aprueba',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Supervisor que aprueba', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Supervisor que aprueba' })
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
    // Rule: attendance-requires-employee
    // Fichaje requiere employeeId.
    if (!(!(this.employeeId === undefined || this.employeeId === null || (typeof this.employeeId === 'string' && String(this.employeeId).trim() === '') || (Array.isArray(this.employeeId) && this.employeeId.length === 0) || (typeof this.employeeId === 'object' && !Array.isArray(this.employeeId) && Object.prototype.toString.call(this.employeeId) === '[object Object]' && Object.keys(Object(this.employeeId)).length === 0)))) {
      throw new Error('HRMS_ATT_001: employeeId requerido');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'attendance';
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
  static fromDto(dto: CreateAttendanceDto): Attendance;
  static fromDto(dto: UpdateAttendanceDto): Attendance;
  static fromDto(dto: DeleteAttendanceDto): Attendance;
  static fromDto(dto: any): Attendance {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(Attendance, dto);
  }
}
