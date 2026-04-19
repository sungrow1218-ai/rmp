import { InboxOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import { Modal, ModalProps, Upload, UploadProps } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import './styles.less';

const { Dragger } = Upload;

export interface IProps {
  templateDownloadUrl?: string;
  templateFileName?: string;
  modalProps?: ModalProps;
  uploadProps?: UploadProps;
  onConfirm?: () => void;
}

export interface IAction {
  open: () => void;
  close: () => void;
}

const ImportModal = forwardRef<IAction, IProps>(
  (
    {
      templateDownloadUrl,
      templateFileName,
      modalProps = {},
      uploadProps = {},
      onConfirm,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => {
        setOpen(true);
      },
      close: () => {
        setOpen(false);
      },
    }));

    const downloadTemplateFile = () => {
      if (!templateDownloadUrl || !templateFileName) return;
      fetch(templateDownloadUrl)
        .then((response) => response.arrayBuffer()) // 获取二进制数据
        .then((data) => {
          const fileURL = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement('a');
          link.href = fileURL;
          link.download = templateFileName;
          link.click();
          window.URL.revokeObjectURL(fileURL);
        })
        .catch((error) => {
          console.error('请求失败:', error);
        });
    };

    return (
      <Modal
        title={'批量导入'}
        width={520}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => {
          onConfirm && onConfirm();
          setOpen(false);
        }}
        {...modalProps}
      >
        <div className="riskControlPlatformAntd-import-modal-body">
          <div style={{ marginBottom: '16px' }}>
            <div className="riskControlPlatformAntd-import-modal-body-title">
              上传文件
            </div>
            <Dragger {...uploadProps}>
              <p className="riskControlPlatformAntd-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="riskControlPlatformAntd-upload-text">
                单击或拖动文件到此区域上传
              </p>
              <p className="riskControlPlatformAntd-upload-hint">
                支持单个或批量上传，严禁上传公司数据
              </p>
            </Dragger>
          </div>
          {templateFileName && templateFileName && (
            <div>
              <div className="riskControlPlatformAntd-import-modal-body-title">
                模板下载
              </div>
              <div
                className="riskControlPlatformAntd-import-modal-body-template"
                onClick={downloadTemplateFile}
              >
                {templateFileName}
                <VerticalAlignBottomOutlined
                  style={{ color: '#bb744a', marginLeft: '16px' }}
                />
              </div>
            </div>
          )}
        </div>
      </Modal>
    );
  }
);

export default ImportModal;
