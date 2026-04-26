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
import { PayrollCycleStatus } from "../entities/payroll-cycle-status.entity";

//Definición de comandos
import {
  CreatePayrollCycleStatusCommand,
  UpdatePayrollCycleStatusCommand,
  DeletePayrollCycleStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { PayrollCycleStatusQueryService } from "../services/payrollcyclestatusquery.service";


import { PayrollCycleStatusResponse, PayrollCycleStatussResponse } from "../types/payrollcyclestatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdatePayrollCycleStatusDto, 
CreateOrUpdatePayrollCycleStatusDto, 
PayrollCycleStatusValueInput, 
PayrollCycleStatusDto, 
CreatePayrollCycleStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => PayrollCycleStatus)
export class PayrollCycleStatusResolver {

   //Constructor del resolver de PayrollCycleStatus
  constructor(
    private readonly service: PayrollCycleStatusQueryService,
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
      .registerClient(PayrollCycleStatusResolver.name)

      .get(PayrollCycleStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => PayrollCycleStatusResponse<PayrollCycleStatus>)
  async createPayrollCycleStatus(
    @Args("input", { type: () => CreatePayrollCycleStatusDto }) input: CreatePayrollCycleStatusDto
  ): Promise<PayrollCycleStatusResponse<PayrollCycleStatus>> {
    return this.commandBus.execute(new CreatePayrollCycleStatusCommand(input));
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
      .registerClient(PayrollCycleStatusResolver.name)

      .get(PayrollCycleStatusResolver.name),
    })
  @Mutation(() => PayrollCycleStatusResponse<PayrollCycleStatus>)
  async updatePayrollCycleStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePayrollCycleStatusDto
  ): Promise<PayrollCycleStatusResponse<PayrollCycleStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdatePayrollCycleStatusCommand(payLoad, {
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
      .registerClient(PayrollCycleStatusResolver.name)

      .get(PayrollCycleStatusResolver.name),
    })
  @Mutation(() => PayrollCycleStatusResponse<PayrollCycleStatus>)
  async createOrUpdatePayrollCycleStatus(
    @Args("data", { type: () => CreateOrUpdatePayrollCycleStatusDto })
    data: CreateOrUpdatePayrollCycleStatusDto
  ): Promise<PayrollCycleStatusResponse<PayrollCycleStatus>> {
    if (data.id) {
      const existingPayrollCycleStatus = await this.service.findById(data.id);
      if (existingPayrollCycleStatus) {
        return this.commandBus.execute(
          new UpdatePayrollCycleStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreatePayrollCycleStatusDto | UpdatePayrollCycleStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreatePayrollCycleStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreatePayrollCycleStatusDto | UpdatePayrollCycleStatusDto).createdBy ||
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
      .registerClient(PayrollCycleStatusResolver.name)

      .get(PayrollCycleStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deletePayrollCycleStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePayrollCycleStatusCommand(id));
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
      .registerClient(PayrollCycleStatusResolver.name)

      .get(PayrollCycleStatusResolver.name),
    })
  // Queries
  @Query(() => PayrollCycleStatussResponse<PayrollCycleStatus>)
  async payrollcyclestatuss(
    options?: FindManyOptions<PayrollCycleStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<PayrollCycleStatussResponse<PayrollCycleStatus>> {
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
      .registerClient(PayrollCycleStatusResolver.name)

      .get(PayrollCycleStatusResolver.name),
    })
  @Query(() => PayrollCycleStatussResponse<PayrollCycleStatus>)
  async payrollcyclestatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<PayrollCycleStatusResponse<PayrollCycleStatus>> {
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
      .registerClient(PayrollCycleStatusResolver.name)

      .get(PayrollCycleStatusResolver.name),
    })
  @Query(() => PayrollCycleStatussResponse<PayrollCycleStatus>)
  async payrollcyclestatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PayrollCycleStatusValueInput }) value: PayrollCycleStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PayrollCycleStatussResponse<PayrollCycleStatus>> {
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
      .registerClient(PayrollCycleStatusResolver.name)

      .get(PayrollCycleStatusResolver.name),
    })
  @Query(() => PayrollCycleStatussResponse<PayrollCycleStatus>)
  async payrollcyclestatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PayrollCycleStatussResponse<PayrollCycleStatus>> {
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
      .registerClient(PayrollCycleStatusResolver.name)

      .get(PayrollCycleStatusResolver.name),
    })
  @Query(() => Number)
  async totalPayrollCycleStatuss(): Promise<number> {
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
      .registerClient(PayrollCycleStatusResolver.name)

      .get(PayrollCycleStatusResolver.name),
    })
  @Query(() => PayrollCycleStatussResponse<PayrollCycleStatus>)
  async searchPayrollCycleStatuss(
    @Args("where", { type: () => PayrollCycleStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<PayrollCycleStatussResponse<PayrollCycleStatus>> {
    const payrollcyclestatuss = await this.service.findAndCount(where);
    return payrollcyclestatuss;
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
      .registerClient(PayrollCycleStatusResolver.name)

      .get(PayrollCycleStatusResolver.name),
    })
  @Query(() => PayrollCycleStatusResponse<PayrollCycleStatus>, { nullable: true })
  async findOnePayrollCycleStatus(
    @Args("where", { type: () => PayrollCycleStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<PayrollCycleStatusResponse<PayrollCycleStatus>> {
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
      .registerClient(PayrollCycleStatusResolver.name)

      .get(PayrollCycleStatusResolver.name),
    })
  @Query(() => PayrollCycleStatusResponse<PayrollCycleStatus>)
  async findOnePayrollCycleStatusOrFail(
    @Args("where", { type: () => PayrollCycleStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<PayrollCycleStatusResponse<PayrollCycleStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

