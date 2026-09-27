import type { CmsState } from './types';

export async function fetchSite(): Promise<CmsState> {
  const response = await fetch('/api/site');
  if (!response.ok) throw new Error('Impossible de charger le site. Veuillez réessayer.');
  const data = await response.json();
  return data.payload as CmsState;
}

export async function saveSite(payload: CmsState, password: string): Promise<void> {
  const response = await fetch('/api/site', {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payload, password }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Enregistrement impossible.');
  }
}
