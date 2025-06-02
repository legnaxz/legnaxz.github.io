// src/lib/utils.ts
export function extractAdIdFromUrl(url: string): string | null {
	const match = url.match(/id=(\d+)/);
	return match ? match[1] : null;
}

export async function extractVideoUrl(adId: string): Promise<string | null> {
	try {
		const response = await fetch(`https://6aaf-118-130-112-221.ngrok-free.app/fb-video?id=${adId}`);
		const data = await response.json();
		return data.videoUrl || null;
	} catch (error) {
		console.error('❌ 동영상 추출 실패:', error);
		return null;
	}
}