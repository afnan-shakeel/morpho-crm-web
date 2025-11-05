import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal-header',
  imports: [],
  templateUrl: './modal-header.html',
  styleUrl: './modal-header.css'
})
export class ModalHeader {

  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  close() {
    this.closeModal.emit();
  }
}
