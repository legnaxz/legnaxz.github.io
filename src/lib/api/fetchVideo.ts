// src/lib/api/fetchVideo.ts
export async function fetchFbVideo(adUrl: string) {
    const apiBase = 'https://6671-118-130-112-221.ngrok-free.app';
    const encodedUrl = encodeURIComponent(adUrl);
    const endpoint = `${apiBase}/fb-video?url=${encodedUrl}`;

    const response = await fetch(endpoint, {
        headers: {
            'ngrok-skip-browser-warning': 'true', // ✅ Ngrok 경고 회피
            'User-Agent': 'Chrome'                // ✅ 보조 우회 방법
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
}