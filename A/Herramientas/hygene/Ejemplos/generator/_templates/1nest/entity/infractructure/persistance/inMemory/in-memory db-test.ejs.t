---
to: test-src/modules/<%= h.changeCase.param(name) %>/infrastructure/persistence/in-memory/<%= h.changeCase.kebabCase(name) %>-repository.spec.ts
---
<% 
  const Name = h.changeCase.pascal(name)
  const Lname = h.changeCase.camel(name)
  const kname = h.changeCase.kebabCase(name)
  const Plural = h.changeCase.camel(plural)
  const list = typeof voList === 'string' ? voList.split(',').map(v => v.trim()) : (voList || []);  
  
  // Usamos el primer VO de la lista para los tests de actualización/ejemplo
  const firstVoName = list.length > 0 ? h.changeCase.pascal(list[0]) : 'Email';
  const firstVoClass = Name + firstVoName;
-%>
import { InMemory<%= Name %>Repository } from './<%= Lname %>-repository';
import { <%= Name %>,<%= Name %>Props } from '../../../domain/<%= Lname %>.entity';
import { <%= Name %>IdVo,<% if(addVO && list.length > 0){ -%><% list.forEach(vo => { -%><%= Name %><%= h.changeCase.pascal(vo) %>,<% }) -%><% } -%> } from '../../../domain/value-objects/<%= Lname %>-vos';

describe('InMemory<%= Name %>Repository', () => {
  let repository: InMemory<%= Name %>Repository;

  beforeEach(() => {
    repository = new InMemory<%= Name %>Repository();
  });

  // Función helper dinámica para crear una entidad con todos sus VOs
const createStub<%= Name %> = (idString: string, firstVoValue: string = 'test-value') => {
    const props: <%= Name %>Props = {
      id : <%= Name %>IdVo.create(idString),
      createdAt: new Date(),
<% list.forEach((vo, index) => { -%>
      <%= h.changeCase.camel(vo) %>: <%= Name %><%= h.changeCase.pascal(vo) %>.create(<%- index === 0 ? 'firstVoValue' : `'test-${h.changeCase.param(vo)}'` %>),
<% }) -%>
    };
    return <%= Name %>.create(props);
  };

  it('debería guardar y encontrar un <%= Lname %> por su ID', async () => {
    const entity = createStub<%= Name %>('id-1');
    await repository.save(entity);
    const result = await repository.findById(entity.id);

    expect(result).not.toBeNull();
    expect(result?.id.getValue()).toBe('id-1');
  });

  it('debería retornar null si el <%= Lname %> no existe', async () => {
    const idInexistente = <%= Name %>IdVo.create('no-existe');
    const result = await repository.findById(idInexistente);
    expect(result).toBeNull();
  });

  it('debería retornar todos los <%= Plural %> guardados', async () => {
    await repository.save(createStub<%= Name %>('id-1'));
    await repository.save(createStub<%= Name %>('id-2'));

    const all = await repository.findAll();
    expect(all).toHaveLength(2);
  });

  it('debería actualizar un <%= Lname %> existente', async () => {
    // Arrange
    const entity = createStub<%= Name %>('id-1', 'original-value');
    await repository.save(entity);

    // Act: Modificamos el primer Value Object de la lista
    const updatedProps = { 
      ...entity.props, 
      <%= h.changeCase.camel(list[0]) %>: <%= Name %><%= firstVoName %>.create('updated-value') 
    };
    const entityActualizada = <%= Name %>.create(updatedProps, entity.id);
    await repository.update(entityActualizada);

    // Assert
    const result = await repository.findById(entity.id);
    expect(result?.props.<%= h.changeCase.camel(list[0]) %>.getValue()).toBe('updated-value');
  });

  it('debería eliminar un <%= Lname %> correctamente', async () => {
    const entity = createStub<%= Name %>('id-delete');
    await repository.save(entity);

    await repository.delete(entity.id);

    const result = await repository.findById(entity.id);
    expect(result).toBeNull();
  });
});