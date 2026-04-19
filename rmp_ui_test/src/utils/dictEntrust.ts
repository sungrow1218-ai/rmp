import { type ValueTypeAtKey } from './typing';

/**
 * 委托类型
 */
export const ENTRUST_TYPE = [
  { code: '0', name: '普通委托', feKey: 'NORMAL' },
  { code: '2', name: '撤单委托', feKey: 'CANCELLATION' },
] as const;

/**
 * 委托方向
 */
export const ENTRUST_DIRECTION = [
  { code: '1', name: '买入', feKey: 'KEY_1' },
  { code: '2', name: '卖出', feKey: 'KEY_2' },
  // { code: '3', name: '债券买入', feKey: 'KEY_3' },
  // { code: '4', name: '债券卖出', feKey: 'KEY_4' },
  { code: '5', name: '融资(正)回购', feKey: 'KEY_5' },
  { code: '6', name: '融券(逆)回购', feKey: 'KEY_6' },
  { code: '7', name: '融资购回', feKey: 'KEY_7' },
  { code: '8', name: '融券购回', feKey: 'KEY_8' },
  { code: '9', name: '配股配债认购', feKey: 'KEY_9' },
  { code: '10', name: '债转股', feKey: 'KEY_10' },
  { code: '11', name: '债回售', feKey: 'KEY_11' },
  { code: '12', name: '申购', feKey: 'KEY_12' },
  { code: '13', name: '基金认购', feKey: 'KEY_13' },
  { code: '14', name: '基金转换', feKey: 'KEY_14' },
  { code: '16', name: '存款', feKey: 'KEY_16' },
  { code: '17', name: '转托管', feKey: 'KEY_17' },
  { code: '18', name: '指定交易', feKey: 'KEY_18' },
  { code: '19', name: '撤销指定', feKey: 'KEY_19' },
  { code: '20', name: '承销买入', feKey: 'KEY_20' },
  { code: '21', name: '分销买入', feKey: 'KEY_21' },
  { code: '22', name: '分销卖出', feKey: 'KEY_22' },
  { code: '23', name: '证券转融通出借展期', feKey: 'KEY_23' },
  { code: '24', name: '债券投标', feKey: 'KEY_24' },
  { code: '25', name: '议案投票', feKey: 'KEY_25' },
  { code: '26', name: 'ETF基金申购', feKey: 'KEY_26' },
  { code: '27', name: 'ETF基金赎回', feKey: 'KEY_27' },
  { code: '28', name: '行权认购', feKey: 'KEY_28' },
  { code: '29', name: '行权认沽', feKey: 'KEY_29' },
  { code: '30', name: '提交质押', feKey: 'KEY_30' },
  { code: '31', name: '转回质押', feKey: 'KEY_31' },
  { code: '32', name: '买入开仓', feKey: 'KEY_32' },
  { code: '33', name: '卖出平仓', feKey: 'KEY_33' },
  { code: '34', name: '卖出开仓', feKey: 'KEY_34' },
  { code: '35', name: '买入平仓', feKey: 'KEY_35' },
  { code: '36', name: '盈亏结转', feKey: 'KEY_36' },
  { code: '37', name: '项目投资', feKey: 'KEY_37' },
  { code: '38', name: '预受要约撤销', feKey: 'KEY_38' },
  { code: '39', name: '债券远期买入', feKey: 'KEY_39' },
  { code: '40', name: '债券远期卖出', feKey: 'KEY_40' },
  { code: '41', name: '自营转融券', feKey: 'KEY_41' },
  { code: '42', name: '融券转自营', feKey: 'KEY_42' },
  { code: '43', name: '跨市场转托管', feKey: 'KEY_43' },
  { code: '44', name: '外汇换出', feKey: 'KEY_44' },
  { code: '46', name: '存款支取', feKey: 'KEY_46' },
  { code: '47', name: '外汇换入', feKey: 'KEY_47' },
  { code: '48', name: '利率互换', feKey: 'KEY_48' },
  { code: '49', name: '证券转融通出借', feKey: 'KEY_49' },
  { code: '50', name: '基金分拆', feKey: 'KEY_50' },
  { code: '51', name: '基金合并', feKey: 'KEY_51' },
  { code: '52', name: '基金冲账', feKey: 'KEY_52' },
  { code: '53', name: '开基申购', feKey: 'KEY_53' },
  { code: '54', name: '开基赎回', feKey: 'KEY_54' },
  { code: '55', name: '认购', feKey: 'KEY_55' },
  { code: '56', name: '约定购回', feKey: 'KEY_56' },
  { code: '57', name: '报价回购提交质押', feKey: 'KEY_57' },
  { code: '58', name: '报价回购转回质押', feKey: 'KEY_58' },
  { code: '59', name: '分红设置', feKey: 'KEY_59' },
  { code: '60', name: '融资买入', feKey: 'KEY_60' },
  { code: '61', name: '卖券还款', feKey: 'KEY_61' },
  { code: '63', name: '证券锁定', feKey: 'KEY_63' },
  { code: '64', name: '证券解锁', feKey: 'KEY_64' },
  { code: '65', name: '赎回现金增加', feKey: 'KEY_65' },
  { code: '66', name: '预受要约', feKey: 'KEY_66' },
  { code: '67', name: '融券卖出', feKey: 'KEY_67' },
  { code: '68', name: '买券还券', feKey: 'KEY_68' },
  { code: '69', name: '直接还款', feKey: 'KEY_69' },
  { code: '70', name: '直接还券', feKey: 'KEY_70' },
  { code: '71', name: '卖方交割', feKey: 'KEY_71' },
  { code: '72', name: '买方交割', feKey: 'KEY_72' },
  { code: '73', name: '担保券交存', feKey: 'KEY_73' },
  { code: '74', name: '担保券提取', feKey: 'KEY_74' },
  { code: '75', name: '申购现金减少', feKey: 'KEY_75' },
  { code: '76', name: '赎回现金增加', feKey: 'KEY_76' },
  { code: '77', name: '持仓组合', feKey: 'KEY_77' },
  { code: '78', name: '持仓组合解除', feKey: 'KEY_78' },
  { code: '79', name: '认购期权普通义务仓转备兑', feKey: 'KEY_79' },
  { code: '80', name: '备兑仓转保证金仓', feKey: 'KEY_80' },
  { code: '81', name: '放弃认购', feKey: 'KEY_81' },
  { code: '82', name: '取消放弃认购', feKey: 'KEY_82' },
  { code: '83', name: '放弃行权', feKey: 'KEY_83' },
  { code: '88', name: '开基红利到账', feKey: 'KEY_88' },
  { code: '89', name: '开基红利再投', feKey: 'KEY_89' },
  { code: '93', name: '赞成投票', feKey: 'KEY_93' },
  { code: '94', name: '反对投票', feKey: 'KEY_94' },
  { code: '95', name: '弃权投票', feKey: 'KEY_95' },
  { code: '96', name: '撤销配股认购', feKey: 'KEY_96' },
  { code: '97', name: '红利股票选择权', feKey: 'KEY_97' },
  { code: '98', name: '撤销红利股票选择权', feKey: 'KEY_98' },
  { code: '101', name: '期权询价', feKey: 'KEY_101' },
  { code: '102', name: '沪深交易所融资融券展期', feKey: 'KEY_102' },
  { code: '103', name: '协议(正)回购', feKey: 'KEY_103' },
  { code: '104', name: '协议(逆)回购', feKey: 'KEY_104' },
  { code: '105', name: '正回购到期', feKey: 'KEY_105' },
  { code: '106', name: '逆回购到期', feKey: 'KEY_106' },
  { code: '107', name: '正回购换券', feKey: 'KEY_107' },
  { code: '108', name: '逆回购换券', feKey: 'KEY_108' },
  { code: '109', name: '正回购续做', feKey: 'KEY_109' },
  { code: '110', name: '逆回购续做', feKey: 'KEY_110' },
  { code: '111', name: '正回购解除质押', feKey: 'KEY_111' },
  { code: '112', name: '逆回购解除质押', feKey: 'KEY_112' },
  { code: '113', name: '正回购提前到期', feKey: 'KEY_113' },
  { code: '114', name: '逆回购提前到期', feKey: 'KEY_114' },
  { code: '115', name: '正回购延期购回', feKey: 'KEY_115' },
  { code: '116', name: '逆回购延期购回', feKey: 'KEY_116' },
  { code: '117', name: '期权自对冲设置', feKey: 'KEY_117' },
  { code: '118', name: '期权自对冲取消', feKey: 'KEY_118' },
  { code: '119', name: '义务标的对冲设置', feKey: 'KEY_119' },
  { code: '120', name: '义务标的对冲取消', feKey: 'KEY_120' },
  { code: '121', name: '三方正回购成交', feKey: 'KEY_121' },
  { code: '122', name: '三方逆回购成交', feKey: 'KEY_122' },
  { code: '123', name: '三方正回购提前到期', feKey: 'KEY_123' },
  { code: '124', name: '三方逆回购提前到期', feKey: 'KEY_124' },
  { code: '125', name: '三方正回购到期', feKey: 'KEY_125' },
  { code: '126', name: '三方逆回购到期', feKey: 'KEY_126' },
  { code: '127', name: '三方正回购续做', feKey: 'KEY_127' },
  { code: '128', name: '三方逆回购续做', feKey: 'KEY_128' },
  { code: '129', name: '三方正回购换券', feKey: 'KEY_129' },
  { code: '130', name: '三方正回购被换券', feKey: 'KEY_130' },
  { code: '131', name: '三方逆回购换券', feKey: 'KEY_131' },
  { code: '132', name: '三方逆回购被换券', feKey: 'KEY_132' },
  { code: '133', name: '三方正回购解除质押券', feKey: 'KEY_133' },
  { code: '134', name: '三方逆回购解除质押券', feKey: 'KEY_134' },
  { code: '135', name: '三方转入申报', feKey: 'KEY_135' },
  { code: '136', name: '三方转出申报', feKey: 'KEY_136' },
  { code: '137', name: '三方回购补券', feKey: 'KEY_137' },
  { code: '138', name: '期权保留仓位设置', feKey: 'KEY_138' },
  { code: '139', name: '保留仓位取消', feKey: 'KEY_139' },
  { code: '140', name: '支付固定', feKey: 'KEY_140' },
  { code: '141', name: '收取固定', feKey: 'KEY_141' },
  { code: '142', name: '现金选择权', feKey: 'KEY_142' },
  { code: '143', name: '三方正回购延期购回', feKey: 'KEY_143' },
  { code: '144', name: '三方逆回购延期购回', feKey: 'KEY_144' },
  { code: '145', name: '合并行权', feKey: 'KEY_145' },
  { code: '146', name: 'ETF基金发行端申购', feKey: 'KEY_146' },
  { code: '147', name: 'ETF基金发行端赎回', feKey: 'KEY_147' },
  { code: '148', name: '报价回购到期购回', feKey: 'KEY_148' },
  { code: '149', name: '报价回购展期终止', feKey: 'KEY_149' },
  { code: '150', name: '定向增发申购', feKey: 'KEY_150' },
  { code: '151', name: '报价回购买入', feKey: 'KEY_151' },
  { code: '152', name: '报价回购提前购回', feKey: 'KEY_152' },
  { code: '153', name: '贵金属买入', feKey: 'KEY_153' },
  { code: '154', name: '贵金属卖出', feKey: 'KEY_154' },
  { code: '155', name: '外汇买入', feKey: 'KEY_155' },
  { code: '156', name: '外汇卖出', feKey: 'KEY_156' },
  { code: '157', name: '国债充抵保证金交存', feKey: 'KEY_157' },
  { code: '158', name: '国债充抵保证金提取', feKey: 'KEY_158' },
  { code: '159', name: '证券转融通出借提前了结', feKey: 'KEY_159' },
  { code: '160', name: '银行同业业务首期', feKey: 'KEY_160' },
  { code: '161', name: '银行同业业务收息', feKey: 'KEY_161' },
  { code: '162', name: '银行同业业务付息', feKey: 'KEY_162' },
  { code: '163', name: '银行同业业务来账', feKey: 'KEY_163' },
  { code: '164', name: '银行同业业务往账', feKey: 'KEY_164' },
  { code: '165', name: '银行同业业务提前到期', feKey: 'KEY_165' },
  { code: '166', name: '银行同业业务合同到期', feKey: 'KEY_166' },
  { code: '167', name: '银行同业业务逾期', feKey: 'KEY_167' },
  { code: '168', name: '正回购延期', feKey: 'KEY_168' },
  { code: '169', name: '逆回购延期', feKey: 'KEY_169' },
  { code: '170', name: '直接取款', feKey: 'KEY_170' },
  { code: '171', name: '预约取款', feKey: 'KEY_171' },
  { code: '172', name: '取消预约取款', feKey: 'KEY_172' },
  { code: '173', name: '申购询价', feKey: 'KEY_173' },
  { code: '174', name: '债回售撤销申报', feKey: 'KEY_174' },
  { code: '175', name: '卖空', feKey: 'KEY_175' },
  { code: '176', name: '买平', feKey: 'KEY_176' },
  { code: '177', name: '外汇调汇汇出', feKey: 'KEY_177' },
  { code: '178', name: '外汇调汇汇入', feKey: 'KEY_178' },
  { code: '179', name: '赎回', feKey: 'KEY_179' },
  { code: '180', name: '中立仓交货申报', feKey: 'KEY_180' },
  { code: '181', name: '中立仓收货申报', feKey: 'KEY_181' },
  { code: '182', name: '密码激活', feKey: 'KEY_182' },
  { code: '183', name: '密码重置', feKey: 'KEY_183' },
  { code: '184', name: '买入交易解除', feKey: 'KEY_184' },
  { code: '185', name: '卖出交易解除', feKey: 'KEY_185' },
  { code: '186', name: '竞买预约卖出', feKey: 'KEY_186' },
  { code: '187', name: '竞买预约撤销', feKey: 'KEY_187' },
  { code: '190', name: '约定融券借入', feKey: 'KEY_190' },
  { code: '191', name: '约定合约展期', feKey: 'KEY_191' },
  { code: '192', name: '存款提前支取', feKey: 'KEY_192' },
  { code: '200', name: '对方存款', feKey: 'KEY_200' },
  { code: '431', name: '跨市场转托管转入', feKey: 'KEY_431' },
  { code: '432', name: '跨市场转托管转出', feKey: 'KEY_432' },
  { code: '433', name: '基金通转入', feKey: 'KEY_433' },
  { code: '434', name: '基金通转出', feKey: 'KEY_434' },
  { code: '500', name: '融入', feKey: 'KEY_500' },
  { code: '501', name: '融出', feKey: 'KEY_501' },
  { code: '502', name: '融入到期', feKey: 'KEY_502' },
  { code: '503', name: '融出到期', feKey: 'KEY_503' },
  { code: '504', name: '信用拆借拆入', feKey: 'KEY_504' },
  { code: '505', name: '信用拆借拆出', feKey: 'KEY_505' },
  { code: '506', name: '信用拆借拆入到期', feKey: 'KEY_506' },
  { code: '507', name: '信用拆借拆出到期', feKey: 'KEY_507' },
  { code: '508', name: '利率互换冲销', feKey: 'KEY_508' },
  { code: '600', name: '借入', feKey: 'KEY_600' },
  { code: '601', name: '借出', feKey: 'KEY_601' },
  { code: '602', name: '还金', feKey: 'KEY_602' },
  { code: '603', name: '收金', feKey: 'KEY_603' },
  { code: '604', name: '上海金买入', feKey: 'KEY_604' },
  { code: '605', name: '上海金卖出', feKey: 'KEY_605' },
  { code: '606', name: '即期买入', feKey: 'KEY_606' },
  { code: '607', name: '即期卖出', feKey: 'KEY_607' },
  { code: '608', name: 'FUT-BUY', feKey: 'KEY_608' },
  { code: '609', name: 'FUT-SELL', feKey: 'KEY_609' },
  { code: '610', name: 'OPT-BUY', feKey: 'KEY_610' },
  { code: '611', name: 'OPT-SELL', feKey: 'KEY_611' },
  { code: '612', name: '约定归还', feKey: 'KEY_612' },
  { code: '613', name: '融入换券', feKey: 'KEY_613' },
  { code: '614', name: '融出换券', feKey: 'KEY_614' },
  { code: '615', name: '外汇远期买入', feKey: 'KEY_615' },
  { code: '616', name: '外汇远期卖出', feKey: 'KEY_616' },
  { code: '617', name: '优先标识', feKey: 'KEY_617' },
  { code: '618', name: '免除标识', feKey: 'KEY_618' },
  { code: '619', name: '待处置锁定', feKey: 'KEY_619' },
  { code: '620', name: '融入提前到期', feKey: 'KEY_620' },
  { code: '621', name: '融出提前到期', feKey: 'KEY_621' },
  { code: '622', name: '融入解除质押', feKey: 'KEY_622' },
  { code: '623', name: '融出解除质押', feKey: 'KEY_623' },
  { code: '624', name: '融入到期续做', feKey: 'KEY_624' },
  { code: '625', name: '融出到期续做', feKey: 'KEY_625' },
  { code: '626', name: '转融券借入', feKey: 'KEY_626' },
  { code: '627', name: '转融券借入展期', feKey: 'KEY_627' },
  { code: '628', name: '转融券提前了结', feKey: 'KEY_628' },
  { code: '629', name: '受让', feKey: 'KEY_629' },
  { code: '630', name: 'OPT-EXERCISE', feKey: 'KEY_630' },
  { code: '631', name: 'OPT-LAPSE', feKey: 'KEY_631' },
  { code: '632', name: '融入逾期', feKey: 'KEY_632' },
  { code: '633', name: '融出逾期', feKey: 'KEY_633' },
  { code: '634', name: '现金提取', feKey: 'KEY_634' },
];

