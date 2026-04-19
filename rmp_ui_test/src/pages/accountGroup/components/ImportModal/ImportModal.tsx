// src/components/AddAccountTree/ImportModal.tsx
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal, Upload, message } from '@ht/sprite-ui';
import type { UploadFile } from '@ht/sprite-ui/es/upload/interface';
import { utils, read, WorkBook } from 'xlsx';
import styles from './ImportModal.less';
import { queryAccountGroupDetail } from '@/services/accountGroup';
import { BookTypeEnum } from '@/pages/ruleSetting/components/RuleDimensionControl/component/ControlAcctTypeSelect';
import BaseSettings from '@/../config/BaseSettings';
import type { FaultItem } from '../FaultListModal';

const { assetPrefix } = BaseSettings;

const TEMPLATE_MAP: Record<number, { fileName: string; label: string }> = {
  [BookTypeEnum.TRADE_ACCOUNT]: {
    fileName: 'TradeAccounttGroupTemplate.xlsx',
    label: '交易账户导入模板.xlsx',
  },
  [BookTypeEnum.MANAGE_ACCOUNT]: {
    fileName: 'ManageAccounttGroupTemplate.xlsx',
    label: '管理账户导入模板.xlsx',
  },
};

export interface ImportModalRef {
  open: () => void;
  close: () => void;
}

interface ParsedData {
  marketId?: string;
  acctCode?: string;
  extSysId?: string;
  [key: string]: any;
}

export interface DetailForParent {
  formatErrors: FaultItem[];
  total: number;
  emptyCount: number;
  invalidCount: number;
  dupCount: number;
  validCount: number;
  existingDupCount: number;
  existingDupFaults: FaultItem[];
}

interface Props {
  bookType: number;
  bookLevel: number;
  sobInfo: any;
  acctGroupId: number;
  onConfirm?: (
    data: ParsedData[],
    detail: DetailForParent
  ) => void | Promise<void>;
}

