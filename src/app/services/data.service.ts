import { Injectable } from '@angular/core';
import { Observable,shareReplay,catchError,throwError } from 'rxjs';
import { Country } from '../models/country';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url = './assets/mock/olympic.json';
  private countries$! : Observable<Country[]>;

  constructor(private http: HttpClient) { }

  getCountries() : Observable<Country[]> {
    if ( !this.countries$ )
    {
      this.countries$ = this.http.get<Country[]>(this.url).pipe(
        shareReplay(1),
        catchError((r:HttpErrorResponse) => throwError(() => new Error(`Erreur on getting datas (${r.message})`)))
      );
    }
    return this.countries$;
  }
}
