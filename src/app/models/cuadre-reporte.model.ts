export interface ProductoReporteDto {
  descripcion: string;
  pesoKg: number;
  precioUnitario: number;
  subtotal: number;
}


export interface CuadreReporteDto {
  productosEntregados: ProductoReporteDto[];
  productosDevueltos: ProductoReporteDto[];
  totalEntregado: number;
  totalDevuelto: number;
  totalNeto: number;
}