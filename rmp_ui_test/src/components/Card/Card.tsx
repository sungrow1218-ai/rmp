import React, { type FC, type PropsWithChildren } from 'react';
import { isFunction } from 'lodash';
import TitleImgSrc from '@/assets/common/card-title-icon.png';
import styles from './style.less';

interface Props {
  /**
   * 卡片标题
   */
  title: string;
  /**
   * 卡片最外部容器样式覆盖
   */
  style?: Record<string, any>;
  /**
   * 卡片头部样式覆盖
   */
  bodyStyle?: Record<string, any>;
  /**
   * 卡片内容部分样式覆盖
   */
  headerStyle?: Record<string, any>;
  /**
   * 头部右侧组件
   */
  headerRight?: React.ReactNode | (() => React.ReactNode);
}

const Card: FC<PropsWithChildren<Props>> = ({
  children,
  title,
  style = {},
  headerStyle = {},
  bodyStyle = {},
  headerRight = null,
}) => {
  return (
    <div className={styles.container} style={style}>
      <div className={styles.header} style={headerStyle}>
        <div className={styles.left}>
          <img src={TitleImgSrc} className={styles.logo} />
          <div className={styles.titleText}>{title}</div>
        </div>
        <div className={styles.right}>
          {headerRight
            ? isFunction(headerRight)
              ? headerRight()
              : headerRight
            : null}
        </div>
      </div>
      <div className={styles.body} style={bodyStyle}>
        {children}
      </div>
    </div>
  );
};

export default Card;
