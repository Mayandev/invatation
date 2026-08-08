export interface RsvpRecord {
  name: string;
  attendance: 'yes' | 'no';
  guestSide: 'groom' | 'bride';
  guests: number;
  message: string;
  ticketNumber: string;
}

const FEISHU_APP_ID = process.env.FEISHU_APP_ID || '';
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET || '';
const FEISHU_WIKI_TOKEN = process.env.FEISHU_WIKI_TOKEN || '';
const FEISHU_TABLE_ID = process.env.FEISHU_TABLE_ID || '';

export const FEISHU_ENABLED = Boolean(
  FEISHU_APP_ID && FEISHU_APP_SECRET && FEISHU_WIKI_TOKEN && FEISHU_TABLE_ID
);

interface TenantTokenCache {
  value: string;
  expiresAt: number;
}

let feishuTokenCache: TenantTokenCache | null = null;
let feishuAppTokenCache = '';

async function getFeishuTenantToken(): Promise<string> {
  if (feishuTokenCache && feishuTokenCache.expiresAt > Date.now() + 60_000) {
    return feishuTokenCache.value;
  }
  const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: FEISHU_APP_ID, app_secret: FEISHU_APP_SECRET })
  });
  const data = await response.json();
  if (!response.ok || data.code || !data.tenant_access_token) {
    throw new Error(data.msg || '飞书应用认证失败');
  }
  feishuTokenCache = {
    value: data.tenant_access_token,
    expiresAt: Date.now() + Math.max(60, Number(data.expire || 7200) - 120) * 1000
  };
  return feishuTokenCache.value;
}

async function getFeishuAppToken(token: string): Promise<string> {
  if (feishuAppTokenCache) return feishuAppTokenCache;
  const response = await fetch(
    `https://open.feishu.cn/open-apis/wiki/v2/spaces/get_node?token=${encodeURIComponent(FEISHU_WIKI_TOKEN)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await response.json();
  if (!response.ok || data.code || data.data?.node?.obj_type !== 'bitable') {
    throw new Error(data.msg || '无法解析飞书多维表格链接');
  }
  feishuAppTokenCache = data.data.node.obj_token;
  return feishuAppTokenCache;
}

export async function createFeishuRsvp(rsvp: RsvpRecord): Promise<string> {
  const token = await getFeishuTenantToken();
  const appToken = await getFeishuAppToken(token);
  const response = await fetch(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${FEISHU_TABLE_ID}/records`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          宾客姓名: rsvp.name,
          是否赴宴: rsvp.attendance === 'no' ? '遥寄祝福' : '欣然赴约',
          亲友关系: rsvp.guestSide === 'bride' ? '女方亲友' : '男方亲友',
          赴宴人数: rsvp.attendance === 'no' ? 0 : rsvp.guests,
          祝福: rsvp.message,
          电子票号: rsvp.ticketNumber,
          核销状态: '待核销'
        }
      })
    }
  );
  const data = await response.json();
  if (!response.ok || data.code) throw new Error(data.msg || '飞书登记写入失败');
  return data.data?.record?.record_id || '';
}
