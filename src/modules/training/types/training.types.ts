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


import { ObjectType, Field } from "@nestjs/graphql";
import { GQResponseBase } from "src/common/types/common.types";
import { Training } from "../entities/training.entity";
import { ApiProperty } from "@nestjs/swagger";

@ObjectType({ description: "Respuesta de training" })
export class TrainingResponse<T extends Training> extends GQResponseBase {
  @ApiProperty({ type: Training,nullable:false,description:"Datos de respuesta de Training" })
  @Field(() => Training, { description: "Instancia de Training", nullable: true })
  data?: T;


}

@ObjectType({ description: "Respuesta de trainings" })
export class TrainingsResponse<T extends Training> extends GQResponseBase {
  @ApiProperty({ type: [Training],nullable:false,description:"Listado de Training",default:[] })
  @Field(() => [Training], { description: "Listado de Training", nullable: false,defaultValue:[] })
  data: T[] = [];

  @ApiProperty({ type: Number,nullable:false,description:"Cantidad de Training",default:0 })
  @Field(() => Number, { description: "Cantidad de Training", nullable: false,defaultValue:0 })
  count: number = 0;
}






