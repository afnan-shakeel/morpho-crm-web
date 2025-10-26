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
            query,
            filters,
            sort,
            pagination
        };
        return this.api.post('leads/search', body).pipe(
            catchError(error => {
                this.toastService.error('Failed to fetch leads. Please try again later.');
                return of([])
            })
        );
    }
}