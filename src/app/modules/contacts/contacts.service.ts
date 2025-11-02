import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiBaseService } from '../../core';
import { ApiErrorHandlerService } from '../../core/services/http/api-error-handler.service';
import { ApiResponse, SearchApiPayload, SortDirection } from '../../core/services/http/types';
import { Contact, ContactsListData, CreateContactPayload, UpdateContactPayload } from './types';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private api = inject(ApiBaseService);
  private errorHandler = inject(ApiErrorHandlerService);

  getContacts(
    query?: string,
    filters?: any,
    sort?: any,
    page?: number,
    pageSize?: number,
    eagerFetch: boolean = false
  ): Observable<ContactsListData> {
    const body: SearchApiPayload = {
      eagerFetch: eagerFetch,
      globalSearch: { value: query || '' },
      filters: filters || [],
      sort: sort || {},
      pagination: {
        page: page || 1,
        limit: pageSize || 10,
      },
    };
    return this.api
      .post<ApiResponse<ContactsListData>, SearchApiPayload>('contacts/search', body)
      .pipe(
        catchError((error) => {
          this.errorHandler.handleError(error);
          return of({} as ContactsListData);
        }),
        map((response: any) => response.data)
      );
  }

  createContact(payload: CreateContactPayload): Observable<Contact> {
    return this.api
      .post<ApiResponse<Contact>, CreateContactPayload>('contacts/create', payload)
      .pipe(
        catchError((error) => {
          this.errorHandler.handleError(error);
          return of({} as Contact);
        }),
        map((response: any) => response.data)
      );
  }

  updateContact(id: string, payload: UpdateContactPayload): Observable<Contact> {
    return this.api
      .post<ApiResponse<Contact>, UpdateContactPayload>(`contacts/${id}/update`, payload)
      .pipe(
        catchError((error) => {
          this.errorHandler.handleError(error);
          return of({} as Contact);
        }),
        map((response: any) => response.data)
      );
  }

  getContactById(id: string): Observable<Contact> {
    return this.api.get<ApiResponse<Contact>>(`contacts/${id}`).pipe(
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of({} as Contact);
      }),
      map((response: any) => response.data)
    );
  }

  /**
   * Search contacts for autocomplete functionality
   * @param searchQuery - The search term to filter contacts
   * @param limit - Maximum number of results to return (default: 10)
   * @returns Observable<Contact[]> - List of matching contacts
   */
  searchContactsForAutocomplete(searchQuery: string, limit: number = 10, accountId: string | null): Observable<Contact[]> {
    const body: SearchApiPayload = {
      globalSearch: { value: searchQuery || '' },
      filters: [],
      sort: { field: 'fullName', direction: SortDirection.ASC },
      pagination: {
        page: 1,
        limit: limit,
      },
    };
    if (accountId) {
      body.filters.push({
        field: 'accountId',
        operator: 'equals' as any,
        value: accountId
      });
    }

    return this.api
      .post<ApiResponse<ContactsListData>, SearchApiPayload>('contacts/search', body)
      .pipe(
        catchError((error) => {
          this.errorHandler.handleError(error);
          return of([] as Contact[]);
        }),
        map((response: any) => response.data?.data || [])
      );
  }

  /**
   * Get contacts by account ID
   */
  getContactsByAccountId(accountId: string): Observable<Contact[]> {
    const body: SearchApiPayload = {
      globalSearch: { value: '' },
      filters: [
        {
          field: 'accountId',
          operator: 'equals' as any,
          value: accountId
        }
      ],
      sort: { field: 'fullName', direction: SortDirection.ASC },
      pagination: {
        page: 1,
        limit: 100, // Get all contacts for the account
      },
    };

    return this.api
      .post<ApiResponse<ContactsListData>, SearchApiPayload>('contacts/search', body)
      .pipe(
        catchError((error) => {
          this.errorHandler.handleError(error);
          return of([] as Contact[]);
        }),
        map((response: any) => response.data?.data || [])
      );
  }
}