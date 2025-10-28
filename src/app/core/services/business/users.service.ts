import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of } from "rxjs";
import { ApiBaseService } from "../http";
import { ToastService } from "../ui";


@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private api = inject(ApiBaseService);
    private toastService = inject(ToastService);

    getUsers(searchKeyword?: string, maxResults: number = 20, skipCount: number = 0): Observable<any> {
        const params: any = {};
        if (searchKeyword) {
            params.search = searchKeyword;
        }
        if (maxResults) {
            params.limit = maxResults;
        }
        if (skipCount) {
            params.offset = skipCount;
        }

        return this.api.get('users/list', params).pipe(
            catchError(error => {
                console.error('Error fetching users:', error);
                // this.toastService.error('Failed to fetch users. Please try again later.');
                return of([]);
            }),
            map((response: any) => response.data),
        )
    }

    getUserById(userId: number): Observable<any> {
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