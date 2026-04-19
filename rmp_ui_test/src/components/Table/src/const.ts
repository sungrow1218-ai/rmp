const defaultSortFn = (sortInfo: any) => {
  const { field, order } = sortInfo;
  if (field && order) {
    return {
      // The sort field passed to the backend you
      field,
      // Sorting method passed to the background asc/desc
      order,
    };
  } else {
    return {};
  }
};

const defaultFilterFn = (data: Partial<Recordable<string[]>>) => {
  return data;
};

export const ROW_KEY = 'key';

// Optional display number per page;
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

// Number of items displayed per page
export const PAGE_SIZE = 10;

// Common interface field settings
export const FETCH_SETTING = {
  // The field name of the current page passed to the background
  pageField: 'page',
  // The number field name of each page displayed in the background
  sizeField: 'pageSize',
  // Field name of the form data returned by the interface
  listField: 'items',
  // Total number of tables returned by the interface field name
  totalField: 'totalSize',
};

// Default Size
export const DEFAULT_SIZE = 'middle';

// Configure general sort function
export const DEFAULT_SORT_FN = defaultSortFn;

export const DEFAULT_FILTER_FN = defaultFilterFn;

//  Default layout of table cells
export const DEFAULT_ALIGN = 'center';

export const INDEX_COLUMN_FLAG = 'INDEX';

export const ACTION_COLUMN_FLAG = 'ACTION';
