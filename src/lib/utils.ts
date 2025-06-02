// src/lib/utils.ts
export function extractAdId(url: string): string | null {
	const match = url.match(/[\?&]id=(\d+)/);
	return match ? match[1] : null;
}

// src/lib/utils.ts

export async function extractVideoUrl(adId: string): Promise<string | null> {
	const response = await fetch(`https://www.facebook.com/ads/library/?id=${adId}`, {
		mode: 'cors'
	});

	const text = await response.text();

	const match = text.match(/"playable_url":"(https:\/\/video[^"]+)"/);
	if (match) {
		return decodeURIComponent(match[1].replace(/\\u0025/g, '%').replace(/\\\//g, '/'));
	}

	return null;
}