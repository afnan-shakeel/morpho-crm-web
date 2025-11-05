import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Lead, LeadStatus } from '../../types';

@Component({
  selector: 'app-lead-status-change-box',
  imports: [CommonModule, FormsModule],
  templateUrl: './lead-status-change-box.html',
  styleUrl: './lead-status-change-box.css'
})
export class LeadStatusChangeBox {
  @Input() lead: Lead | null = null;
  @Input() leadStatusOptions: { label: string; value: string }[] = [];
  newStatus = signal<LeadStatus | null>(null);

  @Output() statusChange: EventEmitter<LeadStatus | null> = new EventEmitter<LeadStatus | null>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['lead'] && this.lead) {
      this.newStatus.set(this.lead.leadStatus);
    }
  }

  onStatusChange() {
    if (this.newStatus() && this.newStatus() !== this.lead?.leadStatus) {
      this.statusChange.emit(this.newStatus());
    }
  }

  onCancel() {
    this.newStatus.set(null);
    this.lead = null;
    this.cancel.emit();
  }
}
