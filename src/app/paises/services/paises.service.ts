import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisesSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  private baseUrl: string = 'https://restcountries.com/v2/'

  get regiones(): string[] {
    
    return [...this._regiones ];
  }

  constructor(private http: HttpClient) { }
  

  getPaisesRegion(region: string ): Observable<PaisesSmall[]> {
    
     const url: string = `${ this.baseUrl}/region/${ region }?fields=name,alpha3Code`
     return this.http.get<PaisesSmall[]>(url);

  }
  
  getPaisCodigo(codigo: string): Observable<Pais | null> {

    if (!codigo) {
      return of(null)
    }

    const url = `${ this.baseUrl }/alpha/${ codigo }`
    
    return this.http.get<Pais>( url )
     
  }

   getPaisCodigoSmall(codigo: string): Observable<PaisesSmall> {
    const url = `${ this.baseUrl }/alpha/${ codigo }?fields=name,alpha3Code`
    return this.http.get<PaisesSmall>( url )   
  }
  

  getPaisesCodigos( borders: string[] ): Observable<PaisesSmall[]>{
      
    if (!borders) {
      return of([]);
    }
    
    const peticiones: Observable<PaisesSmall>[] = [];

    borders.forEach( codigo => {
      const peticion = this.getPaisCodigoSmall(codigo);
      peticiones.push( peticion );
    })

    return combineLatest(peticiones);

  }

}
