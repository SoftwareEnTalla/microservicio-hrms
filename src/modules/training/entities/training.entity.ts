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
import { CreateTrainingDto, UpdateTrainingDto, DeleteTrainingDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_course_code', ['courseCode'], { unique: true })
@Unique('uq_course_code', ['courseCode'])
@ChildEntity('training')
@ObjectType()
export class Training extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Training",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de Training", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia Training' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de Training",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de Training", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia Training' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código curso',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código curso', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 80, unique: true, comment: 'Código curso' })
  courseCode!: string;

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
    nullable: true,
    description: 'Categoría',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Categoría', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 80, comment: 'Categoría' })
  category?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Horas de duración',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Horas de duración', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 6, scale: 2, comment: 'Horas de duración' })
  durationHours?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Modalidad',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Modalidad', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'VIRTUAL', comment: 'Modalidad' })
  modality!: string;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Obligatorio',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Obligatorio', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Obligatorio' })
  mandatory!: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Auto inscripción',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Auto inscripción', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: true, comment: 'Auto inscripción' })
  selfEnrollable!: boolean;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Meses de vigencia de la certificación',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Meses de vigencia de la certificación', nullable: true })
  @Column({ type: 'int', nullable: true, comment: 'Meses de vigencia de la certificación' })
  validityMonths?: number = 0;

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
    // Rule: course-code-required
    // courseCode requerido.
    if (!(!(this.courseCode === undefined || this.courseCode === null || (typeof this.courseCode === 'string' && String(this.courseCode).trim() === '') || (Array.isArray(this.courseCode) && this.courseCode.length === 0) || (typeof this.courseCode === 'object' && !Array.isArray(this.courseCode) && Object.prototype.toString.call(this.courseCode) === '[object Object]' && Object.keys(Object(this.courseCode)).length === 0)))) {
      throw new Error('HRMS_TR_001: courseCode requerido');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'training';
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
  static fromDto(dto: CreateTrainingDto): Training;
  static fromDto(dto: UpdateTrainingDto): Training;
  static fromDto(dto: DeleteTrainingDto): Training;
  static fromDto(dto: any): Training {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(Training, dto);
  }
}
