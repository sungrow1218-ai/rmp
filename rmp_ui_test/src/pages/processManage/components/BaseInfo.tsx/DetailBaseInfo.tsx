import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';

import { DetailState, SearchFilterProps } from '../../contant/typing';
import moment from 'moment';

import RuleDetail from '../ChangeDetail/RuleDetail';

import { queryWorkGroup, WorkGroupList } from '@/services/account';

import styles from '../../styles.less';
import RuleRelat from './RelatTable';

import { useSize } from 'ahooks';
import { CHANGE_MODULE, PROCEDURE_TYPE } from '../../dict';
import ChangeMap from '../ChangeInfo';
import PoolDetailModal from '../ChangeDetail/PoolDetail';
import { useHeightResize } from '@/hooks';

interface Props {
  defaultValues: DetailState | undefined;

  form: InstanceType<any>;
  open: boolean;
  setOpen: (value: boolean) => void;
}

const ModeleMap = {
  '101': 'RuleChangeInfo',
  '102': 'RuleChangeInfo',
  '201': 'PoolLevelChangeInfo',
  '203': 'PoolDetailChangeInfo',
} as const;

type ModeleMapKeys = keyof typeof ModeleMap;
// type ModeleMapValues = typeof ModeleMap[ModeleMapKeys];

const useDebounce = (value: number, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timer = useRef<any>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, delay]);

  return debouncedValue;
};

const DetailBaseInfo = ({ defaultValues, form, open, setOpen }: Props) => {
  // useEffect(() => {
  //   const fetch = async () => {
  //     try {
  //       const resWorkGroup = await queryWorkGroup({
  //         pageId: 1,
  //         pageSize: 1000,
  //       });
  //       if (resWorkGroup.code !== 0) {
  //         throw new Error('获取工作台信息失败');
  //       }
  //       if (!resWorkGroup.data || resWorkGroup.data.resultList.length === 0) {
  //         throw new Error('未查询到账套信息');
  //       }

  //       setWorkGroupList(resWorkGroup.data.resultList);
  //     } catch (error) {}
  //   };
  //   fetch();
  // }, []);

  const textData = useMemo(() => {
    if (defaultValues) {
      const oldData: any = defaultValues.textBefore
        ? JSON.parse(defaultValues.textBefore)
        : '';
      const newData: any = defaultValues.textAfter
        ? JSON.parse(defaultValues.textAfter)
        : '';
      if (defaultValues.alterType !== 3) {
        return newData;
      } else {
        return oldData;
      }
    }
  }, [defaultValues]);

  const changeText = useMemo(() => {
    return defaultValues?.changeText
      ? JSON.parse(defaultValues?.changeText)
      : // JSON.parse(defaultValues?.changeText)
        false;
  }, [defaultValues]);
  console.log('====================================');
  console.log(changeText, textData);
  console.log('====================================');

  const isRelat = useMemo(() => {
    if (defaultValues) {
      const data: any = defaultValues.textAfter
        ? JSON.parse(defaultValues.textAfter)
        : null;
      if (defaultValues.alterType !== 3 && data && data.ruleRelaList?.length) {
        return true;
      }
      return false;
    }
    return false;
  }, [defaultValues]);

  const carRef = useRef(null);
  const size = useSize(carRef);
  const relatRef = useRef(null);
  const _size = useHeightResize(carRef);

  const height1 = useMemo(() => {
    if (size) {
      const carHeight = size?.height ?? 0;
      let _height = 250;
      if (isRelat) {
        _height = carHeight - 300;
      } else {
        _height = carHeight - 110;
      }

      return _height > 250 ? _height : 250;
    }
    return 250;
  }, [size, isRelat]);

  const height = useDebounce(height1, 500);

  const changePageType = useMemo(() => {
    const num = PROCEDURE_TYPE.find(
      (p) => p.code === String(defaultValues?.changeModule)
    )?.feKey;
    return Number(num);
  }, [defaultValues]);

  const ChangeInfo = useMemo(() => {
    if (defaultValues && defaultValues.changeText) {
      const renderName =
        ModeleMap[String(defaultValues.changeModule) as ModeleMapKeys];
      return ChangeMap[renderName];
    }
    return () => <div></div>;
  }, [defaultValues]);

  return (
    <div
      style={{
        flex: '1 auto',
      }}
      ref={carRef}
    >
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          className={styles.changeInfo}
          style={{ minHeight: '10px', overflow: 'hidden' }}
        >
          {changeText && changeText.length > 0 && (
            <ChangeInfo
              changeText={changeText}
              size={changePageType === 1 ? height : _size}
              status={defaultValues?.busiStatus}
            />
          )}
        </div>

        <div
          style={{ minHeight: '2px' }}
          className={styles.changeInfo}
          ref={relatRef}
        >
          {defaultValues && changePageType === 1 && (
            <RuleRelat data={textData} size={size?.height} />
          )}
        </div>
      </div>

      {open && changePageType === 1 && (
        <RuleDetail setOpen={setOpen} data={textData} />
      )}
      {open && defaultValues?.changeModule === 201 && (
        <PoolDetailModal setOpen={setOpen} data={textData} />
      )}
    </div>
  );
};

export default forwardRef(DetailBaseInfo);
