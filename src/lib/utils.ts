// src/lib/utils.ts
export function extractAdIdFromUrl(url: string): string | null {
	const match = url.match(/id=(\d+)/);
	return match ? match[1] : null;
}

// 실사용 전용 proxy backend 없이 동작하긴 어려움
export async function extractVideoUrl(adId: string): Promise<string | null> {
	// 테스트용 공개 mp4
	return 'https://www.w3schools.com/html/mov_bbb.mp4';
}