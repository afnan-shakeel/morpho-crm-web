import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-small',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './modal-small.html',
  styleUrl: './modal-small.css'
})
export class ModalSmall {

  @Input() modalId: string = 'dialog';
  @Output() closeModal: EventEmitter<void> = new EventEmitter();

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
  }
}
