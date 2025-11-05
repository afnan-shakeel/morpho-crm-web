import { ColorBadgeColor } from '../../../shared/components/custom-datatable/types';
import { LeadStatus } from '../types';

/**
 * Color mapping utility for lead status
 * This utility provides consistent color mapping across different components
 */

/**
 * Color mapping for data table color badges
 * Used by the custom-datatable component
 * Note: Object mapping uses string keys for compatibility with data table component
 */
export const LEAD_STATUS_COLOR_MAPPING: { [key: string]: ColorBadgeColor } = {
  [LeadStatus.NEW]: ColorBadgeColor.BLUE,
  [LeadStatus.CONTACTED]: ColorBadgeColor.ORANGE,
  [LeadStatus.QUALIFIED]: ColorBadgeColor.TEAL,
  [LeadStatus.PROPOSAL]: ColorBadgeColor.PURPLE,
  [LeadStatus.NEGOTIATION]: ColorBadgeColor.YELLOW,
  [LeadStatus.CONVERTED]: ColorBadgeColor.GREEN,
  [LeadStatus.LOST]: ColorBadgeColor.RED,
  [LeadStatus.UNQUALIFIED]: ColorBadgeColor.GRAY,
};

/**
 * CSS class mapping for status badges
 * Used by standalone badge components that need custom styling
 */
export const LEAD_STATUS_CSS_CLASSES: { [key: string]: string } = {
  [LeadStatus.NEW]: 'bg-blue-50 text-blue-700 inset-ring-blue-600/10 dark:bg-blue-400/10 dark:text-blue-400 dark:inset-ring-blue-400/20',
  [LeadStatus.CONTACTED]: 'bg-orange-50 text-orange-700 inset-ring-orange-600/10 dark:bg-orange-400/10 dark:text-orange-400 dark:inset-ring-orange-400/20',
  [LeadStatus.QUALIFIED]: 'bg-teal-50 text-teal-700 inset-ring-teal-600/10 dark:bg-teal-400/10 dark:text-teal-400 dark:inset-ring-teal-400/20',
  [LeadStatus.PROPOSAL]: 'bg-purple-50 text-purple-700 inset-ring-purple-600/10 dark:bg-purple-400/10 dark:text-purple-400 dark:inset-ring-purple-400/20',
  [LeadStatus.NEGOTIATION]: 'bg-yellow-50 text-yellow-700 inset-ring-yellow-600/10 dark:bg-yellow-400/10 dark:text-yellow-400 dark:inset-ring-yellow-400/20',
  [LeadStatus.CONVERTED]: 'bg-green-50 text-green-700 inset-ring-green-600/10 dark:bg-green-400/10 dark:text-green-400 dark:inset-ring-green-400/20',
  [LeadStatus.LOST]: 'bg-red-50 text-red-700 inset-ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:inset-ring-red-400/20',
  [LeadStatus.UNQUALIFIED]: 'bg-gray-50 text-gray-700 inset-ring-gray-600/10 dark:bg-gray-400/10 dark:text-gray-400 dark:inset-ring-gray-400/20',
};

/**
 * Get the color badge color for a given lead status
 * @param status - The lead status
 * @returns ColorBadgeColor enum value
 */
export function getLeadStatusColor(status: LeadStatus | string): ColorBadgeColor {
  return LEAD_STATUS_COLOR_MAPPING[status] || ColorBadgeColor.GRAY;
}

/**
 * Get the CSS classes for a given lead status
 * @param status - The lead status
 * @returns CSS class string for badge styling
 */
export function getLeadStatusCssClasses(status: LeadStatus | string): string {
  return LEAD_STATUS_CSS_CLASSES[status] || LEAD_STATUS_CSS_CLASSES[LeadStatus.NEW];
}