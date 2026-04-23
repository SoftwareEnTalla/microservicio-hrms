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
import { Payroll } from "../entities/payroll.entity";

//Definición de comandos
import {
  CreatePayrollCommand,
  UpdatePayrollCommand,
  DeletePayrollCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { PayrollQueryService } from "../services/payrollquery.service";


import { PayrollResponse, PayrollsResponse } from "../types/payroll.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdatePayrollDto, 
CreateOrUpdatePayrollDto, 
PayrollValueInput, 
PayrollDto, 
CreatePayrollDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => Payroll)
export class PayrollResolver {

   //Constructor del resolver de Payroll
  constructor(
    private readonly service: PayrollQueryService,
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
      .registerClient(PayrollResolver.name)

      .get(PayrollResolver.name),
    })
  // Mutaciones
  @Mutation(() => PayrollResponse<Payroll>)
  async createPayroll(
    @Args("input", { type: () => CreatePayrollDto }) input: CreatePayrollDto
  ): Promise<PayrollResponse<Payroll>> {
    return this.commandBus.execute(new CreatePayrollCommand(input));
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
      .registerClient(PayrollResolver.name)

      .get(PayrollResolver.name),
    })
  @Mutation(() => PayrollResponse<Payroll>)
  async updatePayroll(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePayrollDto
  ): Promise<PayrollResponse<Payroll>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdatePayrollCommand(payLoad, {
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
      .registerClient(PayrollResolver.name)

      .get(PayrollResolver.name),
    })
  @Mutation(() => PayrollResponse<Payroll>)
  async createOrUpdatePayroll(
    @Args("data", { type: () => CreateOrUpdatePayrollDto })
    data: CreateOrUpdatePayrollDto
  ): Promise<PayrollResponse<Payroll>> {
    if (data.id) {
      const existingPayroll = await this.service.findById(data.id);
      if (existingPayroll) {
        return this.commandBus.execute(
          new UpdatePayrollCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreatePayrollDto | UpdatePayrollDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreatePayrollCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreatePayrollDto | UpdatePayrollDto).createdBy ||
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
      .registerClient(PayrollResolver.name)

      .get(PayrollResolver.name),
    })
  @Mutation(() => Boolean)
  async deletePayroll(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePayrollCommand(id));
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
      .registerClient(PayrollResolver.name)

      .get(PayrollResolver.name),
    })
  // Queries
  @Query(() => PayrollsResponse<Payroll>)
  async payrolls(
    options?: FindManyOptions<Payroll>,
    paginationArgs?: PaginationArgs
  ): Promise<PayrollsResponse<Payroll>> {
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
      .registerClient(PayrollResolver.name)

      .get(PayrollResolver.name),
    })
  @Query(() => PayrollsResponse<Payroll>)
  async payroll(
    @Args("id", { type: () => String }) id: string
  ): Promise<PayrollResponse<Payroll>> {
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
      .registerClient(PayrollResolver.name)

      .get(PayrollResolver.name),
    })
  @Query(() => PayrollsResponse<Payroll>)
  async payrollsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PayrollValueInput }) value: PayrollValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PayrollsResponse<Payroll>> {
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
      .registerClient(PayrollResolver.name)

      .get(PayrollResolver.name),
    })
  @Query(() => PayrollsResponse<Payroll>)
  async payrollsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PayrollsResponse<Payroll>> {
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
      .registerClient(PayrollResolver.name)

      .get(PayrollResolver.name),
    })
  @Query(() => Number)
  async totalPayrolls(): Promise<number> {
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
      .registerClient(PayrollResolver.name)

      .get(PayrollResolver.name),
    })
  @Query(() => PayrollsResponse<Payroll>)
  async searchPayrolls(
    @Args("where", { type: () => PayrollDto, nullable: false })
    where: Record<string, any>
  ): Promise<PayrollsResponse<Payroll>> {
    const payrolls = await this.service.findAndCount(where);
    return payrolls;
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
      .registerClient(PayrollResolver.name)

      .get(PayrollResolver.name),
    })
  @Query(() => PayrollResponse<Payroll>, { nullable: true })
  async findOnePayroll(
    @Args("where", { type: () => PayrollDto, nullable: false })
    where: Record<string, any>
  ): Promise<PayrollResponse<Payroll>> {
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
      .registerClient(PayrollResolver.name)

      .get(PayrollResolver.name),
    })
  @Query(() => PayrollResponse<Payroll>)
  async findOnePayrollOrFail(
    @Args("where", { type: () => PayrollDto, nullable: false })
    where: Record<string, any>
  ): Promise<PayrollResponse<Payroll> | Error> {
    return this.service.findOneOrFail(where);
  }
}

