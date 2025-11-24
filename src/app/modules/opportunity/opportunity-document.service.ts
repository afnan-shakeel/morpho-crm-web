import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiBaseService, ToastService } from '../../core';
import { ApiErrorHandlerService } from '../../core/services/http/api-error-handler.service';

export interface OpportunityDocument {
  documentId: string;
  opportunityId: string;
  documentType: string;
  documentName: string;
  fileLink: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class OpportunityDocumentService {
  private api = inject(ApiBaseService);
  private toastService = inject(ToastService);
  private errorHandler = inject(ApiErrorHandlerService);
  // HttpClient for operations that need specific response types (e.g., blob)
  private http = inject(HttpClient);
  // Access app config (baseUrl) from the ApiBaseService instance
  private baseUrl: string = (this.api as any).config?.apiUrl || '';

  /** Get all documents for an opportunity */
  getDocumentsByOpportunityId(opportunityId: string): Observable<OpportunityDocument[]> {
    return this.api.get<{ data: OpportunityDocument[] }>(`opportunity-documents/by-opportunity/${opportunityId}`).pipe(
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of([] as OpportunityDocument[]);
      }),
      map((response: any) => response.data || [])
    );
  }

  /** Get a single document by its ID */
  getDocumentById(documentId: string): Observable<OpportunityDocument> {
    return this.api.get<{ data: OpportunityDocument }>(`opportunity-documents/${documentId}`).pipe(
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of({} as OpportunityDocument);
      }),
      map((response: any) => response.data)
    );
  }

  /** Create a new document (file upload) */
  createDocument(formData: FormData): Observable<OpportunityDocument> {
    return this.api.post<{ data: OpportunityDocument }, FormData>(`opportunity-documents/create`, formData).pipe(
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of({} as OpportunityDocument);
      }),
      map((response: any) => response.data)
    );
  }

  /** Update an existing document */
  updateDocument(documentId: string, data: Partial<OpportunityDocument>): Observable<OpportunityDocument> {
    return this.api.put<{ data: OpportunityDocument }, Partial<OpportunityDocument>>(`opportunity-documents/${documentId}/update`, data).pipe(
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of({} as OpportunityDocument);
      }),
      map((response: any) => response.data)
    );
  }

  /** Download a document file as a Blob. Caller should subscribe and create object URL or save. */
  downloadDocument(documentId: string): Observable<Blob> {
    // Use ApiBaseService helper for blob responses to keep feature services consistent
    try {
      return this.api.getBlob(`opportunity-documents/${documentId}/download`);
    } catch (e) {
      // Fallback to direct HttpClient call if ApiBaseService doesn't expose getBlob for some reason
      return this.http.get(`/api/opportunity-documents/${documentId}/download`, { responseType: 'blob' });
    }
  }

  /** Delete a document by ID */
  deleteDocument(documentId: string): Observable<boolean> {
    return this.api.delete<any>(`opportunity-documents/${documentId}`).pipe(
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of(false);
      }),
      map((response: any) => {
        this.toastService.success('Document deleted successfully');
        return true;
      })
    );
  }
}
