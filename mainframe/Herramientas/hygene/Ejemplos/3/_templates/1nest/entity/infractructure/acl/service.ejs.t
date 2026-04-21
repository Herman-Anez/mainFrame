---
to: test-src/modules/<%= h.changeCase.param(name) %>/infrastructure/acl/external-module-acl.service.ts
---
import { Injectable } from '@nestjs/common';
import { IExternalModuleService } from '../../domain/services/i-external-module.service';
import { ExternalModuleMapper } from './external-module.mapper';
// Importa el servicio del otro modulo aquí
// import { ExternalModuleInternalService } from '../../../external-module/application/services/...';

@Injectable()
export class ExternalModuleAclService implements IExternalModuleService {
  constructor(
    // private readonly externalService: ExternalModuleInternalService 
  ) {}

  async check(id: string): Promise<boolean> {
    const externalId = ExternalModuleMapper.toExternal(id);
    
    // Llamada al otro modulo
    // const result = await this.externalService.findOne(externalId);
    
    return ExternalModuleMapper.toDomain(true);
  }
}