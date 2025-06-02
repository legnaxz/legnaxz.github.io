// src/lib/utils.ts

export function extractAdIdFromUrl(url: string): string | null {
	const match = url.match(/id=(\d+)/);
	return match ? match[1] : null;
}

export async function extractVideoUrl(adId: string): Promise<string | null> {
	try {
		const res = await fetch(`http://localhost:3000/fb-video?id=${adId}`);
		const data = await res.json();
		return data.videoUrl || null;
	} catch (err) {
		console.error('❌ 프록시 요청 실패:', err);
		return null;
	}
}