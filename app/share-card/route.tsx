import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const runtime = 'nodejs';

const shareImagePath = join(
  process.cwd(),
  'public',
  'assets',
  'wedding-photos',
  'selected-hero-v2-share.webp'
);

export async function GET() {
  const image = await readFile(shareImagePath);

  return new Response(new Uint8Array(image), {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
}
