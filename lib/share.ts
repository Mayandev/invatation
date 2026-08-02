const MAX_GUEST_LENGTH = 24;

export function normalizeGuest(value: string | undefined | null): string {
  return (value || '')
    .replace(/[\r\n\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_GUEST_LENGTH);
}

export function getShareInvitation(guest: string | undefined | null): string {
  return `${normalizeGuest(guest) || '您'}，诚挚邀请您来参加我们的婚礼`;
}
