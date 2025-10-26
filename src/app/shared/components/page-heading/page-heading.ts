import { Component, Input } from '@angular/core';
import { Breadcrumbs } from "../breadcrumbs/breadcrumbs";

@Component({
  selector: 'app-page-heading',
  imports: [Breadcrumbs],
  templateUrl: './page-heading.html',
  styleUrl: './page-heading.css'
})
export class PageHeading {

  // take input: page heading, breadcrumbs (label and path), description, action buttons (label, click event)
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() breadcrumbs: { label: string; path: string }[] = [];
  @Input() actionButtons: { label: string; onClick: () => void }[] = [];

}
