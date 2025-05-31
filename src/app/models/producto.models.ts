import { PrecioProductoDto } from "./precio.dto";

export interface PrecioDto {
  tipoPrecioId: number;
  valor: number;
}

export interface ProductoDto {
  id: number;
  nombre: string;
  codigoBarra: string;
  precios: {
    id: number;
    tipoPrecioId: number;
    valor: number;
  }[];
}