---
to: test-src/modules/<%= h.changeCase.param(name) %>/infrastructure/persistence/in-memory/<%= h.changeCase.kebabCase(name) %>-repository.ts
---
<% 
  const Name = h.changeCase.pascal(name)
  const Lname = h.changeCase.camel(name)
  const kname = h.changeCase.kebabCase(name)
  const IdName = Name + 'IdVo' 
  const Plural = h.changeCase.camel(plural)
-%>
import { <%= Name %>, I<%= Name %>Repository  } from '../../../domain/<%= kname %>.entity';
import { <%= Name %>IdVo } from '../../../domain/value-objects/<%= kname %>-vos';
import { <%= Name %>Mapper } from '../<%= Name %>.mapper'; //

export class InMemory<%= Name %>Repository implements I<%= Name %>Repository {
  // Ahora guardamos objetos planos (persistence models) en lugar de la entidad directamente
  private <%= Plural %>: any[] = []; //

  async save(<%= Lname %>: <%= Name %>): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    
    // Usamos el Mapper para convertir la Entidad a un formato de persistencia
    const persistenceModel = <%= Name %>Mapper.toPersistence(<%= Lname %>); //
    
    const index = this.<%= Plural %>.findIndex((p) => p.id === persistenceModel.id);
    if (index !== -1) {
      this.<%= Plural %>[index] = persistenceModel;
    } else {
      this.<%= Plural %>.push(persistenceModel);
    }
  }

  async create(<%= Lname %>: <%= Name %>): Promise< <%= Name %>> {
    await this.save(<%= Lname %>);
    return <%= Lname %>;
  }

  async findAll(): Promise< <%= Name %>[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    // Mapeamos cada registro de vuelta a una Entidad de Dominio
    return this.<%= Plural %>.map(record => <%= Name %>Mapper.toDomain(record)); //
  }

  async findById(id: <%= Name %>IdVo): Promise< <%= Name %> | null> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const record = this.<%= Plural %>.find((p) => p.id === id.getValue());
    
    if (!record) return null;
    
    // Reconstruimos la entidad rica usando el Mapper
    return <%= Name %>Mapper.toDomain(record); //
  }

  async update(<%= Lname %>: <%= Name %>): Promise< <%= Name %>> {
    await this.save(<%= Lname %>);
    return <%= Lname %>;
  }

  async delete(id: <%= Name %>IdVo): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    this.<%= Plural %> = this.<%= Plural %>.filter((p) => p.id !== id.getValue());
  }
}