import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of } from "rxjs";
import { ApiBaseService, ToastService } from "../../core";
import { ApiResponse, SearchApiPayload } from "../../core/services/http/types";
import {
    CreateLeadPayload,
    Lead,
    LeadAddressResponse,
    LeadLookupData,
    LeadLookupDataResponse,
    LeadsListData,
    UpdateLeadPayload
} from "./types";

@Injectable({
    providedIn: 'root'
})
export class LeadsService {
    private api = inject(ApiBaseService);
    private toastService = inject(ToastService);

    getLeads(query?: string, filters?: any, sort?: any, page?: number, pageSize?: number): Observable<LeadsListData> {
        const pagination = {
            "page": page || 1,
            "limit": pageSize || 10
        }
        const body: SearchApiPayload = {
            "globalSearch": {value: query || ''},
            "filters": filters || [],
            "sort": sort || {},
            "pagination": pagination
        };
        return this.api.post<LeadsListData, SearchApiPayload>('leads/search', body).pipe(
            map((response: any) => response.data),
            catchError(error => {
                console.error('Error fetching leads:', error);
                if(error && error.status && (error.status >= 400 && error.status < 500)) {
                    this.toastService.error(error.error?.message || 'Failed to fetch leads. Please check your input.');
                } else {
                    this.toastService.error('Failed to fetch leads. Please try again later.');
                }
                return of({} as LeadsListData)
            })
        );
    }

    getLeadsLookupData(): Observable<LeadLookupData> {
        return this.api.get<LeadLookupDataResponse>('leads/lookup-data').pipe(
            map((response: any) => response.data),
            catchError(error => {
                console.error('Error fetching leads lookup data:', error);
                this.toastService.error('Failed to fetch leads lookup data. Please try again later.');
                return of({} as LeadLookupData);
            })
        );
    }

    getLeadAddress(leadId: string): Observable<LeadAddressResponse> {
        return this.api.get<LeadAddressResponse>(`leads/${leadId}/address-primary`).pipe(
            catchError(error => {
                console.error('Error fetching lead address:', error);
                this.toastService.error('Failed to fetch lead address. Please try again later.');
                return of({} as LeadAddressResponse);
            })
        );
    }

    createLead(leadData: CreateLeadPayload): Observable<ApiResponse<Lead>> {
        return this.api.post<ApiResponse<Lead>, CreateLeadPayload>('leads/create', leadData).pipe(
            catchError(error => {
                console.error('Error creating lead:', error);
                this.toastService.error('Failed to create lead. Please try again later.');
                return of({} as ApiResponse<Lead>);
            }),
            map((response: any) => response.data),
        );
    }

    updateLead(updateleadData: UpdateLeadPayload): Observable<ApiResponse<Lead>> {
        return this.api.put<ApiResponse<Lead>, UpdateLeadPayload>(`leads/update`, updateleadData).pipe(
            map((response: any) => response.data),
            catchError(error => {
                console.error('Error updating lead:', error);
                this.toastService.error('Failed to update lead. Please try again later.');
                return of({} as ApiResponse<Lead>);
            })
        );
    }

    getLeadById(leadId: string): Observable<Lead> {
        return this.api.get<ApiResponse<Lead>>(`leads/${leadId}`).pipe(
            map((response: any) => response.data),
            catchError(error => {
                console.error('Error fetching lead:', error);
                this.toastService.error('Failed to fetch lead details. Please try again later.');
                return of({} as Lead);
            })
        );
    }

}