const ImportModal = forwardRef<ImportModalRef, Props>(
  ({ bookType, bookLevel, sobInfo, acctGroupId, onConfirm }, ref) => {
    const [open, setOpen] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);

    const isTrader = bookType === BookTypeEnum.TRADE_ACCOUNT;
    const currentTemplate = TEMPLATE_MAP[bookType];

    useImperativeHandle(ref, () => ({
      open: () => {
        setFileList([]);
        setOpen(true);
      },
      close: () => {
        setOpen(false);
        setFileList([]);
      },
    }));

    const accountTypeName =
      (sobInfo?.bookList || [])
        .find((b: any) => b.bookType === bookType)
        ?.bookLevelList.find((l: any) => l.bookLevel === bookLevel)
        ?.bookLevelName || '';

    const downloadTemplate = async () => {
      try {
        const resp = await fetch(
          `${assetPrefix}api/ops/downloadFile?fileName=${encodeURIComponent(
            currentTemplate.fileName
          )}`
        );
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.arrayBuffer();

        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = currentTemplate.label;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (e) {
        // message.error('模板下载失败，请稍后重试');
      }
    };

    const readFileAsWorkbook = async (file: File): Promise<WorkBook> => {
      const arrayBuffer = await file.arrayBuffer();
      let data = arrayBuffer;

      // 处理 .csv 文件的 BOM
      if (file.name.toLowerCase().endsWith('.csv')) {
        const text = new TextDecoder('utf-8').decode(arrayBuffer);
        const cleanedText =
          text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
        const blob = new Blob([cleanedText], { type: 'text/csv' });
        data = await blob.arrayBuffer();
      }

      return read(data, { type: 'array' });
    };

    const normalizeHeader = (header: string): string => {
      const map: Record<string, string> = {
        交易所: 'marketId',
        市场: 'marketId',
        交易市场: 'marketId',
        账户编码: 'acctCode',
        账号: 'acctCode',
        账户号: 'acctCode',
        acctcode: 'acctCode',
        acct_code: 'acctCode',
        交易系统: 'extSysId',
        系统ID: 'extSysId',
        系统: 'extSysId',
        extsysid: 'extSysId',
        ext_sys_id: 'extSysId',
      };
      return map[header] || '';
    };

    const buildKey = (x: ParsedData) => {
      const code = (x.acctCode || '').trim();
      const sys = (x.extSysId || '').trim();
      if (isTrader) {
        const mk = (x.marketId || '').trim();
        return `${code}|${sys}|${mk}`;
      }
      return `${code}|${sys}`;
    };

    const parseFiles = async (): Promise<
      | {
          data: ParsedData[];
          formatErrors: FaultItem[];
          totalRows: number;
          emptyCount: number;
          invalidCount: number;
        }
      | undefined
    > => {
      if (!fileList.length) {
        message.warning('请先上传文件');
        return;
      }

      const results: ParsedData[] = [];
      const formatErrors: FaultItem[] = [];
      let totalRows = 0;
      let emptyCount = 0;
      let invalidCount = 0;
      for (const file of fileList) {
        const originFile = file.originFileObj as File;
        if (!originFile) continue;

        let wb: WorkBook;
        try {
          wb = await readFileAsWorkbook(originFile);
        } catch (e) {
          message.error(`文件 "${file.name}" 解析失败，请检查格式`);
          return;
        }

        const sheetNames = wb.SheetNames;
        const validSheetName = sheetNames.find((name) => name !== '填写说明');
        if (!validSheetName) {
          message.warning(`文件 "${file.name}" 没有有效数据表`);
          return;
        }

        const ws = wb.Sheets[validSheetName];
        const json: any[] = utils.sheet_to_json(ws, { header: 1 });
        if (json.length <= 1) {
          message.warning(`文件 "${file.name}" 数据为空`);
          return;
        }
        const headers = json[0].map((h: any) => String(h).trim());
        const requiredFields = isTrader
          ? ['marketId', 'acctCode', 'extSysId']
          : ['acctCode', 'extSysId'];
        const fieldMap: Record<string, number> = {};
        headers.forEach((header, index) => {
          const key = normalizeHeader(header);
          if (['marketId', 'acctCode', 'extSysId'].includes(key)) {
            fieldMap[key] = index;
          }
        });

        const missingFields = requiredFields.filter(
          (f) => fieldMap[f] === undefined
        );
        if (missingFields.length > 0) {
          message.error(
            `文件 "${file.name}" 缺少必填列：${missingFields.join('、')}`
          );
          return;
        }

        const body = json.slice(1);
        totalRows += body.length;

        for (const row of body as any[][]) {
          const acctCode =
            fieldMap.acctCode !== undefined
              ? String(row[fieldMap.acctCode] ?? '').trim()
              : '';
          const extSysId =
            fieldMap.extSysId !== undefined
              ? String(row[fieldMap.extSysId] ?? '').trim()
              : '';
          const marketId =
            isTrader && fieldMap.marketId !== undefined
              ? String(row[fieldMap.marketId] ?? '').trim()
              : undefined;
          console.log('====================================');
          console.log(acctCode, extSysId, marketId);
          console.log('====================================');
          // 判断是否整行为空
          const allEmpty = !acctCode && !extSysId && (!isTrader || !marketId);

          if (allEmpty) {
            // 完全空白行，跳过不处理
            totalRows--;
            continue;
          }

          if (!acctCode || !extSysId || (isTrader && !marketId)) {
            emptyCount++;
            formatErrors.push({
              acctCode,
              extSysId,
              marketId,
              errorInfo: '数据为空：必填列缺失',
            });
            continue;
          }

          if (!/^\d+$/.test(extSysId)) {
            invalidCount++;
            formatErrors.push({
              acctCode,
              extSysId,
              marketId,
              errorInfo: '数据不规范：extSysId',
            });
            continue;
          }
          if (isTrader && !/^\d+$/.test(marketId!)) {
            invalidCount++;
            formatErrors.push({
              acctCode,
              extSysId,
              marketId,
              errorInfo: '数据不规范：marketId',
            });
            continue;
          }

          results.push({ acctCode, extSysId, marketId });
        }
      }
      console.log('====================================');
      console.log(results, 'result');
      console.log('====================================');
      return {
        data: results,
        formatErrors,
        totalRows,
        emptyCount,
        invalidCount,
      };
    };

    const dedupeInFile = (rows: ParsedData[]) => {
      const seen = new Map<string, ParsedData>();
      const unique: ParsedData[] = [];
      const dupFaults: FaultItem[] = [];

      for (const r of rows) {
        const key = buildKey(r);
        if (!key) continue;
        if (seen.has(key)) {
          dupFaults.push({
            acctCode: r.acctCode,
            extSysId: r.extSysId,
            marketId: r.marketId,
            errorInfo: '文件内重复，已跳过',
          });
          continue;
        }
        seen.set(key, r);
        unique.push(r);
      }
      return { unique, dupFaults };
    };

    const fetchExistingKeySet = async (): Promise<Set<string>> => {
      const set = new Set<string>();
      let pageId = 1;
      const pageSize = 5000;

      try {
        while (true) {
          const res = await queryAccountGroupDetail({
            pageId,
            pageSize,
            filterCondition: { acctGroupId },
          });
          const list = res?.data?.resultList ?? [];
          if (list.length === 0) break;

          for (const i of list) {
            const row: ParsedData = {
              acctCode: String(i?.acctCode ?? '').trim(),
              extSysId: String(i?.extSysId ?? '').trim(),
              marketId: isTrader ? String(i?.marketId ?? '').trim() : undefined,
            };
            const key = buildKey(row);
            if (key) set.add(key);
          }

          if (list.length < pageSize) break;
          pageId++;
        }
      } catch (e) {
        // message.error('查询已有账户失败');
        return new Set();
      }

      return set;
    };

    const filterExisting = async (rows: ParsedData[]) => {
      const existSet = await fetchExistingKeySet();
      const valid: ParsedData[] = [];
      const existingDupFaults: FaultItem[] = [];

      for (const r of rows) {
        const key = buildKey(r);
        if (!key) continue;
        if (existSet.has(key)) {
          existingDupFaults.push({
            acctCode: r.acctCode,
            extSysId: r.extSysId,
            marketId: r.marketId,
            errorInfo: '已存在于当前账户组，已跳过',
          });
          continue;
        }
        valid.push(r);
      }
      return { valid, existingDupFaults };
    };

    return (
      <Modal
        open={open}
        title="批量导入"
        width={520}
        okText="确定"
        cancelText="取消"
        confirmLoading={loading}
        onCancel={() => {
          setOpen(false);
          setFileList([]);
        }}
        onOk={async () => {
          setLoading(true);
          try {
            const _parData = await parseFiles();
            if (!_parData) {
              return;
            }
            const {
              data: parsed,
              formatErrors: baseFormatErrors,
              totalRows,
              emptyCount,
              invalidCount,
            } = _parData;

            const { unique, dupFaults } = dedupeInFile(parsed);
            const dupCount = dupFaults.length;
            const { valid, existingDupFaults } = await filterExisting(unique);

            const detail: DetailForParent = {
              formatErrors: [...baseFormatErrors, ...dupFaults].map((x) => ({
                ...x,
                accountTypeName,
              })),
              total: totalRows,
              emptyCount,
              invalidCount,
              dupCount,
              validCount: valid.length,
              existingDupCount: existingDupFaults.length,
              existingDupFaults: existingDupFaults.map((x) => ({
                ...x,
                accountTypeName,
              })),
            };
            if (unique.length === 0) {
              message.warning('有效数据为空，请重新添加');
              return;
            }
            if (
              existingDupFaults.length === unique.length &&
              valid.length === 0
            ) {
              message.warning('数据已存在，请重新上传');
              return;
            }

            await onConfirm?.(unique, detail);

            setOpen(false);
            setFileList([]);
          } catch (err: any) {
          } finally {
            setLoading(false);
          }
        }}
        className={styles.importModal}
        // destroyOnClose={true} // 移除，避免 ref 失效
      >
        <div className={styles.sectionTitle}>上传文件</div>
        <div className={styles.draggerWrap}>
          <Upload.Dragger
            accept=".csv,.xlsx,.xls"
            multiple={true}
            beforeUpload={(file) => {
              const isValid = /\.(csv|xlsx|xls)$/i.test(file.name);
              if (!isValid) {
                message.error(`不支持的文件类型: ${file.name}`);
              }
              return false; // 阻止上传，由我们自己解析
            }}
            fileList={fileList}
            onChange={({ fileList: newFileList }) => {
              const filtered = newFileList
                .map((file) => {
                  const origin = file.originFileObj as File | undefined;
                  if (!origin) return null;
                  if (!/\.(csv|xlsx|xls)$/i.test(origin.name)) return null;

                  const uid = `[IMPORT]${origin.name}-${origin.lastModified}-${origin.size}`;
                  return {
                    ...file,
                    uid,
                    name: origin.name,
                    status: 'done',
                  } as UploadFile;
                })
                .filter((file): file is UploadFile => file !== null);

              setFileList(filtered);
            }}
            onRemove={(file) => {
              setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
            }}
          >
            <div className={styles.draggerTitle}>
              单击或拖动文件到此区域上传
            </div>
            <div className={styles.draggerDesc}>
              支持单个或批量上传，严禁上传公司数据
            </div>
          </Upload.Dragger>
        </div>

        <div className={styles.subTitle}>模板下载</div>
        <div className={styles.templateList}>
          <div
            className={styles.templateItem}
            role="button"
            tabIndex={0}
            onClick={downloadTemplate}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') downloadTemplate();
            }}
          >
            <span className={styles.templateName}>{currentTemplate.label}</span>
            <span className={styles.downloadAction}>点击下载</span>
          </div>
        </div>
      </Modal>
    );
  }
);

export default ImportModal;
