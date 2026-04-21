---
to: test-src/modules/<%= h.changeCase.param(name) %>/application/usecases/create-<%= h.changeCase.kebabCase(name) %>.usecase.spec.ts
---
<% 
Name = h.changeCase.pascal(name) 
Lname = h.changeCase.camel(name)
kname = h.changeCase.kebabCase(name)
IdName = Name + 'IdVo'
LIdName = kname + '-vos'  
-%>
import { Create<%= Name %>UseCase } from './create-<%= Lname %>.usecase';
import { I<%= Name %>Repository } from '../../domain/<%= Lname %>.entity';

describe('Create<%= Name %>UseCase', () => {
  let useCase: Create<%= Name %>UseCase;
  let repository: I<%= Name %>Repository;

  beforeEach(() => {
    // Mock simple del repositorio
    repository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    } as any;
    
    useCase = new Create<%= Name %>UseCase(repository);
  });

  it('debería orquestar la creación y persistencia de un <%= Lname %>', async () => {
    const dto = { name: 'Juan', email: 'juan@mail.com' };
    
    // Aquí es donde arreglamos el boilerplate vacío de tu código [cite: 168]
    await useCase.execute(dto);

    expect(repository.save).toHaveBeenCalled();
  });
});