
# Dominio

El Interior (La Lógica)

Imagina que el centro del hexágono es el cerebro de tu aplicación. Aquí es donde vive la lógica: cómo se calcula un descuento, cómo se registra un usuario, etc.

* Regla de oro: El código de aquí adentro no debe saber nada del mundo exterior. No sabe si usas MySQL, MongoDB, o si los datos vienen de un formulario web o de un archivo de texto.

```tsx
// src/ice-cream/domain/value-objects/price.vo.ts
export class Price {
  constructor(private readonly amount: number) {
    if (amount < 0) throw new Error('El helado no puede ser gratis o negativo');
  }
  get value() { return this.amount; }
}

// src/ice-cream/domain/ice-cream.entity.ts
export class IceCream {
  constructor(
    public readonly id: string,
    public flavor: string,
    private price: Price, // Usamos el Value Object en lugar de un simple number
  ) {}

  // El dominio tiene "comportamiento", no es solo un contenedor de datos
  applySummerDiscount() {
    this.price = new Price(this.price.value * 0.9); // 10% de descuento
  }
}
```
