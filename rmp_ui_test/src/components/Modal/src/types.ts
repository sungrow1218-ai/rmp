import type { ModalProps as HtModalProps } from '@ht/sprite-ui/lib/modal';

export interface ModalProps extends HtModalProps {
  onRegister: RegisterFn;
  closeFunc: () => Promise<any>;
}

export interface ModalMethods {
  setModalProps: (props: Partial<ModalProps>) => void;
}

export type RegisterFn = (modalMethods: ModalMethods, uuid: string) => void;

export interface ReturnMethods extends ModalMethods {
  openModal: <T = any>(props?: boolean, data?: T, openOnSet?: boolean) => void;
  closeModal: () => void;
  // getOpen?: boolean;
}

export type UseModalReturnType = [RegisterFn, ReturnMethods];

export interface ReturnInnerMethods extends ModalMethods {
  closeModal: () => void;
  // getOpen?: boolean;
}

export type UseModalInnerReturnType = [RegisterFn, ReturnInnerMethods];
