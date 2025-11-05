import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiBaseService } from '../../core';
import { ApiErrorHandlerService } from '../../core/services/http/api-error-handler.service';
import { ApiResponse, SearchApiPayload, SortDirection } from '../../core/services/http/types';
import { Account, AccountActivityLog, AccountsListData, CreateAccountActivityPayload, createAccountRequest, UpdateAccountActivityPayload } from './types';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private api = inject(ApiBaseService);
  private errorHandler = inject(ApiErrorHandlerService);

  getAccounts(
    query?: string,
    filters?: any,
    sort?: any,
    page?: number,
    pageSize?: number
  ): Observable<AccountsListData> {
    const body: SearchApiPayload = {
      globalSearch: { value: query || '' },
      filters: filters || [],
      sort: sort || {},
      pagination: {
        page: page || 1,
        limit: pageSize || 10,
      },
    };
    return this.api
      .post<ApiResponse<AccountsListData>, SearchApiPayload>('accounts/search', body)
      .pipe(
        catchError((error) => {
          this.errorHandler.handleError(error);
          return of({} as AccountsListData);
        }),
        map((response: any) => response.data)
      );
  }

  createAccount(payload: createAccountRequest): Observable<Account> {
    return this.api
      .post<ApiResponse<Account>, createAccountRequest>('accounts/create', payload)
      .pipe(
        catchError((error) => {
          this.errorHandler.handleError(error);
          return of(null);
        }),
        map((response: any) => response.data)
      );
  }

  updateAccount(id: string, payload: createAccountRequest): Observable<Account> {
    return this.api
      .post<ApiResponse<Account>, createAccountRequest>(`accounts/${id}/update`, payload)
      .pipe(
        catchError((error) => {
          this.errorHandler.handleError(error);
          return of(null);
        }),
        map((response: any) => response.data)
      );
  }

  getAccountById(id: string, eagerFetch: boolean = false): Observable<Account> {
    return this.api.get<ApiResponse<Account>>(`accounts/${id}?eagerFetch=${eagerFetch}`).pipe(
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of({} as Account);
      }),
      map((response: any) => response.data)
    );
  }

  getActivityLogs(accountId: string): Observable<AccountActivityLog[]> {
    return this.api
      .get<ApiResponse<AccountActivityLog[]>>(`accounts-activities/account/${accountId}`)
      .pipe(
        catchError((error) => {
          this.errorHandler.handleError(error);
          return of([] as AccountActivityLog[]);
        }),
        map((response: any) => response.data)
      );
  }

  createActivityLog(payload: CreateAccountActivityPayload): Observable<AccountActivityLog> {
    return this.api
      .post<ApiResponse<AccountActivityLog>, any>('accounts-activities/create', payload)
      .pipe(
        catchError((error) => {
          this.errorHandler.handleError(error);
          return of(null);
        }),
        map((response: any) => response.data)
      );
  }

  updateActivityLog(activityId: string, payload: Partial<UpdateAccountActivityPayload>): Observable<AccountActivityLog> {
    return this.api
      .put<ApiResponse<AccountActivityLog>, any>(`accounts-activities/${activityId}`, payload)
      .pipe(
        catchError((error) => {
          this.errorHandler.handleError(error);
          return of(null);
        }),
        map((response: any) => response.data)
      );
  }

  /**
   * Search accounts for autocomplete functionality
   * @param searchQuery - The search term to filter accounts
   * @param limit - Maximum number of results to return (default: 10)
   * @returns Observable<Account[]> - List of matching accounts
   */
  searchAccountsForAutocomplete(searchQuery: string, limit: number = 10): Observable<Account[]> {
    const body: SearchApiPayload = {
      globalSearch: { value: searchQuery || '' },
      filters: [],
      sort: { field: 'companyName', direction: SortDirection.ASC },
      pagination: {
        page: 1,
        limit: limit,
      },
    };

    return this.api
      .post<ApiResponse<AccountsListData>, SearchApiPayload>('accounts/search', body)
      .pipe(
        catchError((error) => {
          this.errorHandler.handleError(error);
          return of([] as Account[]);
        }),
        map((response: any) => response.data?.data || [])
      );
  }
}
