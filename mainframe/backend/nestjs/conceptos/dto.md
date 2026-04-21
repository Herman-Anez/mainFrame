# dto

El DTO (En la capa de Infraestructura/Controlador) es el objeto que comunica a los controladores como entra el dato

```tsx
// interfaces/dto/create-ice-cream.dto.ts
export class CreateIceCreamDto {
  @IsString()
  flavor: string;

  @IsInt()
  @Min(0)
  price: number;
}

// interfaces/controllers/ice-cream.controller.ts
@Controller('ice-creams')
export class IceCreamController {

  @Post()
  create(@Body() dto: CreateGatoDto) {
    return this.createUC.execute(dto.flavor, dto.price);
  }

}
```
