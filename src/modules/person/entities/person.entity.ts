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
import { CreatePersonDto, UpdatePersonDto, DeletePersonDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_person_code', ['personCode'], { unique: true })
@Index('idx_person_document', ['documentType', 'documentNumber'], { unique: true })
@Unique('uq_person_document', ['documentType', 'documentNumber'])
@ChildEntity('person')
@ObjectType()
export class Person extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Person",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de Person", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia Person' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de Person",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de Person", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia Person' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código interno de persona',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código interno de persona', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 80, unique: true, comment: 'Código interno de persona' })
  personCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de documento',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de documento', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'NATIONAL_ID', comment: 'Tipo de documento' })
  documentType!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Número de documento',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Número de documento', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 60, comment: 'Número de documento' })
  documentNumber!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Nombre',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Nombre', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 120, comment: 'Nombre' })
  firstName!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Segundo nombre',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Segundo nombre', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, comment: 'Segundo nombre' })
  middleName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Apellido paterno',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Apellido paterno', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 120, comment: 'Apellido paterno' })
  lastName!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Apellido materno',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Apellido materno', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, comment: 'Apellido materno' })
  secondLastName?: string = '';

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de nacimiento',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de nacimiento', nullable: true })
  @Column({ type: 'date', nullable: true, comment: 'Fecha de nacimiento' })
  birthDate?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Género',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Género', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 255, default: 'NOT_DECLARED', comment: 'Género' })
  gender?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Email principal',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Email principal', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 180, comment: 'Email principal' })
  email?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Teléfono principal',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Teléfono principal', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 40, comment: 'Teléfono principal' })
  phone?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Nacionalidad',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Nacionalidad', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 80, comment: 'Nacionalidad' })
  nationality?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de persona',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de persona', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'ACTIVE', comment: 'Estado de persona' })
  status!: string;

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
    // Rule: person-names-required
    // Nombre y apellido son obligatorios.
    if (!(!(this.firstName === undefined || this.firstName === null || (typeof this.firstName === 'string' && String(this.firstName).trim() === '') || (Array.isArray(this.firstName) && this.firstName.length === 0) || (typeof this.firstName === 'object' && !Array.isArray(this.firstName) && Object.prototype.toString.call(this.firstName) === '[object Object]' && Object.keys(Object(this.firstName)).length === 0)) && !(this.lastName === undefined || this.lastName === null || (typeof this.lastName === 'string' && String(this.lastName).trim() === '') || (Array.isArray(this.lastName) && this.lastName.length === 0) || (typeof this.lastName === 'object' && !Array.isArray(this.lastName) && Object.prototype.toString.call(this.lastName) === '[object Object]' && Object.keys(Object(this.lastName)).length === 0)))) {
      throw new Error('HRMS_PERSON_001: Persona requiere firstName y lastName');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'person';
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
  static fromDto(dto: CreatePersonDto): Person;
  static fromDto(dto: UpdatePersonDto): Person;
  static fromDto(dto: DeletePersonDto): Person;
  static fromDto(dto: any): Person {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(Person, dto);
  }
}
