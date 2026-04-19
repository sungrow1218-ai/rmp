import { FormSchema } from '@/components/Form';
import { DENOM_TYPES__MAP, SECURITY_CONTROL_TYPES__MAP } from '@/utils/dict';
import { queryFutureOptionLimitGroup } from '@/services/FutureOption';
import { FORM_MODES } from '@/pages/ruleSetting/constant';
import { transformDictToSelectOptions } from '@/utils/utils';

type DenomType = keyof typeof DENOM_TYPES__MAP;
const getDenomInfo = (p: DenomType) => DENOM_TYPES__MAP[p];
const validKeys: DenomType[] = Object.keys(DENOM_TYPES__MAP) as DenomType[];
export const denom = validKeys.map(getDenomInfo);

interface Props {
  mode: keyof typeof FORM_MODES;
  securityControlType?: number;
}

export const getSchemas = (param: Props): FormSchema[] => {
  return [
    {
      field: '19997',
      label: '分母',
      component: 'Select',
      componentProps: ({ formAction, formModel }) => {
        let option: { label: string; value: string }[] = [];
        if (param?.securityControlType) {
          if ([2, 10].includes(param?.securityControlType)) {
            option = transformDictToSelectOptions([
              DENOM_TYPES__MAP.KEY_9,
              DENOM_TYPES__MAP.KEY_10,
              DENOM_TYPES__MAP.KEY_19,
            ]);
          }
          if (
            param?.securityControlType ===
              Number(SECURITY_CONTROL_TYPES__MAP.KEY_4.code) ||
            param?.securityControlType ===
              Number(SECURITY_CONTROL_TYPES__MAP.KEY_1.code) ||
            param?.securityControlType ===
              Number(SECURITY_CONTROL_TYPES__MAP.KEY_3.code)
          ) {
            option = transformDictToSelectOptions([
              DENOM_TYPES__MAP.KEY_9,
              DENOM_TYPES__MAP.KEY_10,
              DENOM_TYPES__MAP.KEY_19,
              DENOM_TYPES__MAP.KEY_20,
              DENOM_TYPES__MAP.KEY_27,
            ]);
          }
          if (
            param?.securityControlType ===
            Number(SECURITY_CONTROL_TYPES__MAP.KEY_6.code)
          ) {
            option = transformDictToSelectOptions([DENOM_TYPES__MAP.KEY_20]);
            const filterList = transformDictToSelectOptions(denom)
              .filter((r) => r.value !== '20')
              .map((p) => p.value);
            if (filterList.includes(formModel['19997'])) {
              formAction.setFieldValue('19997', undefined);
            }
          }
          if (
            param?.securityControlType ===
            Number(SECURITY_CONTROL_TYPES__MAP.KEY_8.code)
          ) {
            option = transformDictToSelectOptions([DENOM_TYPES__MAP.KEY_27]);
            const filterList = transformDictToSelectOptions(denom)
              .filter((r) => r.value !== '27')
              .map((p) => p.value);
            console.log(filterList, 'filterList', formModel['19997']);

            if (filterList.includes(formModel['19997'])) {
              formAction.setFieldValue('19997', undefined);
            }
          }
        }

        if (formModel['19997'] === '20') {
          if (
            param?.securityControlType &&
            ![
              Number(SECURITY_CONTROL_TYPES__MAP.KEY_4.code),
              Number(SECURITY_CONTROL_TYPES__MAP.KEY_1.code),
              Number(SECURITY_CONTROL_TYPES__MAP.KEY_3.code),
              Number(SECURITY_CONTROL_TYPES__MAP.KEY_6.code),
            ].includes(param?.securityControlType)
          ) {
            formAction.setFieldValue('19997', null);
          }
        }
        if (formModel['19997'] === '27') {
          if (
            param?.securityControlType &&
            ![
              Number(SECURITY_CONTROL_TYPES__MAP.KEY_4.code),
              Number(SECURITY_CONTROL_TYPES__MAP.KEY_1.code),
              Number(SECURITY_CONTROL_TYPES__MAP.KEY_3.code),
              Number(SECURITY_CONTROL_TYPES__MAP.KEY_8.code),
            ].includes(param?.securityControlType)
          ) {
            formAction.setFieldValue('19997', null);
          }
        }
        return {
          options: option,
          onChange(value) {
            formAction.setFieldsValue({
              101: undefined,
            });
          },
          style: { width: '240px' },
        };
      },
    },
    {
      field: '101',
      label: '限仓分组',
      component: 'ApiSelect',
      ifShow: ({ values }) => {
        return values['19997'] === '27' || values['19997'] === '20';
      },
      required: true,
      componentProps: {
        api: async (params: any) => {
          const {
            data: { resultList },
          } = await queryFutureOptionLimitGroup(params);
          return resultList.map((i: any) => ({
            label: `${i.groupId}-${i.groupName}`,
            value: `${i.groupId}`,
            ...i,
          }));
        },
        params: {
          pageId: 1,
          pageSize: 5000,
          authFlag: param.mode === 'PREVIEW' ? 0 : 1,
        },
        style: { width: '240px' },
      },
    },
    {
      field: '192',
      label: '股票可转债合并控制',
      component: 'Select',
      required: true,
      labelWidth: '170px',
      defaultValue: '0',
      componentProps: ({ formAction }) => {
        return {
          options: [
            { label: '关闭', value: '0' },
            { label: '开启', value: '1' },
          ],
          onChange(value, option) {
            formAction.setFieldValue('3', null);
            // if (!formModel['192']) {
            //   formAction.setFieldValue('192', '1');
            // }
          },
          style: { width: '240px' },
        };
      },
    },
    {
      field: '3',
      label: '持仓类型',
      component: 'Select',
      required: true,
      defaultValue: '-1',
      componentProps: ({ formAction, formModel }) => {
        if (formModel['192'] === '1') {
          return {
            options: [
              { label: '不区分', value: '-1' },
              { label: '3-多仓（看涨）', value: '3' },
            ],
            style: { width: '240px' },
          };
        }
        return {
          options: [
            { label: '不区分', value: '-1' },
            { label: '0-权利仓', value: '0' },
            { label: '1-义务仓', value: '1' },
            { label: '3-多仓（看涨）', value: '3' },
            { label: '4-空仓（看跌）', value: '4' },
          ],
          style: { width: '240px' },
        };
      },
      // {
      //   options: [
      //     { label: '不区分', value: '-1' },
      //     { label: '0-权利仓', value: '0' },
      //     { label: '1-义务仓', value: '1' },
      //     { label: '3-多仓（看涨）', value: '3' },
      //     { label: '4-空仓（看跌）', value: '4' },
      //   ],
      //   style: { width: '240px' },
      // },
    },
    {
      field: '49',
      label: '持仓用途',
      component: 'Select',
      componentProps: ({ formAction, formModel }) => {
        if (formModel['192'] === '1' && formModel['49'] === '1') {
          formAction.setFieldValue('49', undefined);
        }
        if (formModel['192'] === '1') {
          return {
            allowClear: true,
            options: [
              { label: '不区分', value: '-1' },
              // { label: '1-交易所质押式回购质押券', value: '1' },
            ],
            style: { width: '240px' },
          };
        }
        return {
          allowClear: true,
          options: [
            { label: '不区分', value: '-1' },
            { label: '1-交易所质押式回购质押券', value: '1' },
          ],
          style: { width: '240px' },
        };
      },
    },
  ];
};
