---
to: "<%= targetPath %>/modules/<%= h.changeCase.param(moduleName) %>/interfaces/http/<%= h.changeCase.pascal(name) %>Controller.ts"
---
<% 
  const Name = h.changeCase.pascal(name)
  const VarName = h.changeCase.camel(name)
-%>
<% if (addUseCases) { -%>
import { Create<%= Name %>UseCase } from '../../application/use-cases/Create<%= Name %>';
import { Get<%= Name %>ByIdUseCase } from '../../application/use-cases/Get<%= Name %>ById';
import { GetAll<%= Name %>sUseCase } from '../../application/use-cases/GetAll<%= Name %>s';
import { Update<%= Name %>UseCase } from '../../application/use-cases/Update<%= Name %>';
import { Delete<%= Name %>UseCase } from '../../application/use-cases/Delete<%= Name %>';
<% } -%>

export class <%= Name %>Controller {
  constructor(
<% if (addUseCases) { -%>
    private readonly createUseCase: Create<%= Name %>UseCase,
    private readonly getByIdUseCase: Get<%= Name %>ByIdUseCase,
    private readonly getAllUseCase: GetAll<%= Name %>sUseCase,
    private readonly updateUseCase: Update<%= Name %>UseCase,
    private readonly deleteUseCase: Delete<%= Name %>UseCase
<% } -%>
  ) {}

<% if (addUseCases) { -%>
  async create(req: any, res: any) {
    try {
      await this.createUseCase.execute(req.body);
      return res.status(201).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getById(req: any, res: any) {
    try {
      const result = await this.getByIdUseCase.execute({ id: req.params.id });
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async getAll(req: any, res: any) {
    try {
      const results = await this.getAllUseCase.execute();
      return res.status(200).json(results);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req: any, res: any) {
    try {
      await this.updateUseCase.execute({ id: req.params.id, ...req.body });
      return res.status(200).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: any, res: any) {
    try {
      await this.deleteUseCase.execute({ id: req.params.id });
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
<% } else { -%>
  // Inyecta aquí tus use cases y define los controladores HTTP
<% } -%>
}