/**
 * 委托状态
 */
export const ENTRUST_STATUS = [
  { code: '1', name: '未报', feKey: 'KEY_1' },
  { code: '4', name: '已报', feKey: 'KEY_4' },
  { code: '5', name: '废单', feKey: 'KEY_5' },
  { code: '6', name: '部成', feKey: 'KEY_6' },
  { code: '7', name: '已成', feKey: 'KEY_7' },
  { code: '8', name: '部撤', feKey: 'KEY_8' },
  { code: '9', name: '已撤', feKey: 'KEY_9' },
  { code: 'a', name: '待撤', feKey: 'KEY_a' },
] as const;
export const PENDING_ENTRUST_STATUS = [
  { code: '1', name: '未报', feKey: 'KEY_1' },
  { code: '4', name: '已报', feKey: 'KEY_4' },
  // { code: '5', name: '废单', feKey: 'KEY_5' },
  { code: '6', name: '部成', feKey: 'KEY_6' },
  // { code: '7', name: '已成', feKey: 'KEY_7' },
  // { code: '8', name: '部撤', feKey: 'KEY_8' },
  // { code: '9', name: '已撤', feKey: 'KEY_9' },
  { code: 'a', name: '待撤', feKey: 'KEY_a' },
] as const;

/**
 * 投资类型
 */
