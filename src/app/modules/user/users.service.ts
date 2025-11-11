import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of } from "rxjs";
import { ApiBaseService, ToastService } from "../../core";
import { SearchApiPayload } from "../../core/services/http/types";
import { UserListData } from "./user.types";


@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private api = inject(ApiBaseService);
    private toastService = inject(ToastService);

    getUsers(query?: string,
        filters?: any,
        sort?: any,
        page?: number,
        pageSize?: number,
        eagerFetch: boolean = false
    ): Observable<UserListData> {
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

        return this.api.post<UserListData, SearchApiPayload>('users/list', body).pipe(
            catchError(error => {
                console.error('Error fetching users:', error);
                // this.toastService.error('Failed to fetch users. Please try again later.');
                return of([]);
            }),
            map((response: any) => response.data),
        )
    }

    getUserById(userId: string): Observable<any> {
        return this.api.get(`users/${userId}`).pipe(
            catchError(error => {
                console.error(`Error fetching user with ID ${userId}:`, error);
                // this.toastService.error('Failed to fetch user details. Please try again later.');
                return of(null);
            }),
            map((response: any) => response.data),
        );
    }

}