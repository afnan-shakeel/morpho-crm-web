import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-medium',
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './modal-medium.html',
  styleUrl: './modal-medium.css'
})
export class ModalMedium implements AfterViewInit {

  @Input() modalId: string = 'dialog';
  @Input() preventAutoClose: boolean = false; // Flag to prevent auto-closing on outside click
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  

  ngAfterViewInit() {
    // const backdropEl = document.getElementById('modal-backdrop');
    // if (this.preventAutoClose) {
    //   // Disable closing on backdrop click
    //   if (backdropEl) {
    //     backdropEl.style.display = 'block';
    //   }
    // } else {
    //   // Enable closing on backdrop click
    //   if (backdropEl) {
    //     backdropEl.style.display = 'none';
    //   }
    // }
  }

  ngOnDestroy() {
    // ensure to remove the trigger element if exists
    if (this.triggerElement) {
      document.body.removeChild(this.triggerElement);
      this.triggerElement = null;
    }
  }

  triggerElement: HTMLElement | null = null;
  open() {
    // create a temp button element to trigger the modal open command
    this.triggerElement = document.createElement('button');
    this.triggerElement.setAttribute('command', 'show-modal');
    this.triggerElement.setAttribute('commandfor', this.modalId);
    document.body.appendChild(this.triggerElement);
    this.triggerElement.click();
  }

  close() {
    if (this.triggerElement) {
      this.triggerElement.setAttribute('command', 'close');
      this.triggerElement.click();
      document.body.removeChild(this.triggerElement);
      this.triggerElement = null;
    }
    this.closeModal.emit();
  }

  onDialogClick(event: Event) {
    // This method is kept for potential future use
    // The actual backdrop click prevention is handled in ngAfterViewInit
    // by listening to the el-dialog's close event
  }
}
