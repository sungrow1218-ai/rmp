import React from 'react';
import TitleImgSrc from '@/assets/common/card-title-icon.png';
import styles from './styles.less';

interface Props {
  title: string;
  style?: Record<string, any>;
  titleStyle?: Record<string, any>;
  imgStyle?: Record<string, any>;
}

const CardTitle: React.FC<Props> = ({ title, style, titleStyle, imgStyle }) => {
  return (
    <div className={styles.cardTitle} style={style}>
      <div className={styles.title}>
        <img src={TitleImgSrc} style={imgStyle} />
        <span style={titleStyle}>{title}</span>
      </div>
    </div>
  );
};

export default CardTitle;
