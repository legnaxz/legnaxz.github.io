export async function fetchFbVideo(adUrl: string) {
    const apiBase = 'https://aa7b-118-130-112-221.ngrok-free.app'; // ngrok 주소
    const encodedUrl = encodeURIComponent(adUrl);
    const endpoint = `${apiBase}/fb-video?url=${encodedUrl}`;

    const response = await fetch(endpoint, {
        headers: {
            'ngrok-skip-browser-warning': 'true'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return await response.json(); // ✅ { videoUrl, title, filename }
}