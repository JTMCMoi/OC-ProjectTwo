import { Injectable } from '@angular/core';
import { Observable,shareReplay,catchError,throwError } from 'rxjs';
import { Country } from '../models/country';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private url = './assets/mock/olympi.json';
  private countries$! : Observable<Country[]>;

  constructor(private http: HttpClient) { }

  getCountries() : Observable<Country[]> {
    if ( !this.countries$ )
    {
      this.countries$ = this.http.get<Country[]>(this.url).pipe(
        shareReplay(1),
        catchError((r:HttpErrorResponse) => throwError(() => new Error(`Erreur dans la récupération des données (${r.message})`)))
      );
    }
    return this.countries$;
  }
}
