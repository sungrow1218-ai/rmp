import { FormSchema } from '@/components/Form';
import { FORM_MODES } from '@/pages/ruleSetting/constant';
import { querySeatGroup } from '@/services/seatGroup';
import {
  DIMENSION_CONTROL_TYPES__MAP,
  RULE_CONTROL_DIM,
  transformDictFeKeyToCodeHelper,
} from '@/utils/dict';

interface Props {
  mode: keyof typeof FORM_MODES;
  unionControlType?: number;
  securityControlType?: number;
}
export const getSchemas = (param: Props): FormSchema[] => {
  return [
    {
      field: 'controlAcctType',
      label: '账户控制类型',
      component: 'Select',
      required: true,
      defaultValue: 4,
      componentProps: ({ formAction, formModel }) => {
        return {
          options: [
            {
              label: '席位组',
              value: Number(
                `${transformDictFeKeyToCodeHelper(
                  'BY_SEAT_GROUP',
                  RULE_CONTROL_DIM
                )}`
              ),
            },
          ],
          style: { width: '240px' },
        };
      },
    },
    {
      field: 'unionControlType',
      label: '联合控制模式',
      component: 'Select',
      required: true,
      defaultValue: 0,
      componentProps: ({ formModel, formAction }) => {
        return {
          options: [DIMENSION_CONTROL_TYPES__MAP.INDEPENDENT].map((cdt) => {
            return {
              label: `${cdt.code}-${cdt.name}`,
              value: Number(cdt.code),
            };
          }),
          style: { width: '240px' },
        };
      },
    },
    {
      field: 'controlAcctList',
      label: '席位组列表',
      required: true,
      component: 'ApiSelect',
      componentProps: {
        api: async (params: any) => {
          const {
            data: { resultList },
          } = await querySeatGroup(params);
          return resultList.map((i: any) => ({
            label: `${i.seatGroupId}-${i.seatGroupName}`,
            value: `${i.seatGroupId}`,
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
  ];
};
