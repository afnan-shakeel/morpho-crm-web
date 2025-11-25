
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiBaseService, ApiErrorHandlerService } from '../../../../core';
import { OpportunityStageApiTypes, OpportunityStageTypes } from '../types/opportunity-stage';

@Injectable({
  providedIn: 'root'
})
export class OpportunityStageService {
  private api = inject(ApiBaseService);
  private errorHandler = inject(ApiErrorHandlerService);

  getOpportunityStages(): Observable<OpportunityStageTypes.OpportunityStage[]> {
    return this.api.get<any>(`opportunities/stages`).pipe(
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of([] as OpportunityStageTypes.OpportunityStage[]);
      }),
      map((response) => response.data)
    );
  }

  createOpportunityStage(request: OpportunityStageApiTypes.OpportunityStageCreateRequest): Observable<OpportunityStageTypes.OpportunityStage | null> {
    return this.api.post<OpportunityStageTypes.OpportunityStage, OpportunityStageApiTypes.OpportunityStageCreateRequest>(`opportunities/stages/create`, request).pipe(
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of(null);
      }),
      map((response: any) => response.data)
    );
  }

  updateOpportunityStage(id : string, data: OpportunityStageApiTypes.OpportunityStageUpdateRequest): Observable<OpportunityStageTypes.OpportunityStage | null> {
    return this.api.put<OpportunityStageTypes.OpportunityStage, OpportunityStageApiTypes.OpportunityStageUpdateRequest>(`opportunities/stages/${id}`, data).pipe(
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of(null);
      }),
      map((response: any) => response.data)
    );
  }
}