export const INVEST_TYPE = [
  { code: 'a', name: '投机', feKey: 'KEY_A' },
  { code: 'b', name: '套保', feKey: 'KEY_B' },
  { code: 'c', name: '套利', feKey: 'KEY_C' },
  { code: 'd', name: '交易业务类FVPL', feKey: 'KEY_D' },
  { code: 'e', name: '未通过SPPI类FVPL', feKey: 'KEY_E' },
  { code: 'f', name: '行使指定权类FVPL', feKey: 'KEY_F' },
  { code: 'g', name: 'AC（含权）', feKey: 'KEY_G' },
  { code: '1', name: '可交易/FVPL', feKey: 'KEY_1' },
  { code: '2', name: '持有到期', feKey: 'KEY_2' },
  { code: '3', name: '可供出售', feKey: 'KEY_3' },
  { code: '4', name: '贷款和应收款项', feKey: 'KEY_4' },
  { code: '8', name: 'AC', feKey: 'KEY_8' },
  { code: '9', name: 'FVOCI', feKey: 'KEY_9' },
] as const;

/**
 * 价格类型
 */
export const PRICE_TYPE = [
  { code: '0', name: '限价', feKey: 'KEY_0' },
  { code: '1', name: '市价', feKey: 'KEY_1' },
  { code: '2', name: '限价FOK', feKey: 'KEY_2' },
  { code: '3', name: '限价FAK', feKey: 'KEY_3' },
  { code: '4', name: '市价FOK', feKey: 'KEY_4' },
  { code: '5', name: '市价FAK', feKey: 'KEY_5' },
  { code: '6', name: '限价止盈', feKey: 'KEY_6' },
  { code: '7', name: '限价止损', feKey: 'KEY_7' },
  { code: '8', name: '市价止盈', feKey: 'KEY_8' },
  { code: '9', name: '市价止损', feKey: 'KEY_9' },
  { code: '10', name: '市价剩转限', feKey: 'KEY_10' },
] as const;

