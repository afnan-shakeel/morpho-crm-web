import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of } from "rxjs";
import { ApiBaseService, ToastService } from "../../../../core";
import { ApiErrorHandlerService } from "../../../../core/services/http/api-error-handler.service";
import { LeadInteractionTypeTypes } from "../types";


@Injectable({
    providedIn: "root",
})
export class LeadsInteractionMasterService {
    private api = inject(ApiBaseService);
    private toastService = inject(ToastService);
    private errorHandler = inject(ApiErrorHandlerService);

    getLeadInteractionTypes(): Observable<LeadInteractionTypeTypes.LeadInteractionType[]> {
        return this.api.get<any>(`leads/interaction-types`).pipe(
            catchError((error) => {
                this.errorHandler.handleError(error);
                return of([] as LeadInteractionTypeTypes.LeadInteractionType[]);
            }),
            map((response) => response.data)
        );
    }

    createLeadInteractionType(request: LeadInteractionTypeTypes.CreateLeadInteractionTypeRequest): Observable<LeadInteractionTypeTypes.LeadInteractionType | null> {
        return this.api.post<LeadInteractionTypeTypes.LeadInteractionType, LeadInteractionTypeTypes.CreateLeadInteractionTypeRequest>(`leads/interaction-types/create`, request).pipe(
            catchError((error) => {
                this.errorHandler.handleError(error);
                return of(null);
            }),
            map((response: any) => response.data)
        );
    }

    updateLeadInteractionType(id: string, data: LeadInteractionTypeTypes.UpdateLeadInteractionTypeRequest): Observable<LeadInteractionTypeTypes.LeadInteractionType | null> {
        return this.api.post<LeadInteractionTypeTypes.LeadInteractionType, LeadInteractionTypeTypes.UpdateLeadInteractionTypeRequest>(`leads/interaction-types/${id}/update`, data).pipe(
            catchError((error) => {
                this.errorHandler.handleError(error);
                return of(null);
            }),
            map((response: any) => response.data)
        );
    }
}