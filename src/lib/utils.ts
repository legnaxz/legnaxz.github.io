// src/lib/utils.ts
export function extractAdIdFromUrl(url: string): string | null {
	const match = url.match(/id=(\d+)/);
	return match ? match[1] : null;
}

export async function extractVideoUrl(adId: string): Promise<string | null> {
	try {
		const response = await fetch(`http://localhost:3000/fb-video?id=${adId}`);
		const data = await response.json();
		return data.videoUrl || null;
	} catch (error) {
		console.error('❌ 동영상 추출 실패:', error);
		return null;
	}
}