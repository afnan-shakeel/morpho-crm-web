import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiBaseService, ApiErrorHandlerService } from '../../core';

export interface Country {
  countryId: string;
  name: string;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  private api = inject(ApiBaseService);
  private errorHandler = inject(ApiErrorHandlerService);

  getCountries(): Observable<Country[]> {
    return this.api.get<any>('countries').pipe(
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of([] as Country[]);
      }),
      map((response) => response.data || [])
    );
  }
}