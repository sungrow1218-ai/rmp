import React, { useEffect, useMemo, useState } from 'react';
import { deepMerge } from '@/utils/utils';
import { Modal } from '@ht/sprite-ui';
import { isFunction } from 'lodash';
import { buildUUID } from '@/utils/uuid';
import { ModalMethods, ModalProps } from './types';

const BasicModal: React.FC<Partial<ModalProps>> = (props) => {
  const uid = buildUUID();

  const [propsRef, setPropsRef] = useState<Partial<ModalProps> | null>(null);

  const getMergeProps = useMemo(() => {
    return { ...props, ...propsRef };
  }, [props, propsRef]);

  const modalMethods: ModalMethods = {
    setModalProps: (props: Partial<ModalProps>) => {
      setPropsRef((prev) => {
        const mergeProps = deepMerge(prev || ({} as any), props as any);
        return mergeProps;
      });
    },
  };

  useEffect(() => {
    if (props.onRegister) {
      props.onRegister(modalMethods, uid);
    }
  }, []);

  async function handleCancel(e: React.MouseEvent<HTMLElement>) {
    e?.stopPropagation();
    if (props.closeFunc && isFunction(props.closeFunc)) {
      // 关闭前执行，返回 true 则关闭，否则不关闭
      const isClose: boolean = await props.closeFunc();
      modalMethods.setModalProps({ open: !isClose });
      return;
    }
    modalMethods.setModalProps({ open: false });
    if (props.onCancel) {
      props.onCancel(e);
    }
  }

  return (
    <Modal {...getMergeProps} onCancel={handleCancel} destroyOnClose={true}>
      {props.children}
    </Modal>
  );
};

export default BasicModal;
