import { useEffect, useState } from 'react';
import { isFunction } from 'lodash';
import {
  ModalMethods,
  ModalProps,
  RegisterFn,
  ReturnMethods,
  UseModalInnerReturnType,
  UseModalReturnType,
} from './types';

let globalDataMap: { [key: string]: any } = {};

const listeners = new Set();

const useDataMap = (): [
  { [key: string]: any },
  (data: { [key: string]: any }) => void
] => {
  const [dataMap, setDataMap] = useState(globalDataMap);

  const updateDataMap = (data: { [key: string]: any }): void => {
    setDataMap(data);
    globalDataMap = data;
    listeners.forEach((i) => (i as () => void)());
  };

  useEffect(() => {
    const listener = () => {
      setDataMap(globalDataMap);
    };
    listener();
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return [dataMap, updateDataMap];
};

export function useModal(): UseModalReturnType {
  const [modal, setModal] = useState<ModalMethods | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [uid, setUid] = useState<string>('');
  const [dataMap, updateDataMap] = useDataMap();

  function register(modalMethod: ModalMethods, uuid: string) {
    if (loaded && modalMethod === modal) {
      return;
    }
    setUid(uuid);
    setModal(modalMethod);
    setLoaded(true);
  }

  const getInstance = () => {
    if (!modal) {
      throw new Error(`useModal instance is undefined!`);
    }
    return modal;
  };

  const methods: ReturnMethods = {
    setModalProps: (props: Partial<ModalProps>): void => {
      getInstance()?.setModalProps(props);
    },
    openModal: <T = any>(open = true, data?: T, openOnSet = true): void => {
      getInstance()?.setModalProps({ open });
      if (!data) {
        return;
      }
      if (openOnSet) {
        updateDataMap({ ...dataMap, [uid]: data });
      }
    },
    closeModal: (): void => {
      getInstance()?.setModalProps({ open: false });
    },
  };
  return [register, methods];
}

export const useModalInner = (
  props: { onRegister: RegisterFn },
  callbackFn?: Fn
): UseModalInnerReturnType => {
  const [modalInstance, setModalInstance] =
    useState<Nullable<ModalMethods>>(null);

  const [uid, setUid] = useState('');

  const [dataMap] = useDataMap();

  const getInstance = () => {
    if (!modalInstance) {
      throw new Error(`useModalInner instance is undefined!`);
    }
    return modalInstance;
  };

  const register = (modalMethods: ModalMethods, uuid: string) => {
    setUid(uuid);
    setModalInstance(modalMethods);
  };

  useEffect(() => {
    if (props.onRegister && uid) {
      props.onRegister(modalInstance as ModalMethods, uid);
    }
  }, [uid]);

  useEffect(() => {
    if (!callbackFn || !isFunction(callbackFn)) {
      return;
    }
    if (dataMap[uid]) {
      callbackFn(dataMap[uid]);
    }
  }, [dataMap]);

  return [
    register,
    {
      setModalProps: (propsRef: Partial<ModalProps>) => {
        getInstance()?.setModalProps(propsRef);
      },
      closeModal: () => {
        getInstance()?.setModalProps({ open: false });
      },
    },
  ];
};
