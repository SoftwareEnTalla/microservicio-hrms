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


import { UpdateScopeTypeDto } from '../dtos/all-dto';
import { ScopeType } from '../entities/scope-type.entity';
import { BaseEvent, PayloadEvent } from './base.event'; 
import { v4 as uuidv4 } from "uuid";

export class ScopeTypeUpdatedEvent extends BaseEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly payload: PayloadEvent<UpdateScopeTypeDto|ScopeType>
  ) {
    super(aggregateId);
  }

  
         // Método estático para construcción consistente del evento
        static create(
          instanceId: string,
          instance: UpdateScopeTypeDto|ScopeType,
          userId: string,
          correlationId?: string
        ): ScopeTypeUpdatedEvent {
          return new ScopeTypeUpdatedEvent(instanceId, {
            instance: instance,
            metadata: {
              initiatedBy: userId,
              correlationId:correlationId || uuidv4(),
            },
          });
        }
        

}
