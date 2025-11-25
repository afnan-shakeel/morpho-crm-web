import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiBaseService, ApiErrorHandlerService } from '../../../../core';
import { AccountActivityTypeMasterApiTypes, AccountActivityTypeMasterTypes } from '../types/account-activity-types';

@Injectable({
  providedIn: 'root'
})
export class AccountActivityTypesService {
  private api = inject(ApiBaseService);
  private errorHandler = inject(ApiErrorHandlerService);

  getAccountActivityTypes(): Observable<AccountActivityTypeMasterTypes.AccountActivityType[]> {
    return this.api.get<any>(`accounts-activity-types`).pipe(
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of([] as AccountActivityTypeMasterTypes.AccountActivityType[]);
      }),
      map((response) => response.data)
    );
  }

  createAccountActivityType(request: AccountActivityTypeMasterApiTypes.AccountActivityTypeCreateRequest): Observable<AccountActivityTypeMasterTypes.AccountActivityType | null> {
    return this.api.post<AccountActivityTypeMasterTypes.AccountActivityType, AccountActivityTypeMasterApiTypes.AccountActivityTypeCreateRequest>(`accounts-activity-types`, request).pipe(
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of(null);
      }),
      map((response: any) => response.data)
    );
  }

  updateAccountActivityType(id : string, data: AccountActivityTypeMasterApiTypes.AccountActivityTypeUpdateRequest): Observable<AccountActivityTypeMasterTypes.AccountActivityType | null> {
    return this.api.post<AccountActivityTypeMasterTypes.AccountActivityType, AccountActivityTypeMasterApiTypes.AccountActivityTypeUpdateRequest>(`accounts-activity-types/${id}/update`, data).pipe(
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of(null);
      }),
      map((response: any) => response.data)
    );
  }
}
