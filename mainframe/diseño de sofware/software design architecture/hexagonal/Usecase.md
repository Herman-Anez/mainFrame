# Capa de Aplicación.

Son los casos de uso

se sientan entre el dominio y el puertos, cumplen con la logica del negocio

Son agnosticas a los puertos

```tsx
// src/ice-cream/application/use-cases/create-ice-cream.use-case.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { IceCreamRepository } from '../../domain/ice-cream.repository';
import { IceCream } from '../../domain/ice-cream.model';

@Injectable()
export class CreateIceCreamUseCase {
  // Inyectamos el puerto (la interfaz), no la base de datos real
  constructor(private readonly repository: IceCreamRepository) {}

  async execute(flavor: string, price: number): Promise<IceCream> {
    // 1. Regla de negocio: Validar si ya existe
    const existing = await this.repository.findByFlavor(flavor);
    if (existing) {
      throw new BadRequestException(`El sabor ${flavor} ya existe.`);
    }

    // 2. Crear la entidad de dominio (donde están las reglas de validación)
    const newIceCream = new IceCream(Date.now().toString(), flavor, price);

    // 3. Persistir (llamar al puerto de salida)
    return await this.repository.create(newIceCream);
  }
}
```