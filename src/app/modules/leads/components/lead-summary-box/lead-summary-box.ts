import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Lead } from '../../types';

@Component({
  selector: 'app-lead-summary-box',
  imports: [DatePipe],
  templateUrl: './lead-summary-box.html',
  styleUrl: './lead-summary-box.css'
})
export class LeadSummaryBox {

  @Input() lead: Lead | null = null;

}
