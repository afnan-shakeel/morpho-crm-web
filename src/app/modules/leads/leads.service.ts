import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiBaseService, ToastService } from '../../core';
import { ApiErrorHandlerService } from '../../core/services/http/api-error-handler.service';
import { ApiResponse, SearchApiPayload, SortDirection } from '../../core/services/http/types';
import {
    CreateLeadAddressPayload,
    CreateLeadInteractionPayload,
    CreateLeadPayload,
    Lead,
    LeadAddress,
    LeadAddressResponse,
    LeadInteraction,
    LeadInteractionResponse,
    LeadLogs,
    LeadLookupData,
    LeadLookupDataResponse,
    LeadsListData,
    LeadSource,
    UpdateLeadInteractionPayload,
    UpdateLeadPayload,
} from './types';

@Injectable({
  providedIn: 'root',
})
export class LeadsService {
  private api = inject(ApiBaseService);
  private toastService = inject(ToastService);
  private errorHandler = inject(ApiErrorHandlerService);

  getLeads(
    query?: string,
    filters?: any,
    sort?: any,
    page?: number,
    pageSize?: number
  ): Observable<LeadsListData> {
    const body: SearchApiPayload = {
      globalSearch: { value: query || '' },
      filters: filters || [],
      sort: sort || {},
      pagination: {
        page: page || 1,
        limit: pageSize || 10,
      },
    };
    return this.api.post<LeadsListData, SearchApiPayload>('leads/search', body).pipe(
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of({} as LeadsListData);
      }),
      map((response: any) => response.data)
    );
  }

  getLeadsLookupData(): Observable<LeadLookupData> {
    return this.api.get<LeadLookupDataResponse>('leads/lookup-data').pipe(
      catchError((error) => {
        console.error('Error fetching leads lookup data:', error);
        this.toastService.error('Failed to fetch leads lookup data. Please try again later.');
        return of({} as LeadLookupData);
      }),
      map((response: any) => response.data)
    );
  }

  getLeadAddress(leadId: string): Observable<LeadAddress> {
    return this.api.get<LeadAddressResponse>(`leads/${leadId}/address-primary`).pipe(
      catchError((error) => {
        return of({} as LeadAddressResponse);
      }),
      map((response: any) => response.data)
    );
  }

  createLead(leadData: CreateLeadPayload): Observable<Lead> {
    return this.api.post<ApiResponse<Lead>, CreateLeadPayload>('leads/create', leadData).pipe(
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of({} as ApiResponse<Lead>);
      }),
      map((response: any) => response.data)
    );
  }

  updateLead(updateleadData: UpdateLeadPayload): Observable<ApiResponse<Lead>> {
    return this.api.post<ApiResponse<Lead>, UpdateLeadPayload>(`leads/update`, updateleadData).pipe(
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of({} as ApiResponse<Lead>);
      }),
      map((response: any) => response.data)
    );
  }

  getLeadById(leadId: string, eagerFetch: boolean = false): Observable<Lead> {
    let params = new HttpParams();
    if (eagerFetch) {
      params = params.set('eagerFetch', 'true');
    }
    return this.api.get<ApiResponse<Lead>>(`leads/${leadId}`, params).pipe(
      catchError((error) => {
        console.error('Error fetching lead:', error);
        this.toastService.error('Failed to fetch lead details. Please try again later.');
        return of({} as Lead);
      }),
      map((response: any) => response.data)
    );
  }

  createLeadAddress(
    leadId: string,
    addressData: CreateLeadAddressPayload
  ): Observable<LeadAddress> {
    return this.api
      .post<LeadAddressResponse, CreateLeadAddressPayload>(
        `leads/${leadId}/address/create`,
        addressData
      )
      .pipe(
        catchError((error) => {
          return this.errorHandler.handleError(error);
        }),
        map((response: any) => response.data)
      );
  }

  getLeadLogs(leadId: string): Observable<LeadLogs[]> {
    return this.api.get<ApiResponse<LeadLogs[]>>(`leads/${leadId}/logs`).pipe(
      catchError((error) => {
        console.error('Error fetching lead logs:', error);
        this.toastService.error('Failed to fetch lead logs. Please try again later.');
        return of([] as LeadLogs[]);
      }),
      map((response: any) => response.data)
    );
  }

  createLeadInteraction(
    leadId: string,
    interactionData: CreateLeadInteractionPayload
  ): Observable<LeadInteraction> {
    return this.api
      .post<LeadInteractionResponse, CreateLeadInteractionPayload>(
        `leads/${leadId}/interaction/create`,
        interactionData
      )
      .pipe(
        catchError((error) => {
          return this.errorHandler.handleError(error);
        }),
        map((response: any) => response.data)
      );
  }

  updateLeadInteraction(
    leadId: string,
    interactionId: string,
    interactionData: UpdateLeadInteractionPayload
  ): Observable<LeadInteraction> {
    return this.api
      .post<LeadInteractionResponse, UpdateLeadInteractionPayload>(
        `leads/${leadId}/interaction/update/${interactionId}`,
        interactionData
      )
      .pipe(
        catchError((error) => {
          return this.errorHandler.handleError(error);
        }),
        map((response: any) => response.data)
      );
  }

  getLeadInteractions(leadId: string): Observable<LeadInteraction[]> {
    return this.api.get<ApiResponse<LeadInteraction[]>>(`leads/${leadId}/interaction`).pipe(
      catchError((error) => {
        console.error('Error fetching lead interactions:', error);
        this.toastService.error('Failed to fetch lead interactions. Please try again later.');
        return of([] as LeadInteraction[]);
      }),
      map((response: any) => response.data)
    );
  }

  getLeadInteractionById(leadId: string, interactionId: string): Observable<LeadInteraction> {
    return this.api
      .get<LeadInteractionResponse>(`leads/${leadId}/interaction/${interactionId}`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching lead interaction:', error);
          this.toastService.error('Failed to fetch lead interaction. Please try again later.');
          return of({} as LeadInteraction);
        }),
        map((response: any) => response.data)
      );
  }

  updateLeadStatus(leadId: string, status: string): Observable<Lead> {
    return this.api
      .post<ApiResponse<Lead>, any>(`leads/status-update/${leadId}`, { leadStatus: status })
      .pipe(
        catchError((error) => {
          this.errorHandler.handleError(error);
          return of({} as ApiResponse<Lead>);
        }),
        map((response: any) => response.data)
      );
  }

  getLeadSources(): Observable<LeadSource[]> {
    return this.api.get<ApiResponse<LeadSource[]>>('leads/sources').pipe(
      catchError((error) => {
        console.error('Error fetching lead sources:', error);
        this.toastService.error('Failed to fetch lead sources. Please try again later.');
        return of([] as LeadSource[]);
      }),
      map((response: any) => response.data)
    );
  }

  getLeadSourceById(sourceId: string): Observable<LeadSource> {
    return this.api.get<ApiResponse<LeadSource>>(`leads/sources/${sourceId}`).pipe(
      catchError((error) => {
        console.error('Error fetching lead source:', error);
        this.toastService.error('Failed to fetch lead source. Please try again later.');
        return of({} as LeadSource);
      }),
      map((response: any) => response.data)
    );
  }

  convertLeadToCustomer(leadId: string): Observable<Lead | null> {
    return this.api.get<ApiResponse<Lead>>(`leads/convert/${leadId}`).pipe(
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of(null);
      }),
      map((response: any) => response.data)
    );
  }

  searchLeadsForAutocomplete(searchQuery: string, limit: number = 10): Observable<Lead[]> {
    const body: SearchApiPayload = {
      globalSearch: { value: searchQuery || '' },
      filters: [],
      sort: { field: 'accountName', direction: SortDirection.ASC },
      pagination: {
        page: 1,
        limit: limit,
      },
    };

    return this.api.post<ApiResponse<LeadsListData>, SearchApiPayload>('leads/search', body).pipe(
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of([] as Lead[]);
      }),
      map((response: any) => response.data?.data || [])
    );
  }
}
