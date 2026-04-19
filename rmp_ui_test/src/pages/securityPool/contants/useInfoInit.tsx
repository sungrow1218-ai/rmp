import React, {
  createContext,
  useContext,
  useState,
  FC,
  PropsWithChildren,
  useEffect,
} from 'react';
import { ExternSystemState } from '@/pages/roleManage/contant/typing';
import { QuerySecuPoolRspDto, SecurityPoolResponseDTO } from './tyeping';
import { queryExternSystem } from '@/services/roleManage';
import { useSobInfo } from './useSobInfo';

export interface SelectOption {
  label: string;
  value: number;
  [key: string]: any;
}

interface ListContextType {
  workGroupId: number;
  setWorkGroupId: (id: number) => void;

  workGourpList: SelectOption[];
  secuPoolData: QuerySecuPoolRspDto[];
  setSecuPoolData: (data: QuerySecuPoolRspDto[]) => void;
  secuPoolLayerData: SecurityPoolResponseDTO[];
  setSecuPoolLayerData: (data: SecurityPoolResponseDTO[]) => void;
  secuPoolLayerAuthData: SecurityPoolResponseDTO[];
  setSecuPoolLayerAuthData: (data: SecurityPoolResponseDTO[]) => void;
  externSystem: ExternSystemState[];
}

const ListContext = createContext<ListContextType | undefined>(undefined);
export const MyList: FC<PropsWithChildren> = (props) => {
  const [workGroupId, setWorkGroupId] = useState(-1);

  const workGroupAuth = useSobInfo();
  const [workGourpList, setWorkGourpList] = useState<SelectOption[]>([]);
  const [secuPoolData, setSecuPoolData] = useState<QuerySecuPoolRspDto[]>([]);
  const [secuPoolLayerData, setSecuPoolLayerData] = useState<
    SecurityPoolResponseDTO[]
  >([]);
  const [secuPoolLayerAuthData, setSecuPoolLayerAuthData] = useState<
    SecurityPoolResponseDTO[]
  >([]);

  useEffect(() => {
    if (workGroupAuth.length) {
      const data = workGroupAuth.map((p) => ({
        label: p.workGroupName,
        value: p.workGroupId,
        ...p,
      }));
      setWorkGourpList(data);
    }
  }, [workGroupAuth]);
  const [externSystem, setExternSystem] = useState<ExternSystemState[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [resExternSystem] = await Promise.all([
          queryExternSystem({ pageId: 1, pageSize: 5000, authFlag: 1 }),
        ]);
        if (resExternSystem.code !== 0) {
          throw new Error('获取系统号失败');
        }

        setExternSystem(resExternSystem.data?.resultList);
      } catch (error) {}
    };
    fetch();
  }, []);
  return (
    <ListContext.Provider
      value={{
        workGroupId,
        setWorkGroupId,
        workGourpList,
        secuPoolData,
        setSecuPoolData,
        secuPoolLayerData,
        setSecuPoolLayerData,
        secuPoolLayerAuthData,
        setSecuPoolLayerAuthData,
        externSystem,
      }}
    >
      {props.children}
    </ListContext.Provider>
  );
};
export const useInfoInit = () => useContext(ListContext);
