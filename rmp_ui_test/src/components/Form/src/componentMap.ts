import {
  AutoComplete,
  Cascader,
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  Transfer,
  TreeSelect,
  Upload,
} from 'antd';
import ApiCascader from './components/ApiCascader';
import ApiRadioGroup from './components/ApiRadioGroup';
import ApiSelect from './components/ApiSelect';
import ApiTree from './components/ApiTree';
import MultipleSelect from '@/components/MultipleSelectRebuild';

import type { ComponentType } from './types';

export const componentMap: {
  [K in ComponentType]: any;
} = {
  Input,
  InputPassword: Input.Password,
  InputSearch: Input.Search,
  InputTextArea: Input.TextArea,
  AutoComplete,
  Cascader,
  Checkbox,
  CheckboxGroup: Checkbox.Group,
  DatePicker,
  TimePicker: DatePicker.TimePicker,
  WeekPicker: DatePicker.WeekPicker,
  MonthPicker: DatePicker.MonthPicker,
  RangePicker: DatePicker.RangePicker,
  InputNumber,
  Radio,
  Rate,
  Select,
  Switch,
  Slider,
  Transfer,
  TreeSelect,
  Upload,
  ApiCascader,
  ApiRadioGroup,
  ApiSelect,
  ApiTree,
  MultipleSelect,
};
