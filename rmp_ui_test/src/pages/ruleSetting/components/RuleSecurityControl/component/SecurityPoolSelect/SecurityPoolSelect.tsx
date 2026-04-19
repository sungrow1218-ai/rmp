import React, {
  CSSProperties,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FC,
} from 'react';
import { FORM_MODES } from '@/pages/ruleSetting/constant';
import MultipleSelect from '@/components/MultipleSelectRebuild';
import { Dropdown, Empty, Input } from 'antd';
import DisabledContext from 'antd/es/config-provider/DisabledContext';
import { SearchOutlined } from '@ant-design/icons';
import NoDataSimpleSvg from '@/assets/empty/noDataSimple.svg';
import Highlighter from 'react-highlight-words';
import { querySecurityPool } from '@/services/securityPool/index';

interface Props {
  mode: keyof typeof FORM_MODES;
  value?: number[];
  onChange?: (value: number[]) => void;
  style?: CSSProperties;
}

type IndexOption = {
  label: string;
  value: number;
};

const SecurityPoolSelect: FC<Props> = ({
  value = [],
  onChange,
  mode,
  style = {},
}) => {
  const [options, setOptions] = useState<IndexOption[]>([]);

  const disabled = useContext(DisabledContext);

  useEffect(() => {
    async function fetchIndexList() {
      try {
        const { data, code } = await querySecurityPool({
          pageId: 1,
          pageSize: 1000,
          authorityFlag: mode === 'PREVIEW' ? 0 : 1,
        });
        if (code !== 0) {
          throw new Error('证券池列表获取失败');
        }
        const compOptions = (data?.resultList || []).map((li) => {
          return {
            label: `${li.secuPoolId} ${li.secuPoolName}`,
            value: li.secuPoolId,
          };
        });
        setOptions(compOptions);
      } catch (e) {}
    }
    fetchIndexList();
  }, []);

  const renderSelect = () => (
    <MultipleSelect
      options={options}
      value={value}
      style={style}
      showPopup={disabled}
      onChange={(values: number[]) => onChange && onChange(values)}
    />
  );

  // 静态展示
  const [keyword, setKeyword] = useState<string>();

  // 过滤选中(优化性能)
  const getRealValuesOptions = useMemo(
    () => options.filter((i) => (value || []).includes(i.value)),
    [value, options]
  );

  // 搜索过滤
  const getFilterOptions = useMemo(() => {
    if (keyword) {
      return getRealValuesOptions.filter((i) => i.label.includes(keyword));
    } else {
      return getRealValuesOptions;
    }
  }, [getRealValuesOptions, keyword]);

  const renderOptionItem = (item: { label: string; value: number }) => (
    <div
      aria-selected="false"
      className="disabled-dropdown-option-item"
      title={item.label}
      key={item.value}
    >
      <Highlighter
        searchWords={[keyword as string]}
        textToHighlight={item.label}
        highlightStyle={{ color: '#1890ff', background: 'transparent' }}
      />
    </div>
  );

  if (disabled) {
    return (
      <Dropdown
        onOpenChange={() => setKeyword('')}
        popupRender={() => (
          <div
            className="disabled-dropdown"
            style={{ width: style.width || '240px' }}
          >
            {getRealValuesOptions.length >= 2 ? (
              <div>
                <Input
                  value={keyword}
                  placeholder="请输入"
                  style={{ width: '100%' }}
                  disabled={false}
                  onChange={(e) => setKeyword(e.target.value)}
                  suffix={<SearchOutlined />}
                  allowClear={true}
                />
              </div>
            ) : null}
            <div>
              <div style={{ maxHeight: 256, overflow: 'auto' }}>
                {getFilterOptions.length === 0 ? (
                  <Empty
                    style={{ margin: '16px 0' }}
                    image={NoDataSimpleSvg}
                    description={'暂无数据'}
                  />
                ) : (
                  getFilterOptions.map((item) => renderOptionItem(item))
                )}
              </div>
            </div>
          </div>
        )}
      >
        {renderSelect()}
      </Dropdown>
    );
  } else {
    return renderSelect();
  }
};

export default SecurityPoolSelect;
