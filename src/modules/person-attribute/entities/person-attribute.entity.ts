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
import { CreatePersonAttributeDto, UpdatePersonAttributeDto, DeletePersonAttributeDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_person_attr_key', ['attributeKey'])
@Index('idx_person_attr_person', ['personId', 'attributeKey'])
@Unique('uq_person_attr_value', ['personId', 'attributeKey'])
@ChildEntity('personattribute')
@ObjectType()
export class PersonAttribute extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de PersonAttribute",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de PersonAttribute", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia PersonAttribute' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de PersonAttribute",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de PersonAttribute", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia PersonAttribute' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Clave del atributo',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Clave del atributo', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 120, comment: 'Clave del atributo' })
  attributeKey!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Nombre visible',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Nombre visible', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 180, comment: 'Nombre visible' })
  displayName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'STRING', comment: 'Tipo' })
  dataType!: string;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Obligatorio',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Obligatorio', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Obligatorio' })
  isRequired!: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Contiene PII sensible (cifrado)',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Contiene PII sensible (cifrado)', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Contiene PII sensible (cifrado)' })
  isSensitive!: boolean;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Valores permitidos si enum',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Valores permitidos si enum', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Valores permitidos si enum' })
  enumValues?: Record<string, any> = {};

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Ámbito',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Ámbito', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'PERSON', comment: 'Ámbito' })
  scope!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Persona portadora del valor (null si es solo definición)',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Persona portadora del valor (null si es solo definición)', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Persona portadora del valor (null si es solo definición)' })
  personId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Valor string',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Valor string', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 500, comment: 'Valor string' })
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
    type: () => Object,
    nullable: true,
    description: 'Valor JSON/estructurado',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Valor JSON/estructurado', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Valor JSON/estructurado' })
  jsonValue?: Record<string, any> = {};

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
    // Rule: person-attr-key-required
    // El atributo requiere clave.
    if (!(!(this.attributeKey === undefined || this.attributeKey === null || (typeof this.attributeKey === 'string' && String(this.attributeKey).trim() === '') || (Array.isArray(this.attributeKey) && this.attributeKey.length === 0) || (typeof this.attributeKey === 'object' && !Array.isArray(this.attributeKey) && Object.prototype.toString.call(this.attributeKey) === '[object Object]' && Object.keys(Object(this.attributeKey)).length === 0)))) {
      throw new Error('HRMS_PA_001: attributeKey requerido');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'personattribute';
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
  static fromDto(dto: CreatePersonAttributeDto): PersonAttribute;
  static fromDto(dto: UpdatePersonAttributeDto): PersonAttribute;
  static fromDto(dto: DeletePersonAttributeDto): PersonAttribute;
  static fromDto(dto: any): PersonAttribute {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(PersonAttribute, dto);
  }
}
