// src/lib/utils.ts
export function extractAdId(url: string): string | null {
	const match = url.match(/[\?&]id=(\d+)/);
	return match ? match[1] : null;
}
