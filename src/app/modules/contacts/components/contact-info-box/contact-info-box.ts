import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Contact } from '../../types';
import { ContactAvatar } from '../contact-avatar/contact-avatar';

@Component({
  selector: 'app-contact-info-box',
  imports: [CommonModule, ContactAvatar],
  templateUrl: './contact-info-box.html',
  styleUrl: './contact-info-box.css'
})
export class ContactInfoBox {

  @Input() contactInfo: Contact | null = null;

}
