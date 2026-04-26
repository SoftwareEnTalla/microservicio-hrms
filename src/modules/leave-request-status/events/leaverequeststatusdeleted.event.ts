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


import { DeleteLeaveRequestStatusDto } from '../dtos/all-dto';
import { LeaveRequestStatus } from '../entities/leave-request-status.entity';
import { BaseEvent, PayloadEvent } from './base.event'; 
import { v4 as uuidv4 } from "uuid";

export class LeaveRequestStatusDeletedEvent extends BaseEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly payload: PayloadEvent<DeleteLeaveRequestStatusDto|LeaveRequestStatus>
  ) {
    super(aggregateId);
  }

  
         // Método estático para construcción consistente del evento
        static create(
          instanceId: string,
          instance: DeleteLeaveRequestStatusDto|LeaveRequestStatus,
          userId: string,
          correlationId?: string
        ): LeaveRequestStatusDeletedEvent {
          return new LeaveRequestStatusDeletedEvent(instanceId, {
            instance: instance,
            metadata: {
              initiatedBy: userId,
              correlationId:correlationId || uuidv4(),
            },
          });
        }
        

}
