import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiBaseService, ToastService } from '../../core';
import { ApiErrorHandlerService } from '../../core/services/http/api-error-handler.service';
import { ApiResponse, SearchApiPayload, SortDirection } from '../../core/services/http/types';
import {
    CreateOpportunityActivityPayload,
    CreateOpportunityPayload,
    OpportunitiesListData,
    Opportunity,
    OpportunityActivity,
    OpportunityActivityResponse,
    OpportunityLogs,
    OpportunityLogsResponse,
    OpportunityLookupData,
    OpportunityLookupDataResponse,
    OpportunityResponse,
    OpportunityStage,
    UpdateOpportunityActivityPayload,
    UpdateOpportunityPayload,
    UpdateOpportunityStagePayload
} from './types';

@Injectable({
    providedIn: 'root',
})
export class OpportunityService {
    private api = inject(ApiBaseService);
    private toastService = inject(ToastService);
    private errorHandler = inject(ApiErrorHandlerService);

    /**
     * Get opportunities with search, filtering, sorting, and pagination
     */
    getOpportunities(
        query?: string,
        filters?: any,
        sort?: any,
        page?: number,
        pageSize?: number,
        eagerFetch: boolean = false
    ): Observable<OpportunitiesListData> {
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
        return this.api.post<OpportunitiesListData, SearchApiPayload>('opportunities/search', body).pipe(
            catchError((error) => {
                this.errorHandler.handleError(error);
                return of({} as OpportunitiesListData);
            }),
            map((response: any) => response.data)
        );
    }

    /**
     * Get opportunity lookup data for dropdowns
     */
    getOpportunityLookupData(): Observable<OpportunityLookupData> {
        return this.api.get<OpportunityLookupDataResponse>('opportunities/lookup-data').pipe(
            catchError((error) => {
                console.error('Error fetching opportunity lookup data:', error);
                this.toastService.error('Failed to fetch opportunity lookup data. Please try again later.');
                return of({} as OpportunityLookupData);
            }),
            map((response: any) => response.data)
        );
    }

    /**
     * Create a new opportunity
     */
    createOpportunity(opportunityData: CreateOpportunityPayload): Observable<Opportunity> {
        return this.api.post<OpportunityResponse, CreateOpportunityPayload>('opportunities/create', opportunityData).pipe(
            catchError((error) => {
                this.errorHandler.handleError(error);
                return of({} as Opportunity);
            }),
            map((response: any) => response.data)
        );
    }

    /**
     * Update an existing opportunity
     */
    updateOpportunity(opportunityId: string, updateOpportunityData: UpdateOpportunityPayload): Observable<Opportunity> {
        return this.api.post<OpportunityResponse, UpdateOpportunityPayload>(`opportunities/${opportunityId}/update`, updateOpportunityData).pipe(
            catchError((error) => {
                this.errorHandler.handleError(error);
                return of({} as Opportunity);
            }),
            map((response: any) => response.data)
        );
    }

    /**
     * Get opportunity by ID
     */
    getOpportunityById(opportunityId: string, eagerFetch: boolean = false): Observable<Opportunity> {
        let params = new HttpParams();
        if (eagerFetch) {
            params = params.set('eagerFetch', 'true');
        }
        return this.api.get<OpportunityResponse>(`opportunities/${opportunityId}`, params).pipe(
            catchError((error) => {
                console.error('Error fetching opportunity:', error);
                this.toastService.error('Failed to fetch opportunity details. Please try again later.');
                return of({} as Opportunity);
            }),
            map((response: any) => response.data)
        );
    }

    /**
     * Update opportunity stage
     */
    updateOpportunityStage(opportunityId: string, stageId: string, lossReasonCode?: string): Observable<Opportunity> {
        const payload: UpdateOpportunityStagePayload = {
            opportunityId,
            stageId,
            lossReasonCode: lossReasonCode || null
        };
        return this.api.post<OpportunityResponse, UpdateOpportunityStagePayload>(`opportunities/stage-update/${opportunityId}`, payload).pipe(
            catchError((error) => {
                this.errorHandler.handleError(error);
                return of({} as Opportunity);
            }),
            map((response: any) => response.data)
        );
    }

