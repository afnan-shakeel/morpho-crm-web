import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-filter-box',
  imports: [ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './filter-box.html',
  styleUrl: './filter-box.css'
})


export class FilterBox {
  @Input() filterData: FilterData | null = null;
  @Output() applyFilters: EventEmitter<any> = new EventEmitter<any>();
  fb = inject(FormBuilder);

  filters = signal<Filters[]>([]);
  filterForm = this.fb.group({});

  ngOnInit() {
    if (this.filterData) {
      this.filters.set(this.filterData.filters);
      this.createForm();
    }
  }

  createForm() {
    this.filterData?.filters.forEach(filter => {
      this.filterForm.addControl(filter.field, this.fb.control(filter.value));
    });
  }

  onApplyFilters() {
    // update the filterData with current form values
    const updatedFilters = this.filterData?.filters.map(filter => {
      return {
        ...filter,
        value: this.filterForm.get(filter.field)?.value
      };
    });
    this.applyFilters.emit(updatedFilters);
  }

  onResetFilters() {
    this.filterForm.reset();
    // emit empty filters to indicate reset
    this.applyFilters.emit([]);
  }
}
