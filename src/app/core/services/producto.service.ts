import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { TipoPrecioDto } from './tipo-precio.service';
import { ProductoDto } from '../../models/producto.models';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private readonly apiUrl = `${environment.apiUrl}/productos`; // 🔁 Reemplaza con tu URL real

  private readonly tipoPrecioUrl  = `${environment.apiUrl}/ObtenerTiposPrecio`;

  constructor(private http: HttpClient) {}

  obtenerPorTipoPrecio(tipoPrecioId: number): Observable<ProductoDto[]> {
    console.log(tipoPrecioId);
    const url = `${this.apiUrl}/por-tipo-precio/${tipoPrecioId}`;
    return this.http.get<ProductoDto[]>(url);
  }

  crearProducto(producto: ProductoDto): Observable<any> {
    return this.http.post(`${this.apiUrl}`, producto);
  }

  obtenerTipoPrecios(): Observable<TipoPrecioDto[]> {
    return this.http.get<TipoPrecioDto[]>(`${this.tipoPrecioUrl}`);
  }

  actualizarPrecioProducto(productoId: number, data: { tipoPrecioId: number, valor: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${productoId}/precio`, data);
  }

  obtenerProductos(): Observable<ProductoDto[]> {
    return this.http.get<ProductoDto[]>(`${this.apiUrl}`); // Asegúrate que el tipo es ProductoDto[]
  }




}
