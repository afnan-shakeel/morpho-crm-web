import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiBaseService, ApiErrorHandlerService } from '../../../../core';
import { AccountActivityTypeApiTypes, AccountActivityTypeTypes } from '../types/account-activity-types';

@Injectable({
  providedIn: 'root'
})
export class AccountActivityTypesService {
  private api = inject(ApiBaseService);
  private errorHandler = inject(ApiErrorHandlerService);

  getAccountActivityTypes(): Observable<AccountActivityTypeTypes.AccountActivityType[]> {
    return this.api.get<any>(`accounts-activity-types`).pipe(
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of([] as AccountActivityTypeTypes.AccountActivityType[]);
      }),
      map((response) => response.data)
    );
  }

  createAccountActivityType(request: AccountActivityTypeApiTypes.AccountActivityTypeCreateRequest): Observable<AccountActivityTypeTypes.AccountActivityType | null> {
    return this.api.post<AccountActivityTypeTypes.AccountActivityType, AccountActivityTypeApiTypes.AccountActivityTypeCreateRequest>(`accounts-activity-types`, request).pipe(
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of(null);
      }),
      map((response: any) => response.data)
    );
  }

  updateAccountActivityType(id : string, data: AccountActivityTypeApiTypes.AccountActivityTypeUpdateRequest): Observable<AccountActivityTypeTypes.AccountActivityType | null> {
    return this.api.post<AccountActivityTypeTypes.AccountActivityType, AccountActivityTypeApiTypes.AccountActivityTypeUpdateRequest>(`accounts-activity-types/${id}/update`, data).pipe(
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of(null);
      }),
      map((response: any) => response.data)
    );
  }
}