/**
 * 交易平台
 */
export const TRADE_PLATFORM_ID = [
  { code: '1', name: '上海竞价', feKey: 'KEY_1' },
  { code: '2', name: '上海大宗', feKey: 'KEY_2' },
  { code: '3', name: '上海固收', feKey: 'KEY_3' },
  { code: '4', name: '深圳竞价', feKey: 'KEY_4' },
  { code: '5', name: '深圳大宗', feKey: 'KEY_5' },
  { code: '6', name: '上期竞价', feKey: 'KEY_6' },
  { code: '7', name: '郑商竞价', feKey: 'KEY_7' },
  { code: '11', name: '中金竞价', feKey: 'KEY_11' },
  { code: '13', name: '大商竞价', feKey: 'KEY_13' },
  { code: '14', name: '股转竞价', feKey: 'KEY_14' },
  { code: '38', name: '能源竞价', feKey: 'KEY_38' },
  { code: '43', name: '股转大宗交易平台', feKey: 'KEY_43' },
  { code: '45', name: '深圳固收', feKey: 'KEY_45' },
  { code: '47', name: '港股通(沪)竞价', feKey: 'KEY_47' },
  { code: '48', name: '港股通(深)竞价', feKey: 'KEY_48' },
  { code: '49', name: '北京竞价', feKey: 'KEY_49' },
  { code: '50', name: '北京大宗', feKey: 'KEY_50' },
  { code: '52', name: '广期竞价', feKey: 'KEY_52' },
];

