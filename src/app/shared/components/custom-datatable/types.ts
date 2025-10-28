export enum CellTemplate {
    LINK = 'link',
    BADGE = 'badge',
    COLOR_BADGE = 'color-badge',
    SELECT_DROPDOWN = 'select-dropdown',
    DATE = 'date',
    TIME = 'time',
    DATETIME = 'datetime',

    // custom cell template for more complex rendering
    CUSTOM = 'custom'
}

// color badge color options
export enum ColorBadgeColor {
    RED = 'red',
    GREEN = 'green',
    BLUE = 'blue',
    ORANGE = 'orange',
    PURPLE = 'purple',
    GRAY = 'gray',
    YELLOW = 'yellow',
    TEAL = 'teal'
}

export interface DataTableColumn {
    field: string;
    label: string;
    hidden?: boolean;
    sortable?: boolean;
    width?: string;
    cellTemplate?: string; // Optional custom cell template identifier. eg: 'link', 'badge', etc.
    linkPrefix?: string; // Optional link prefix for 'link' cellTemplate
    linkSuffix?: string; // Optional link suffix for 'link' cellTemplate
    hrefField?: string; // Optional field to use for href in 'link' cellTemplate

}