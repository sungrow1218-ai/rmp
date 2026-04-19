export interface PaginationProps {
  /**
   * total number of data items
   * @default 0
   * @type number
   */
  total?: number;
  /**
   * default initial page number
   * @default 1
   * @type number
   */
  defaultCurrent?: number;

  /**
   * current page number
   * @type number
   */
  current?: number;

  /**
   * default number of data items per page
   * @default 10
   * @type number
   */
  defaultPageSize?: number;

  /**
   * number of data items per page
   * @type number
   */
  pageSize?: number;

  /**
   * determine whether pageSize can be changed
   * @default false
   * @type boolean
   */
  showSizeChanger?: boolean;

  /**
   * to display the total number and range
   * @type Function
   */
  showTotal?: (total: number, range: [number, number]) => any;

  /**
   * specify the sizeChanger options
   * @default ['10', '20', '30', '40']
   * @type string[]
   */
  pageSizeOptions?: string[];

  /**
   * listen page change
   * @param pageId number of page
   * @param pageSize page size
   * @returns
   */
  onChange?: (pageId: number, pageSize: number) => void;

  /**
   * show jumper
   */
  showQuickJumper?: boolean;

  /**
   * size
   */
  size?: 'default' | 'small';
}
