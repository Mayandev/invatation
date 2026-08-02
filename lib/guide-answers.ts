const RULES: Array<{ pattern: RegExp; answer: string }> = [
  {
    pattern: /座位|桌|席/,
    answer:
      '您的席位正在确认中。最终桌位会在婚礼前同步到此电子票；当天也可以凭票号在签到处领取纸质纪念票并由工作人员引座。'
  },
  {
    pattern: /主角|新人|新郎|新娘|谁/,
    answer:
      '今天的两位主角是邹明远与孙佳玮。他们把这场婚礼命名为《共赴》——一场只有一天，却想珍藏一生的限定演出。更多故事会在现场第一幕揭晓。'
  },
  {
    pattern: /节目|流程|时间|几点|开演/,
    answer: '11:18 恭迎宾客，11:58 嘉礼开演，12:28 喜宴开席。建议提前 20 分钟抵达，留出签到、换取纸票和合影时间。'
  },
  {
    pattern: /场馆|地址|哪里|怎么去/,
    answer: '演出场馆位于江西省吉安市悦宴楼五楼。到达悦宴楼后请乘电梯前往五楼，现场会设置《共赴》签到与引导标识。'
  },
  {
    pattern: /卫生间|洗手间|厕所/,
    answer: '卫生间的精确路线需要完成场馆实地踏勘后录入。抵达五楼后可查看现场指引牌，或向佩戴"引座官"胸牌的工作人员询问。'
  },
  {
    pattern: /出口|离场|电梯|楼梯/,
    answer: '主出口与消防疏散路线将在场馆踏勘后补充进来。现场请以悦宴楼五楼的绿色出口标识及工作人员指引为准。'
  },
  {
    pattern: /停车|开车|车/,
    answer: '停车信息目前待场馆确认。正式上线前会把停车入口、收费规则和散场路线补充到这里。'
  }
];

const FALLBACK_ANSWER =
  '这个问题我暂时还没有可靠答案。您可以问我"我的座位""今日节目单""场馆在哪里"或"卫生间在哪里"。涉及现场路线时，我只会使用已经确认过的信息。';

export function getGuideAnswer(question: string): string {
  const rule = RULES.find(({ pattern }) => pattern.test(question));
  return rule ? rule.answer : FALLBACK_ANSWER;
}

export const QUICK_QUESTIONS = [
  { label: '我的座位', question: '我的座位在哪里' },
  { label: '认识主角', question: '介绍一下两位主角' },
  { label: '今日节目单', question: '今天的节目流程' },
  { label: '场馆信息', question: '场馆在哪里' },
  { label: '卫生间', question: '卫生间在哪里' },
  { label: '出口指引', question: '出口在哪里' }
];
