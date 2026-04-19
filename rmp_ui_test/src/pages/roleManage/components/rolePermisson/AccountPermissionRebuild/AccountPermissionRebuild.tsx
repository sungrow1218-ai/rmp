import React, { useContext, useEffect, useState } from 'react';
import styles from './style.less';
import { ListContext } from '@/hooks/useListClick';
import { queryExternSystem } from '@/services/roleManage';
import { BookTypeEnum } from '@/pages/ruleSetting/components/RuleDimensionControl/component/ControlAcctTypeSelect';
import { Card, Col, Empty, Row, Spin } from '@ht/sprite-ui';
import TitleImgSrc from '@/assets/common/card-title-icon.png';
import AccountPanel from './AccountPanel';
import { ExtSystemItem } from './data';
import NoDataSimpleSvg from '@/assets/empty/noDataSimple.svg';

const AccountPermission = () => {
  const { selectedItem } = useContext(ListContext);

  const [loading, setLoading] = useState(false);
  const [tradeSystems, setTradeSystems] = useState<ExtSystemItem[]>([]);
  const [manageSystems, setManageSystems] = useState<ExtSystemItem[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<ExtSystemItem | null>(
    null
  );
  // ✅ 新增：用于交易账户当前选中的系统
  const [selectedTradeSystem, setSelectedTradeSystem] =
    useState<ExtSystemItem | null>(null);
  // 查询对接系统
  const queryAllExternSystem = async () => {
    setTradeSystems([]);
    setManageSystems([]);
    try {
      setLoading(true);
      const res = await queryExternSystem({
        pageId: 1,
        pageSize: 5000,
        authFlag: 0,
      });
      if (res.code !== 0) {
        throw Error('查询对接系统失败');
      }
      const tSystems: ExtSystemItem[] = [];
      const mSystems: ExtSystemItem[] = [];
      for (const item of res.data.resultList) {
        tSystems.push({
          extSysId: item.extSysId,
          extSysName: item.extSysName,
          bookType: BookTypeEnum.TRADE_ACCOUNT,
        });
        mSystems.push({
          extSysId: item.extSysId,
          extSysName: item.extSysName,
          bookType: BookTypeEnum.MANAGE_ACCOUNT,
        });
      }
      setTradeSystems(tSystems);
      setManageSystems(mSystems);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      queryAllExternSystem();
    }
  }, [selectedItem]);

  useEffect(() => {
    if (manageSystems.length > 0 && !selectedSystem) {
      setSelectedSystem(manageSystems[0]);
    }
  }, [manageSystems, selectedSystem]);

  // ✅ 初始化交易账户默认系统
  useEffect(() => {
    if (tradeSystems.length > 0 && !selectedTradeSystem) {
      setSelectedTradeSystem(tradeSystems[0]);
    }
  }, [tradeSystems, selectedTradeSystem]); // 注意：依赖 selectedTradeSystem 防止重复设置

  return (
    <div className={styles.wrap} style={{ height: '100%' }}>
      <Row gutter={16} style={{ height: '100%' }}>
        <Col span={12} style={{ height: '100%', display: 'flex' }}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={TitleImgSrc} className={styles.logo} />
                <span className={styles.titleText}>管理账户权限</span>
              </div>
            }
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
            bodyStyle={{
              flex: 1,
              padding: 0,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {manageSystems.length === 0 ? (
              <div style={{ width: '100%', height: '100%', display: 'flex' }}>
                <Empty
                  style={{ width: '100%', alignSelf: 'center' }}
                  image={NoDataSimpleSvg}
                  description={'暂无数据'}
                />
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: 'flex',
                    overflowX: 'auto',
                    borderBottom: '1px solid #e8e8e8',
                    padding: '0 16px',
                    gap: '8px',
                  }}
                >
                  {manageSystems.map((i) => (
                    <div
                      key={i.extSysId}
                      onClick={() => setSelectedSystem(i)}
                      style={{
                        whiteSpace: 'nowrap',
                        padding: '12px 16px',
                        cursor: 'pointer',
                        fontWeight:
                          selectedSystem?.extSysId === i.extSysId
                            ? 'bold'
                            : 'normal',
                        color:
                          selectedSystem?.extSysId === i.extSysId
                            ? '#bb744a'
                            : '#595959',
                        borderBottom:
                          selectedSystem?.extSysId === i.extSysId
                            ? '2px solid #bb744a'
                            : '2px solid transparent',
                        transition: 'all 0.2s',
                      }}
                    >
                      {i.extSysName}
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    padding: '16px',
                    overflowY: 'auto',
                    height: 'calc(100% - 50px)',
                  }}
                >
                  {selectedSystem && (
                    <AccountPanel
                      system={selectedSystem}
                      queryRoleId={selectedItem?.roleId}
                    />
                  )}
                </div>
              </>
            )}
            {loading && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                }}
              >
                <Spin />
              </div>
            )}
          </Card>
        </Col>
        <Col span={12} style={{ height: '100%', display: 'flex' }}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={TitleImgSrc} className={styles.logo} />
                <span className={styles.titleText}>交易账户权限</span>
              </div>
            }
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
            bodyStyle={{
              flex: 1,
              padding: 0,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {tradeSystems.length === 0 ? (
              <div style={{ width: '100%', height: '100%', display: 'flex' }}>
                <Empty
                  style={{ width: '100%', alignSelf: 'center' }}
                  image={NoDataSimpleSvg}
                  description={'暂无数据'}
                />
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: 'flex',
                    overflowX: 'auto',
                    borderBottom: '1px solid #e8e8e8',
                    padding: '0 16px',
                    gap: '8px',
                  }}
                >
                  {tradeSystems.map((i) => (
                    <div
                      key={i.extSysId}
                      onClick={() => setSelectedTradeSystem(i)}
                      style={{
                        whiteSpace: 'nowrap',
                        padding: '12px 16px',
                        cursor: 'pointer',
                        fontWeight:
                          selectedTradeSystem?.extSysId === i.extSysId
                            ? 'bold'
                            : 'normal',
                        color:
                          selectedTradeSystem?.extSysId === i.extSysId
                            ? '#bb744a'
                            : '#595959',
                        borderBottom:
                          selectedTradeSystem?.extSysId === i.extSysId
                            ? '2px solid #bb744a'
                            : '2px solid transparent',
                        transition: 'all 0.2s',
                      }}
                    >
                      {i.extSysName}
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    padding: '16px',
                    overflowY: 'auto',
                    height: 'calc(100% - 50px)',
                  }}
                >
                  {selectedTradeSystem && (
                    <AccountPanel
                      system={selectedTradeSystem}
                      queryRoleId={selectedItem?.roleId}
                    />
                  )}
                </div>
              </>
            )}
            {loading && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                }}
              >
                <Spin />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AccountPermission;
