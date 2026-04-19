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
import { Reports } from "../entities/reports.entity";

//Definición de comandos
import {
  CreateReportsCommand,
  UpdateReportsCommand,
  DeleteReportsCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { ReportsQueryService } from "../services/reportsquery.service";


import { ReportsResponse, ReportssResponse } from "../types/reports.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateReportsDto, 
CreateOrUpdateReportsDto, 
ReportsValueInput, 
ReportsDto, 
CreateReportsDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => Reports)
export class ReportsResolver {

   //Constructor del resolver de Reports
  constructor(
    private readonly service: ReportsQueryService,
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
      .registerClient(ReportsResolver.name)

      .get(ReportsResolver.name),
    })
  // Mutaciones
  @Mutation(() => ReportsResponse<Reports>)
  async createReports(
    @Args("input", { type: () => CreateReportsDto }) input: CreateReportsDto
  ): Promise<ReportsResponse<Reports>> {
    return this.commandBus.execute(new CreateReportsCommand(input));
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
      .registerClient(ReportsResolver.name)

      .get(ReportsResolver.name),
    })
  @Mutation(() => ReportsResponse<Reports>)
  async updateReports(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateReportsDto
  ): Promise<ReportsResponse<Reports>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateReportsCommand(payLoad, {
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
      .registerClient(ReportsResolver.name)

      .get(ReportsResolver.name),
    })
  @Mutation(() => ReportsResponse<Reports>)
  async createOrUpdateReports(
    @Args("data", { type: () => CreateOrUpdateReportsDto })
    data: CreateOrUpdateReportsDto
  ): Promise<ReportsResponse<Reports>> {
    if (data.id) {
      const existingReports = await this.service.findById(data.id);
      if (existingReports) {
        return this.commandBus.execute(
          new UpdateReportsCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateReportsDto | UpdateReportsDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateReportsCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateReportsDto | UpdateReportsDto).createdBy ||
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
      .registerClient(ReportsResolver.name)

      .get(ReportsResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteReports(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteReportsCommand(id));
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
      .registerClient(ReportsResolver.name)

      .get(ReportsResolver.name),
    })
  // Queries
  @Query(() => ReportssResponse<Reports>)
  async reportss(
    options?: FindManyOptions<Reports>,
    paginationArgs?: PaginationArgs
  ): Promise<ReportssResponse<Reports>> {
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
      .registerClient(ReportsResolver.name)

      .get(ReportsResolver.name),
    })
  @Query(() => ReportssResponse<Reports>)
  async reports(
    @Args("id", { type: () => String }) id: string
  ): Promise<ReportsResponse<Reports>> {
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
      .registerClient(ReportsResolver.name)

      .get(ReportsResolver.name),
    })
  @Query(() => ReportssResponse<Reports>)
  async reportssByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ReportsValueInput }) value: ReportsValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ReportssResponse<Reports>> {
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
      .registerClient(ReportsResolver.name)

      .get(ReportsResolver.name),
    })
  @Query(() => ReportssResponse<Reports>)
  async reportssWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ReportssResponse<Reports>> {
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
      .registerClient(ReportsResolver.name)

      .get(ReportsResolver.name),
    })
  @Query(() => Number)
  async totalReportss(): Promise<number> {
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
      .registerClient(ReportsResolver.name)

      .get(ReportsResolver.name),
    })
  @Query(() => ReportssResponse<Reports>)
  async searchReportss(
    @Args("where", { type: () => ReportsDto, nullable: false })
    where: Record<string, any>
  ): Promise<ReportssResponse<Reports>> {
    const reportss = await this.service.findAndCount(where);
    return reportss;
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
      .registerClient(ReportsResolver.name)

      .get(ReportsResolver.name),
    })
  @Query(() => ReportsResponse<Reports>, { nullable: true })
  async findOneReports(
    @Args("where", { type: () => ReportsDto, nullable: false })
    where: Record<string, any>
  ): Promise<ReportsResponse<Reports>> {
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
      .registerClient(ReportsResolver.name)

      .get(ReportsResolver.name),
    })
  @Query(() => ReportsResponse<Reports>)
  async findOneReportsOrFail(
    @Args("where", { type: () => ReportsDto, nullable: false })
    where: Record<string, any>
  ): Promise<ReportsResponse<Reports> | Error> {
    return this.service.findOneOrFail(where);
  }
}

