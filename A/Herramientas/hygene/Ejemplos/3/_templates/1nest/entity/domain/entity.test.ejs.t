---
to: test-src/modules/<%= h.changeCase.param(name) %>/domain/<%= h.changeCase.kebabCase(name) %>.entity.spect.ts
---
<% 
  const Name = h.changeCase.pascal(name)
  const Lname = h.changeCase.camel(name)
  kname = h.changeCase.kebabCase(name)
  const IdName = Name + 'IdVo' 
  const LIdName = kname + '-vos' 
  
-%>
import {  <%= Name %> } from './<%= Lname %>.entity';
import {  <%= Name %>IdVo } from './value-objects/<%= Lname %>-vos';

describe(' <%= Name %> Entity', () => {
  it('debería crear un  <%= Lname %> válido y registrar el evento  <%= Name %>CreatedEvent', () => {
    const id =  <%= Name %>IdVo.create('123-abc');
    /*Agregar otros atributos necesarios*/
    
    const  <%= Lname %> =  <%= Name %>.create({
    /*Agregar otros atributos necesarios*/
    }, id);

    expect( <%= Lname %>.id.getValue()).toBe('123-abc');
    // Verificamos que el evento se grabó en la lista interna [cite: 21, 133]
    expect( <%= Lname %>.pullDomainEvents()).toHaveLength(1); 
  });

  it('debería lanzar error si el id no es valido', () => {
    expect(() => {
       <%= Name %>IdVo.create('no'); // El VO tiene validación de longitud [cite: 100]
    }).toThrow();
  });
});