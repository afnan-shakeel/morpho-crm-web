import { ColorBadgeColor } from '../../../shared/components/custom-datatable/types';
import { AccountStatusEnum } from '../types/account';

/**
 * Color mapping utility for account status
 * This utility provides consistent color mapping across different components
 */

/**
 * Color mapping for data table color badges
 * Used by the custom-datatable component
 * Note: Object mapping uses string keys for compatibility with data table component
 */
export const ACCOUNT_STATUS_COLOR_MAPPING: { [key: string]: ColorBadgeColor } = {
  [AccountStatusEnum.ACTIVE]: ColorBadgeColor.GREEN,
  [AccountStatusEnum.INACTIVE]: ColorBadgeColor.RED,
  [AccountStatusEnum.PENDING]: ColorBadgeColor.ORANGE,
};

/**
 * CSS class mapping for status badges
 * Used by standalone badge components that need custom styling
 */
export const ACCOUNT_STATUS_CSS_CLASSES: { [key: string]: string } = {
  [AccountStatusEnum.ACTIVE]: 'bg-green-50 text-green-700 inset-ring-green-600/10 dark:bg-green-400/10 dark:text-green-400 dark:inset-ring-green-400/20',
  [AccountStatusEnum.INACTIVE]: 'bg-red-50 text-red-700 inset-ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:inset-ring-red-400/20',
  [AccountStatusEnum.PENDING]: 'bg-orange-50 text-orange-700 inset-ring-orange-600/10 dark:bg-orange-400/10 dark:text-orange-400 dark:inset-ring-orange-400/20',
};

/**
 * Get the color badge color for a given account status
 * @param status - The account status
 * @returns ColorBadgeColor enum value
 */
export function getAccountStatusColor(status: AccountStatusEnum | string): ColorBadgeColor {
  return ACCOUNT_STATUS_COLOR_MAPPING[status] || ColorBadgeColor.GRAY;
}

/**
 * Get the CSS classes for a given account status
 * @param status - The account status
 * @returns CSS class string for badge styling
 */
export function getAccountStatusCssClasses(status: AccountStatusEnum | string): string {
  return ACCOUNT_STATUS_CSS_CLASSES[status] || ACCOUNT_STATUS_CSS_CLASSES[AccountStatusEnum.ACTIVE];
}
