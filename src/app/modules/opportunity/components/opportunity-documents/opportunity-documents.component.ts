
import { Component, Input, OnInit } from '@angular/core';
import { OpportunityDocument, OpportunityDocumentService } from '../../opportunity-document.service';

@Component({
  selector: 'app-opportunity-documents',
  templateUrl: './opportunity-documents.component.html',
  styleUrls: ['./opportunity-documents.component.css']
})
export class OpportunityDocumentsComponent implements OnInit {
  @Input() opportunityId!: string;
  documents: OpportunityDocument[] = [];
  loading = false;
  error: string | null = null;

  constructor(private docService: OpportunityDocumentService) {}

  ngOnInit() {
    if (this.opportunityId) {
      this.fetchDocuments();
    }
  }

  fetchDocuments() {
    this.loading = true;
    this.docService.getDocumentsByOpportunityId(this.opportunityId).subscribe({
      next: (docs) => {
        this.documents = docs;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load documents.';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('opportunityId', this.opportunityId);
    formData.append('documentType', 'Other'); // or let user select
    formData.append('file', file);
    this.docService.createDocument(formData).subscribe({
      next: () => this.fetchDocuments(),
      error: () => this.error = 'Failed to upload document.'
    });
  }

  downloadDocument(doc: OpportunityDocument) {
    this.docService.downloadDocument(doc.documentId).subscribe({
      next: (blob) => {
        // Create a link and trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.documentName || 'document';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 100);
      },
      error: () => {
        this.error = 'Failed to download document.';
      }
    });
  }

  onDelete(doc: OpportunityDocument) {
    if (!confirm(`Delete document "${doc.documentName}"? This action cannot be undone.`)) return;
    this.docService.deleteDocument(doc.documentId).subscribe({
      next: (ok) => {
        if (ok) {
          this.fetchDocuments();
        } else {
          this.error = 'Failed to delete document.';
        }
      },
      error: () => {
        this.error = 'Failed to delete document.';
      }
    });
  }
}
