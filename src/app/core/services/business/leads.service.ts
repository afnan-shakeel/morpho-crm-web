import { inject, Injectable } from "@angular/core";
import { catchError, Observable, of } from "rxjs";
import { ApiBaseService } from "../http/api-base.service";
import { ToastService } from "../ui/toast.service";

@Injectable({
    providedIn: 'root'
})
export class LeadsService {
    private api = inject(ApiBaseService);
    private toastService = inject(ToastService);

    getLeads(query?: string, filters?: any, sort?: any, page?: number, pageSize?: number): Observable<any> {
        const pagination = {
            "page": page,
            "limit": pageSize
        }
        const body = {
            "globalSearch": {value: query || ''},
            "filters": filters || [],
            "sort": sort || {},
            "pagination": pagination
        };
        return this.api.post('leads/search', body).pipe(
            catchError(error => {
                console.error('Error fetching leads:', error);
                if(error && error.status && (error.status >= 400 && error.status < 500)) {
                    this.toastService.error(error.error?.message || 'Failed to fetch leads. Please check your input.');
                } else {
                    this.toastService.error('Failed to fetch leads. Please try again later.');
                }
                return of([])
            })
        );
    }

    getLeadsLookupData(): Observable<any> {
        return this.api.get('leads/lookup-data').pipe(
            catchError(error => {
                console.error('Error fetching leads lookup data:', error);
                this.toastService.error('Failed to fetch leads lookup data. Please try again later.');
                return of(null);
            })
        );
    }
}