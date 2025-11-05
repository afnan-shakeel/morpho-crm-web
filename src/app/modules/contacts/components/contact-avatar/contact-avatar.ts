import { Component, Input, computed } from '@angular/core';
import { getContactInitials } from '../../utils/get-contact-initials';

@Component({
  selector: 'app-contact-avatar',
  imports: [],
  templateUrl: './contact-avatar.html',
  styleUrl: './contact-avatar.css'
})
export class ContactAvatar {
  @Input() name: string = '';
  @Input() avatarSize: 'small' | 'medium' | 'large' = 'medium';

  readonly initials = computed(() => getContactInitials(this.name));

  readonly sizeClass = computed(() => {
    switch (this.avatarSize) {
      case 'small':
        return 'size-6 text-xs';
      case 'medium':
        return 'size-10 text-md';
      case 'large':
        return 'size-12 text-lg';
      default:
        return 'size-8 text-sm';
    }
  });
}
