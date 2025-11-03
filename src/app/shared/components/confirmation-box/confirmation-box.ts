import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-box',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './confirmation-box.html',
  styleUrl: './confirmation-box.css'
})
export class ConfirmationBox {
  @Output() cancelAction: EventEmitter<void> = new EventEmitter();
  @Output() confirmAction: EventEmitter<void> = new EventEmitter();

  @Input() message: string = 'Are you sure you want to proceed?';
  @Input() title: string = 'Please Confirm';
  @Input() confirmButtonText: string = 'Confirm';
  @Input() cancelButtonText: string = 'Cancel';
  

  ngOnDestroy() {
    // ensure to remove the trigger element if exists
    if (this.triggerElement) {
      document.body.removeChild(this.triggerElement);
      this.triggerElement = null;
    }
  }

  triggerElement: HTMLElement | null = null;
  modalId: string = 'confirmation-dialog';
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
  }

  onConfirm() {
    this.confirmAction.emit();
    this.close();
  }
  onCancel() {
    this.cancelAction.emit();
    this.close();
  }

}
