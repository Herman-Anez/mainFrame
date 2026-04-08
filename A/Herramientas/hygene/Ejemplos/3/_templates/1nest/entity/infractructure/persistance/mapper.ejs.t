---
to: test-src/modules/<%= h.changeCase.param(name) %>/infrastructure/persistence/in-memory/<%= h.changeCase.pascal(name) %>.mapper.ts
---
<% 
  const Name = h.changeCase.pascal(name)
  const kname = h.changeCase.param(name)
    const list = typeof voList === 'string' ? voList.split(',').map(v => v.trim()) : (voList || []);  
-%>
import { <%= Name %> } from '../../domain/<%= Name %>.entity';
import { <%= IdName %>, <% if(addVO && list.length > 0){ -%><% list.forEach(vo => { -%><%= Name %><%= h.changeCase.pascal(vo) %>,<% }) -%><% } -%> } from './value-objects/<%= LIdName %>';
// Importar aquí el resto de tus VOs

export class <%= Name %>Mapper {
  
  /**
   * Transforma la Entidad de Dominio a un objeto plano para la Base de Datos
   */
  static toPersistence(entity: <%= Name %>): any {
    return {
      id: entity.id.getValue(),
      // Aquí mapeas las props a columnas de DB
      createdAt: entity.props.createdAt,
      // ejemplo: email: entity.props.email.getValue(),
    };
  }

  /**
   * Transforma el registro de la Base de Datos a una Entidad de Dominio
   */
  static toDomain(record: any): <%= Name %> {
    const id = <%= Name %>IdVo.create(record.id);
    
    // Aquí reconstruyes la entidad con sus VOs
    return <%= Name %>.create({
      createdAt: record.createdAt,
      // ejemplo: email: ClienteEmail.create(record.email),
    }, id);
  }
}