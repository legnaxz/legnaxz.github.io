<script>
  import { onMount } from 'svelte';
  let adUrl = '';
  let extractedVideoUrl = '';
  let isLoading = false;
  let errorMessage = '';

  async function extractVideoUrl() {
    errorMessage = '';
    isLoading = true;
    extractedVideoUrl = '';
    const idMatch = adUrl.match(/id=(\d+)/);
    const adId = idMatch?.[1];

    if (!adId) {
      errorMessage = '유효한 광고 ID가 포함된 URL을 입력하세요';
      isLoading = false;
      return;
    }

    try {
      const response = await fetch(`https://46671-118-130-112-221.ngrok-free.app/fb-video?id=${encodeURIComponent(adId)}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (data.videoUrl) {
        extractedVideoUrl = data.videoUrl;
      } else {
        errorMessage = '비디오 URL을 찾을 수 없습니다';
      }
    } catch (err) {
      errorMessage = `❌ 동영상 추출 실패: ${err.message}`;
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="max-w-xl mx-auto p-4">
  <h1 class="text-xl font-bold mb-4">Facebook 광고 비디오 추출기</h1>

  <input
    type="text"
    bind:value={adUrl}
    class="w-full p-2 border border-gray-300 rounded mb-2"
    placeholder="Facebook 광고 URL을 입력하세요 (예: https://www.facebook.com/ads/library/?id=...)"
  />

  <button
    on:click={extractVideoUrl}
    class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
    disabled={isLoading || !adUrl}
  >
    {isLoading ? '추출 중...' : '비디오 추출'}
  </button>

  {#if errorMessage}
    <p class="text-red-600 mt-4">{errorMessage}</p>
  {/if}

  {#if extractedVideoUrl}
    <div class="mt-6">
      <p class="font-semibold mb-2">✅ 비디오 미리보기:</p>
      <video controls src={extractedVideoUrl} class="w-full max-w-md border" />
      <a
        href={extractedVideoUrl}
        download
        class="mt-2 inline-block text-blue-700 underline"
      >
        🔽 비디오 다운로드
      </a>
    </div>
  {/if}
</div>

<style>
  input:focus, button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
</style>
