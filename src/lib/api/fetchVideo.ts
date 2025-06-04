// src/lib/api/fetchVideo.ts

export async function fetchFbVideo(adUrl: string): Promise<string | null> {
    const ngrokProxyUrl = 'https://6671-118-130-112-221.ngrok-free.app/fb-video';

    try {
        const response = await fetch(`${ngrokProxyUrl}?url=${encodeURIComponent(adUrl)}`, {
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        return data.videoUrl || null;
    } catch (err) {
        console.error('❌ 요청 실패:', err);
        return null;
    }
}