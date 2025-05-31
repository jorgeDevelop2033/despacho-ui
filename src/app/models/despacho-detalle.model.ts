export interface DespachoDetalleDto {
  id: string;
  fecha: string;
  diaSemana: string;
  tipoPrecioId: string;
  clienteId?: string;
  vendedorId?: string;
  rutaId?: string;
  entregas: EntregaProductoDto[];
  devoluciones: DevolucionProductoDto[];
}

export interface EntregaProductoDto {
  id: string;
  productoId: string;
  productoNombre: string;
  pesoKg: number;
  precioUnitario: number;
  fotos: FotoDto[];
}

export interface DevolucionProductoDto {
  id: string;
  productoId: string;
  productoNombre: string;
  pesoKg: number;
  precioUnitario: number;
  total?: number;
  fotos: FotoDto[];
}

export interface FotoDto {
  url: string;
}