    /**
     * Get opportunity logs/history
     */
    getOpportunityLogs(opportunityId: string): Observable<OpportunityLogs[]> {
        return this.api.get<OpportunityLogsResponse>(`opportunities/${opportunityId}/logs`).pipe(
            catchError((error) => {
                console.error('Error fetching opportunity logs:', error);
                this.toastService.error('Failed to fetch opportunity logs. Please try again later.');
                return of([] as OpportunityLogs[]);
            }),
            map((response: any) => response.data)
        );
    }

    /**
     * Create opportunity activity
     */
    createOpportunityActivity(opportunityId: string, activityData: CreateOpportunityActivityPayload): Observable<OpportunityActivity> {
        return this.api.post<OpportunityActivityResponse, CreateOpportunityActivityPayload>(`opportunities/${opportunityId}/activity/create`, activityData).pipe(
            catchError((error) => {
                return this.errorHandler.handleError(error);
            }),
            map((response: any) => response.data)
        );
    }

    /**
     * Update opportunity activity
     */
    updateOpportunityActivity(opportunityId: string, activityId: string, activityData: UpdateOpportunityActivityPayload): Observable<OpportunityActivity> {
        return this.api.post<OpportunityActivityResponse, UpdateOpportunityActivityPayload>(`opportunities/${opportunityId}/activity/update/${activityId}`, activityData).pipe(
            catchError((error) => {
                return this.errorHandler.handleError(error);
            }),
            map((response: any) => response.data)
        );
    }

    /**
     * Get opportunity activities
     */
    getOpportunityActivities(opportunityId: string): Observable<OpportunityActivity[]> {
        return this.api.get<ApiResponse<OpportunityActivity[]>>(`opportunities/${opportunityId}/activities`).pipe(
            catchError((error) => {
                console.error('Error fetching opportunity activities:', error);
                this.toastService.error('Failed to fetch opportunity activities. Please try again later.');
                return of([] as OpportunityActivity[]);
            }),
            map((response: any) => response.data)
        );
    }

    /**
     * Get opportunity activity by ID
     */
    getOpportunityActivityById(opportunityId: string, activityId: string): Observable<OpportunityActivity> {
        return this.api.get<OpportunityActivityResponse>(`opportunities/${opportunityId}/activity/${activityId}`).pipe(
            catchError((error) => {
                console.error('Error fetching opportunity activity:', error);
                this.toastService.error('Failed to fetch opportunity activity. Please try again later.');
                return of({} as OpportunityActivity);
            }),
            map((response: any) => response.data)
        );
    }

    /**
     * Get opportunity stages for dropdown
     */
    getOpportunityStages(): Observable<OpportunityStage[]> {
        return this.api.get<ApiResponse<OpportunityStage[]>>('opportunities/stages').pipe(
            catchError((error) => {
                console.error('Error fetching opportunity stages:', error);
                this.toastService.error('Failed to fetch opportunity stages. Please try again later.');
                return of([] as OpportunityStage[]);
            }),
            map((response: any) => response.data)
        );
    }

    /**
     * Search opportunities for autocomplete functionality
     */
    searchOpportunitiesForAutocomplete(searchQuery: string, limit: number = 10): Observable<Opportunity[]> {
        const body: SearchApiPayload = {
            globalSearch: { value: searchQuery || '' },
            filters: [],
            sort: { field: "opportunityName", direction: SortDirection.ASC },
            pagination: {
                page: 1,
                limit: limit
            }
        };

        return this.api.post<ApiResponse<OpportunitiesListData>, SearchApiPayload>('opportunities/search', body).pipe(
            catchError((error) => {
                this.errorHandler.handleError(error);
                return of([] as Opportunity[]);
            }),
            map((response: any) => response.data?.data || [])
        );
    }

    /**
     * Delete opportunity
     */
    deleteOpportunity(opportunityId: string): Observable<boolean> {
        return this.api.delete<ApiResponse<any>>(`opportunities/${opportunityId}`).pipe(
            catchError((error) => {
                this.errorHandler.handleError(error);
                return of(false);
            }),
            map((response: any) => {
                this.toastService.success('Opportunity deleted successfully');
                return true;
            })
        );
    }
}