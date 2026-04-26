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


import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";

//Definición de entidades
import { ReportsCategory } from "../entities/reports-category.entity";

//Definición de comandos
import {
  CreateReportsCategoryCommand,
  UpdateReportsCategoryCommand,
  DeleteReportsCategoryCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { ReportsCategoryQueryService } from "../services/reportscategoryquery.service";


import { ReportsCategoryResponse, ReportsCategorysResponse } from "../types/reportscategory.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateReportsCategoryDto, 
CreateOrUpdateReportsCategoryDto, 
ReportsCategoryValueInput, 
ReportsCategoryDto, 
CreateReportsCategoryDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ReportsCategory)
export class ReportsCategoryResolver {

   //Constructor del resolver de ReportsCategory
  constructor(
    private readonly service: ReportsCategoryQueryService,
    private readonly commandBus: CommandBus
  ) {}

  @LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ReportsCategoryResolver.name)

      .get(ReportsCategoryResolver.name),
    })
  // Mutaciones
  @Mutation(() => ReportsCategoryResponse<ReportsCategory>)
  async createReportsCategory(
    @Args("input", { type: () => CreateReportsCategoryDto }) input: CreateReportsCategoryDto
  ): Promise<ReportsCategoryResponse<ReportsCategory>> {
    return this.commandBus.execute(new CreateReportsCategoryCommand(input));
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ReportsCategoryResolver.name)

      .get(ReportsCategoryResolver.name),
    })
  @Mutation(() => ReportsCategoryResponse<ReportsCategory>)
  async updateReportsCategory(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateReportsCategoryDto
  ): Promise<ReportsCategoryResponse<ReportsCategory>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateReportsCategoryCommand(payLoad, {
        instance: payLoad,
        metadata: {
          initiatedBy: payLoad.createdBy || 'system',
          correlationId: payLoad.id,
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ReportsCategoryResolver.name)

      .get(ReportsCategoryResolver.name),
    })
  @Mutation(() => ReportsCategoryResponse<ReportsCategory>)
  async createOrUpdateReportsCategory(
    @Args("data", { type: () => CreateOrUpdateReportsCategoryDto })
    data: CreateOrUpdateReportsCategoryDto
  ): Promise<ReportsCategoryResponse<ReportsCategory>> {
    if (data.id) {
      const existingReportsCategory = await this.service.findById(data.id);
      if (existingReportsCategory) {
        return this.commandBus.execute(
          new UpdateReportsCategoryCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateReportsCategoryDto | UpdateReportsCategoryDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateReportsCategoryCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateReportsCategoryDto | UpdateReportsCategoryDto).createdBy ||
            'system',
          correlationId: data.id || uuidv4(),
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ReportsCategoryResolver.name)

      .get(ReportsCategoryResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteReportsCategory(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteReportsCategoryCommand(id));
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ReportsCategoryResolver.name)

      .get(ReportsCategoryResolver.name),
    })
  // Queries
  @Query(() => ReportsCategorysResponse<ReportsCategory>)
  async reportscategorys(
    options?: FindManyOptions<ReportsCategory>,
    paginationArgs?: PaginationArgs
  ): Promise<ReportsCategorysResponse<ReportsCategory>> {
    return this.service.findAll(options, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ReportsCategoryResolver.name)

      .get(ReportsCategoryResolver.name),
    })
  @Query(() => ReportsCategorysResponse<ReportsCategory>)
  async reportscategory(
    @Args("id", { type: () => String }) id: string
  ): Promise<ReportsCategoryResponse<ReportsCategory>> {
    return this.service.findById(id);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ReportsCategoryResolver.name)

      .get(ReportsCategoryResolver.name),
    })
  @Query(() => ReportsCategorysResponse<ReportsCategory>)
  async reportscategorysByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ReportsCategoryValueInput }) value: ReportsCategoryValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ReportsCategorysResponse<ReportsCategory>> {
    return this.service.findByField(
      field,
      value,
      fromObject.call(PaginationArgs, { page: page, limit: limit })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ReportsCategoryResolver.name)

      .get(ReportsCategoryResolver.name),
    })
  @Query(() => ReportsCategorysResponse<ReportsCategory>)
  async reportscategorysWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ReportsCategorysResponse<ReportsCategory>> {
    const paginationArgs = fromObject.call(PaginationArgs, {
      page: page,
      limit: limit,
    });
    return this.service.findWithPagination({}, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ReportsCategoryResolver.name)

      .get(ReportsCategoryResolver.name),
    })
  @Query(() => Number)
  async totalReportsCategorys(): Promise<number> {
    return this.service.count();
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ReportsCategoryResolver.name)

      .get(ReportsCategoryResolver.name),
    })
  @Query(() => ReportsCategorysResponse<ReportsCategory>)
  async searchReportsCategorys(
    @Args("where", { type: () => ReportsCategoryDto, nullable: false })
    where: Record<string, any>
  ): Promise<ReportsCategorysResponse<ReportsCategory>> {
    const reportscategorys = await this.service.findAndCount(where);
    return reportscategorys;
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ReportsCategoryResolver.name)

      .get(ReportsCategoryResolver.name),
    })
  @Query(() => ReportsCategoryResponse<ReportsCategory>, { nullable: true })
  async findOneReportsCategory(
    @Args("where", { type: () => ReportsCategoryDto, nullable: false })
    where: Record<string, any>
  ): Promise<ReportsCategoryResponse<ReportsCategory>> {
    return this.service.findOne(where);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ReportsCategoryResolver.name)

      .get(ReportsCategoryResolver.name),
    })
  @Query(() => ReportsCategoryResponse<ReportsCategory>)
  async findOneReportsCategoryOrFail(
    @Args("where", { type: () => ReportsCategoryDto, nullable: false })
    where: Record<string, any>
  ): Promise<ReportsCategoryResponse<ReportsCategory> | Error> {
    return this.service.findOneOrFail(where);
  }
}

