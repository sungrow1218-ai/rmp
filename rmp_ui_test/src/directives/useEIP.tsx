import { MutableRefObject, useEffect, useRef } from 'react';
import { applyDirective } from '.';
import { message } from '@ht/sprite-ui';
import { isEip, isInPage } from '@/utils/utils';
import { debounce } from 'lodash';

const useEIP = (): [
  boolean,
  (instance: HTMLAnchorElement | HTMLButtonElement | null) => void
] => {
  const refs: MutableRefObject<HTMLElement[]> = useRef([]);

  const cleanups: MutableRefObject<(() => void)[]> = useRef([]);

  const refreshBind = debounce(() => {
    // 解除绑定事件
    cleanups.current.forEach((i) => i());
    // 去除已销毁的节点
    const elements = refs.current.filter(isInPage) || [];
    // 重新绑定
    for (const ref of elements) {
      const cleanup = applyDirective(ref, 'eipInterceptor', {
        value: (e: React.PointerEvent) => {
          // console.log('监听事件', e);
          // TODO 是否拦截以及拦截后的操作
          if (isEip()) {
            message.warn(
              '该页面无权限，请前往堡垒机或者业务云操作，操作地址为http://eipnew.htsc.com.cn/aegis'
            );
            e.stopPropagation();
          }
        },
        arg: 'click',
      });
      cleanups.current.push(cleanup);
    }
  });

  // 初始化绑定
  useEffect(() => {
    refreshBind();
    return () => {
      // 解除绑定事件
      cleanups.current.forEach((i) => i());
    };
  }, []);

  return [
    isEip(),
    (ref: Nullable<HTMLElement>) => {
      if (ref) {
        const isExist = refs.current.find((i) => i === ref);
        if (!isExist) {
          refs.current.push(ref);
          refreshBind();
        }
      }
    },
  ];
};

export default useEIP;
