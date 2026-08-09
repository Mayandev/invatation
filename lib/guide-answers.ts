const RULES: Array<{ pattern: RegExp; answer: string }> = [
  {
    pattern: /座位|桌|席/,
    answer:
      '桌位还在最后确认，婚礼前会更新到电子票里。当天到五楼签到处报姓名或出示票号，也会有人带你入席。'
  },
  {
    pattern: /主角|新人|新郎|新娘|谁/,
    answer:
      '新郎是邹明远，新娘是孙佳玮。谢谢你来见证他们人生里很重要的一天。'
  },
  {
    pattern: /节目|流程|时间|几点|开演/,
    answer: '11:18 开始签到，11:58 举行仪式，12:28 午宴开席。建议提前 20 分钟到，签到、合影都会从容一些。'
  },
  {
    pattern: /场馆|地址|哪里|怎么去/,
    answer: '婚礼在江西省吉安市悦宴楼五楼。到店后乘电梯上五楼，出电梯就能看到签到处。'
  },
  {
    pattern: /卫生间|洗手间|厕所/,
    answer: '卫生间在五楼。到场后看走廊指示牌，或者问一下签到处的工作人员就好。'
  },
  {
    pattern: /出口|离场|电梯|楼梯/,
    answer: '宴会厅主出口就在签到处一侧，消防通道请以现场绿色出口标识为准。'
  },
  {
    pattern: /停车|开车|车/,
    answer: '停车信息还在和酒店确认，确定后会更新在这里。'
  }
];

const FALLBACK_ANSWER =
  '这条信息我还没录入。你可以问我座位、婚礼时间、地点、停车或现场路线。';

export function getGuideAnswer(question: string): string {
  const rule = RULES.find(({ pattern }) => pattern.test(question));
  return rule ? rule.answer : FALLBACK_ANSWER;
}

export const QUICK_QUESTIONS = [
  { label: '我的座位在哪里', question: '我的座位在哪里' },
  { label: '今天的婚礼流程', question: '今天的婚礼流程' },
  { label: '婚礼地点', question: '婚礼地点' },
  { label: '停车信息', question: '停车信息' },
  { label: '卫生间在哪里', question: '卫生间在哪里' },
  { label: '出口在哪里', question: '出口在哪里' }
];
