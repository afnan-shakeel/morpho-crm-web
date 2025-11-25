import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of } from "rxjs";
import { ApiBaseService, ToastService } from "../../../../core";
import { ApiErrorHandlerService } from "../../../../core/services/http/api-error-handler.service";
import { LeadSourceTypes } from "../types";


@Injectable({
    providedIn: "root",
})
export class LeadsSourceMasterService {
    private api = inject(ApiBaseService);
    private toastService = inject(ToastService);
    private errorHandler = inject(ApiErrorHandlerService);
    // private baseUrl: string = "admin/leads-source-master";

    getLeadSources(): Observable<LeadSourceTypes.LeadSource[]> {
        return this.api.get<any>(`leads/sources`).pipe(
            catchError((error) => {
                this.errorHandler.handleError(error);
                return of([] as LeadSourceTypes.LeadSource[]);
            }),
            map((response) => response.data)
        );
    }

    createLeadSource(request: LeadSourceTypes.LeadSourceCreateRequest): Observable<LeadSourceTypes.LeadSource | null> {
        return this.api.post<LeadSourceTypes.LeadSourceListResponse, LeadSourceTypes.LeadSourceCreateRequest>(`leads/sources/create`, request).pipe(
            catchError((error) => {
                this.errorHandler.handleError(error);
                return of(null);
            }),
            map((response: any) => response.data)
        );
    }

    updateLeadSource(request: LeadSourceTypes.LeadSourceUpdateRequest): Observable<LeadSourceTypes.LeadSource | null> {
        return this.api.post<LeadSourceTypes.LeadSourceListResponse, LeadSourceTypes.LeadSourceUpdateRequest>(`leads/sources/update`, request).pipe(
            catchError((error) => {
                this.errorHandler.handleError(error);
                return of(null);
            }),
            map((response: any) => response.data)
        );
    }
}