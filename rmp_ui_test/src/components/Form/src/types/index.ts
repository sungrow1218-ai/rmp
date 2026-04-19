import type {
  AutoCompleteProps,
  CascaderProps,
  CheckboxProps,
  DatePickerProps,
  InputNumberProps,
  InputProps,
  RadioProps,
  RateProps,
  SelectProps,
  SliderSingleProps,
  SwitchProps,
  TimePickerProps,
  TimeRangePickerProps,
  TransferProps,
  TreeSelectProps,
  UploadProps,
} from 'antd';
import type { MonthPickerProps, WeekPickerProps } from 'antd/es/date-picker';
import type { PasswordProps, SearchProps, TextAreaProps } from 'antd/es/input';
import type { IProps as ApiCascaderProps } from '../components/ApiCascader';
import type { IProps as ApiRadioGroupProps } from '../components/ApiRadioGroup';
import type { IProps as ApiSelectProps } from '../components/ApiSelect';
import type { IProps as ApiTreeProps } from '../components/ApiTree';
import type { IProps as MultipleSelectProps } from '@/components/MultipleSelectRebuild';
import { CheckboxGroupProps } from 'antd/es/checkbox';

type ColSpanType = number | string;
export interface ColEx {
  style?: any;
  /**
   * raster number of cells to occupy, 0 corresponds to display: none
   * @default none (0)
   * @type ColSpanType
   */
  span?: ColSpanType;

  /**
   * raster order, used in flex layout mode
   * @default 0
   * @type ColSpanType
   */
  order?: ColSpanType;

  /**
   * the layout fill of flex
   * @default none
   * @type ColSpanType
   */
  flex?: ColSpanType;

  /**
   * the number of cells to offset Col from the left
   * @default 0
   * @type ColSpanType
   */
  offset?: ColSpanType;

  /**
   * the number of cells that raster is moved to the right
   * @default 0
   * @type ColSpanType
   */
  push?: ColSpanType;

  /**
   * the number of cells that raster is moved to the left
   * @default 0
   * @type ColSpanType
   */
  pull?: ColSpanType;

  /**
   * <576px and also default setting, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xs?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥576px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  sm?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥768px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  md?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥992px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  lg?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥1200px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xl?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥1600px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xxl?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;
}

export interface ComponentProps {
  AutoComplete: AutoCompleteProps;
  Cascader: CascaderProps<Recordable>;
  Checkbox: CheckboxProps;
  CheckboxGroup: CheckboxGroupProps;
  DatePicker: DatePickerProps;
  TimePicker: TimePickerProps;
  WeekPicker: MonthPickerProps;
  MonthPicker: WeekPickerProps;
  RangePicker: TimeRangePickerProps;
  Input: InputProps;
  InputPassword: PasswordProps;
  InputNumber: InputNumberProps;
  InputSearch: SearchProps;
  InputTextArea: TextAreaProps;
  Radio: RadioProps;
  Rate: RateProps;
  Select: SelectProps;
  Switch: SwitchProps;
  Slider: SliderSingleProps;
  Transfer: TransferProps<Recordable>;
  TreeSelect: TreeSelectProps;
  Upload: UploadProps;
  ApiSelect: ApiSelectProps;
  ApiTree: ApiTreeProps;
  ApiCascader: ApiCascaderProps;
  ApiRadioGroup: ApiRadioGroupProps;
  MultipleSelect: MultipleSelectProps;
}

export type ComponentType = keyof ComponentProps;
