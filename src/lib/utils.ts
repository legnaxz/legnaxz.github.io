// src/lib/utils.ts

// 광고 링크에서 전체 URL을 그대로 리턴
export function extractAdUrl(rawUrl: string): string | null {
	try {
		const url = new URL(rawUrl);
		if (url.hostname.includes('facebook.com') && url.pathname.includes('/ads/library/')) {
			return url.href;
		}
		return null;
	} catch {
		return null;
	}
}

// 비디오 추출 요청
export async function extractVideoUrl(adUrl: string): Promise<string | null> {
	try {
		const response = await fetch(`https://4221-118-130-112-221.ngrok-free.app/fb-video?url=${encodeURIComponent(adUrl)}`);
		const data = await response.json();
		return data.videoUrl || null;
	} catch (error) {
		console.error('❌ 동영상 추출 실패:', error);
		return null;
	}
}