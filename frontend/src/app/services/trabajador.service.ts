import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Trabajador } from '../models/trabajador.model';

@Injectable({ providedIn: 'root' })
export class TrabajadorService {
  private readonly urlBase = `${environment.apiUrl}/trabajadores`;

  constructor(private http: HttpClient) {}

listar(textoBusqueda?: string): Observable<Trabajador[]> {
    const params: Record<string, string> = {};
    if (textoBusqueda) {
      params['buscar'] = textoBusqueda;
    }
    return this.http.get<Trabajador[]>(this.urlBase, { params });
  }

  obtenerPorId(id: string): Observable<Trabajador> {
    return this.http.get<Trabajador>(`${this.urlBase}/${id}`);
  }

  crear(trabajador: Trabajador): Observable<Trabajador> {
    return this.http.post<Trabajador>(this.urlBase, trabajador);
  }

  actualizar(id: string, trabajador: Trabajador): Observable<Trabajador> {
    return this.http.put<Trabajador>(`${this.urlBase}/${id}`, trabajador);
  }

  eliminar(id: string): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.urlBase}/${id}`);
  }
}
