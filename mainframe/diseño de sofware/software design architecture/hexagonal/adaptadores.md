
# Los Adaptadores

La Infraestructura

Aquí es donde realmente "enchufamos" la tecnología. En este caso, usaremos un adaptador en memoria (un simple array) para no complicarlo con bases de datos reales.

```tsx
// src/ice-cream/infrastructure/persistence/in-memory-ice-cream.repository.ts
import { IceCreamRepository } from '../../domain/ice-cream.repository';
import { IceCream } from '../../domain/ice-cream.model';

export class InMemoryIceCreamRepository implements IceCreamRepository {
  private iceCreams: IceCream[] = [];

  async findAll(): Promise<IceCream[]> {
    return this.iceCreams;>
  }

  async create(iceCream: IceCream): Promise<IceCream> {
    this.iceCreams.push(iceCream);
    return iceCream;
  }
}
```


## El Adaptador de Entrada (Controlador)

En el caso de nuestro ejemplo estamos abriendo un servicio http por lo que los adaptadores de etrada serian los controladores

```tsx
// src/ice-cream/infrastructure/controllers/ice-cream.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { IceCream } from '../../domain/ice-cream.model';
import { InMemoryIceCreamRepository } from '../persistence/in-memory-ice-cream.repository';

@Controller('ice-creams')
export class IceCreamController {
  // Nota: En un proyecto real usaríamos un "Use Case" intermedio, 
  // pero aquí inyectamos el repositorio para simplificar.
  constructor(private readonly repository: InMemoryIceCreamRepository) {}

  @Get()
  getFlavors() {
    return this.repository.findAll();
  }

  @Post()
  addFlavor(@Body() body: { flavor: string; price: number }) {
    const newIceCream = new IceCream(Date.now().toString(), body.flavor, body.price);
    return this.repository.create(newIceCream);
  }
}
```
