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
import { Employee } from "../entities/employee.entity";

//Definición de comandos
import {
  CreateEmployeeCommand,
  UpdateEmployeeCommand,
  DeleteEmployeeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { EmployeeQueryService } from "../services/employeequery.service";


import { EmployeeResponse, EmployeesResponse } from "../types/employee.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateEmployeeDto, 
CreateOrUpdateEmployeeDto, 
EmployeeValueInput, 
EmployeeDto, 
CreateEmployeeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => Employee)
export class EmployeeResolver {

   //Constructor del resolver de Employee
  constructor(
    private readonly service: EmployeeQueryService,
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
      .registerClient(EmployeeResolver.name)

      .get(EmployeeResolver.name),
    })
  // Mutaciones
  @Mutation(() => EmployeeResponse<Employee>)
  async createEmployee(
    @Args("input", { type: () => CreateEmployeeDto }) input: CreateEmployeeDto
  ): Promise<EmployeeResponse<Employee>> {
    return this.commandBus.execute(new CreateEmployeeCommand(input));
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
      .registerClient(EmployeeResolver.name)

      .get(EmployeeResolver.name),
    })
  @Mutation(() => EmployeeResponse<Employee>)
  async updateEmployee(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateEmployeeDto
  ): Promise<EmployeeResponse<Employee>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateEmployeeCommand(payLoad, {
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
      .registerClient(EmployeeResolver.name)

      .get(EmployeeResolver.name),
    })
  @Mutation(() => EmployeeResponse<Employee>)
  async createOrUpdateEmployee(
    @Args("data", { type: () => CreateOrUpdateEmployeeDto })
    data: CreateOrUpdateEmployeeDto
  ): Promise<EmployeeResponse<Employee>> {
    if (data.id) {
      const existingEmployee = await this.service.findById(data.id);
      if (existingEmployee) {
        return this.commandBus.execute(
          new UpdateEmployeeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateEmployeeDto | UpdateEmployeeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateEmployeeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateEmployeeDto | UpdateEmployeeDto).createdBy ||
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
      .registerClient(EmployeeResolver.name)

      .get(EmployeeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteEmployee(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteEmployeeCommand(id));
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
      .registerClient(EmployeeResolver.name)

      .get(EmployeeResolver.name),
    })
  // Queries
  @Query(() => EmployeesResponse<Employee>)
  async employees(
    options?: FindManyOptions<Employee>,
    paginationArgs?: PaginationArgs
  ): Promise<EmployeesResponse<Employee>> {
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
      .registerClient(EmployeeResolver.name)

      .get(EmployeeResolver.name),
    })
  @Query(() => EmployeesResponse<Employee>)
  async employee(
    @Args("id", { type: () => String }) id: string
  ): Promise<EmployeeResponse<Employee>> {
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
      .registerClient(EmployeeResolver.name)

      .get(EmployeeResolver.name),
    })
  @Query(() => EmployeesResponse<Employee>)
  async employeesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => EmployeeValueInput }) value: EmployeeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<EmployeesResponse<Employee>> {
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
      .registerClient(EmployeeResolver.name)

      .get(EmployeeResolver.name),
    })
  @Query(() => EmployeesResponse<Employee>)
  async employeesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<EmployeesResponse<Employee>> {
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
      .registerClient(EmployeeResolver.name)

      .get(EmployeeResolver.name),
    })
  @Query(() => Number)
  async totalEmployees(): Promise<number> {
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
      .registerClient(EmployeeResolver.name)

      .get(EmployeeResolver.name),
    })
  @Query(() => EmployeesResponse<Employee>)
  async searchEmployees(
    @Args("where", { type: () => EmployeeDto, nullable: false })
    where: Record<string, any>
  ): Promise<EmployeesResponse<Employee>> {
    const employees = await this.service.findAndCount(where);
    return employees;
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
      .registerClient(EmployeeResolver.name)

      .get(EmployeeResolver.name),
    })
  @Query(() => EmployeeResponse<Employee>, { nullable: true })
  async findOneEmployee(
    @Args("where", { type: () => EmployeeDto, nullable: false })
    where: Record<string, any>
  ): Promise<EmployeeResponse<Employee>> {
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
      .registerClient(EmployeeResolver.name)

      .get(EmployeeResolver.name),
    })
  @Query(() => EmployeeResponse<Employee>)
  async findOneEmployeeOrFail(
    @Args("where", { type: () => EmployeeDto, nullable: false })
    where: Record<string, any>
  ): Promise<EmployeeResponse<Employee> | Error> {
    return this.service.findOneOrFail(where);
  }
}

