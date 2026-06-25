import { Product } from './types';

const SHEET_ID = '1T1ls-VUXfvBRAE4vOt5-b94POeZpG83jS4-SIqiN09U';
const SHEET_NAME = 'Product';

export function sanitizeDriveImage(url: string): string {
  const u = (url || '').toString().trim();
  if (!u) return '';
  let m = u.match(/\/d\/([a-zA-Z0-9_-]{10,})\//);
  if (m) return `https://lh3.googleusercontent.com/d/${m[1]}=w1600`;
  m = u.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
  if (m) return `https://lh3.googleusercontent.com/d/${m[1]}=w1600`;
  m = u.match(/uc\?export=view&(?:amp;)?id=([a-zA-Z0-9_-]{10,})/);
  if (m) return `https://lh3.googleusercontent.com/d/${m[1]}=w1600`;
  return u;
}

export async function fetchProducts(): Promise<Product[]> {
  const query = 'select A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T';
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(SHEET_NAME)}&tq=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch from spreadsheet');
    const text = await res.text();
    
    // Extract JSON portion between google.visualization.Query.setResponse( and );
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/);
    if (!match) throw new Error('Invalid response format from Google Sheets');
    
    const parsed = JSON.parse(match[1]);
    const rows = parsed.table?.rows || [];
    
    const validStocks = ['in stock', 'instock', 'available'];
    
    const items: Product[] = rows.map((r: any, i: number) => {
      const c = r.c || [];
      return {
        name: (c[0]?.v ?? c[3]?.v ?? 'ไม่ระบุชื่อ').toString(),
        detail: (c[3]?.v ?? '').toString(),
        price:
          (c[10]?.v === null ||
            c[10]?.v === undefined ||
            c[10]?.v === '' ||
            c[10]?.v === 0)
            ? 'ยังไม่ระบุราคา'
            : c[10]?.v,
        image: (c[17]?.v ?? '').toString(),
        shopeeLink: (c[18]?.v ?? '').toString(),
        stock: (c[6]?.v ?? '').toString().trim().toLowerCase(),
        category: (c[15]?.v ?? '').toString().trim().toLowerCase(),
        _rowIndex: i
      };
    }).filter((p: Product) => validStocks.includes(p.stock));
    
    return items;
  } catch (err) {
    console.error('Error fetching Google Sheets products:', err);
    throw err;
  }
}