/**
 * 业务类型
 */
export const BUSINESS_TYPE = [
  { code: '0', name: '普通交易', feKey: 'KEY_0' },
  { code: '1', name: '标准套利单', feKey: 'KEY_1' },
  { code: '2', name: '标准互换单', feKey: 'KEY_2' },
  { code: '3', name: '转融通', feKey: 'KEY_3' },
] as const;

/**
 * ETF申赎类型
 */
export const ETF_POR_TYPE = [
  { code: '0', name: '普通申赎', feKey: 'KEY_0' },
  { code: '1', name: '现金申赎', feKey: 'KEY_1' },
  { code: '2', name: '实物申赎', feKey: 'KEY_2' },
] as const;

interface DictCodeEnumType {
  /** 委托方式 */
  ENTRUST_TYPE: ValueTypeAtKey<typeof ENTRUST_TYPE, 'code'>;
  /** 委托方向 */
  ENTRUST_DIRECTION: ValueTypeAtKey<typeof ENTRUST_DIRECTION, 'code'>;
  /** 委托状态 */
  ENTRUST_STATUS: ValueTypeAtKey<typeof ENTRUST_STATUS, 'code'>;
  /** 投资类型 */
  INVEST_TYPE: ValueTypeAtKey<typeof INVEST_TYPE, 'code'>;
  /** 价格类型 */
  PRICE_TYPE: ValueTypeAtKey<typeof PRICE_TYPE, 'code'>;
  /** 交易平台 */
  TRADE_PLATFORM_ID: ValueTypeAtKey<typeof TRADE_PLATFORM_ID, 'code'>;
  /** 业务类型 */
  BUSINESS_TYPE: ValueTypeAtKey<typeof BUSINESS_TYPE, 'code'>;
  /** ETF申赎类型 */
  ETF_POR_TYPE: ValueTypeAtKey<typeof ETF_POR_TYPE, 'code'>;
}

interface DictFeKeyEnumType {
  /** 委托方式 */
  ENTRUST_TYPE: ValueTypeAtKey<typeof ENTRUST_TYPE, 'feKey'>;
  /** 委托方向 */
  ENTRUST_DIRECTION: ValueTypeAtKey<typeof ENTRUST_DIRECTION, 'feKey'>;
  /** 委托状态 */
  ENTRUST_STATUS: ValueTypeAtKey<typeof ENTRUST_STATUS, 'feKey'>;
  /** 投资类型 */
  INVEST_TYPE: ValueTypeAtKey<typeof INVEST_TYPE, 'feKey'>;
  /** 价格类型 */
  PRICE_TYPE: ValueTypeAtKey<typeof PRICE_TYPE, 'feKey'>;
  /** 交易平台 */
  TRADE_PLATFORM_ID: ValueTypeAtKey<typeof TRADE_PLATFORM_ID, 'feKey'>;
  /** 业务类型 */
  BUSINESS_TYPE: ValueTypeAtKey<typeof BUSINESS_TYPE, 'feKey'>;
  /** ETF申赎类型 */
  ETF_POR_TYPE: ValueTypeAtKey<typeof ETF_POR_TYPE, 'feKey'>;
}
