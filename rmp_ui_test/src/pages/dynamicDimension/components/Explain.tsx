import React, { useEffect, useState } from 'react';
import { Input } from '@ht/sprite-ui';
import { Condition } from '../data';
import { OperatorView, UnitView } from '../const';
import { isArray } from 'lodash';
import styles from '../style.less';

const { TextArea } = Input;

export enum STATUS {
  SUCCESS = 1,
  ERROR = 2,
}

type Props = {
  expression: string;
  conditions: Condition[];
  onChange: (status: { code: STATUS; message?: string }) => void;
};

// 判断括号是否匹配
const isBracketValidate = (str: string) => {
  const inArr = [];
  const arr = str.split('');
  for (const s of arr) {
    if (s === '(') {
      inArr.push(s);
    }
    if (s === ')') {
      const temp = '(';
      const out = inArr.pop();
      if (temp !== out) {
        return false;
      }
    }
  }
  return inArr.length === 0;
};

// 匹配是否有表达式
const isConditionEmpty = (str: string) => {
  const reg = new RegExp(`[0-9]`, 'i');
  return reg.test(str);
};

// 检查特定字符
const isConditionValidate = (str: string, indexs: string[]) => {
  for (const letter of str) {
    if (!isNaN(parseInt(letter, 10)) && !indexs.includes(letter)) {
      return false;
    }
  }
  return true;
};

/**
 * 检查“且”“或”运算符规则
 * 运算符之间要存在条件序号
 */
const isRelationValidate = (str: string) => {
  if (str.match(/[&|]/g)) {
    // 区间数组
    let arr = [];
    for (const letter of str) {
      if (!isNaN(parseInt(letter, 10))) {
        arr.push(letter);
      }
      if (letter === '&' || letter === '|') {
        if (arr.length === 0) {
          return false;
        } else {
          arr = [];
        }
      }
    }
    // 结尾特殊处理
    if (arr.length === 0) {
      return false;
    }
  }
  return true;
};

// 获取条件值显示
const getConditionValueView = (
  value: string[] | number[],
  options: { label: string; value: string }[] = []
) => {
  const views = [];
  for (const option of options) {
    if (value.includes(option.value as never)) {
      views.push(option.label);
      if (views.length === value.length) {
        break;
      }
    }
  }
  return `[${views.join(',')}]`;
};

/**
 * 规则
 * 1.括号要匹配-括号不匹配
 * 2.要有条件合法标识-表达式为空/存在无法识别的条件序号
 * 3.且/或两边要有合法标识-逻辑运算符左侧或右侧无表达式
 */
const Explain = ({ expression, conditions, onChange }: Props) => {
  const [explainText, setExplainText] = useState('');

  useEffect(() => {
    getExplainText();
  }, [expression, conditions]);

  const getExplainText = () => {
    const indexs = conditions.map((i, index) => `${index}`);
    // 过滤空格、回车、换行
    const str = expression.replace(/[\s\r\n]+/g, '');
    if (!isBracketValidate(str)) {
      onChange({ code: STATUS.ERROR, message: '括号不匹配' });
      setExplainText('括号不匹配');
      return;
    }
    if (!isConditionEmpty(str)) {
      onChange({ code: STATUS.ERROR, message: '表达式为空' });
      setExplainText('表达式为空');
      return;
    }
    if (!isConditionValidate(str, indexs)) {
      onChange({ code: STATUS.ERROR, message: '存在无法识别的条件序号' });
      setExplainText('存在无法识别的条件序号');
      return;
    }
    if (!isRelationValidate(str)) {
      onChange({ code: STATUS.ERROR, message: '逻辑运算符左侧或右侧无表达式' });
      setExplainText('逻辑运算符左侧或右侧无表达式');
      return;
    }
    let view = '';
    for (const letter of expression) {
      // 条件序号
      if (indexs.includes(letter)) {
        const condition = conditions[parseInt(letter, 10)];
        view += `(${condition.name || ''}${
          condition.operator ? OperatorView[condition.operator] : ''
        }${
          isArray(condition.value)
            ? getConditionValueView(
                condition.value,
                condition.valueProps.options as {
                  label: string;
                  value: string;
                }[]
              )
            : `${condition.value as string | number}` || ''
        }${
          condition.unit
            ? UnitView[condition.unit as unknown as keyof typeof UnitView]
            : ''
        })`;
      }
      // 且
      if (letter === '&') {
        view += '且';
      }
      // 或
      if (letter === '|') {
        view += '或';
      }
      // 括号
      if (letter === '(' || letter === ')') {
        view += letter;
      }
    }
    onChange({ code: STATUS.SUCCESS });
    setExplainText(view);
  };

  return (
    <div className={styles.explainTextarea}>
      <TextArea rows={3} value={explainText} disabled={true} />
    </div>
  );
};

export default Explain;
