<script lang="ts">
  import { onMount } from 'svelte';
  let adUrl = '';
  let videoUrl: string | null = null;
  let isLoading = false;
  let errorMessage = '';
  let videoTitle = '';

  async function extractVideoUrl() {
    if (!adUrl.includes('facebook.com/ads/library/?id=')) {
      errorMessage = '올바른 Facebook 광고 URL을 입력해주세요.';
      return;
    }

    isLoading = true;
    videoUrl = null;
    errorMessage = '';
    videoTitle = '';

    const apiBase = 'https://6671-118-130-112-221.ngrok-free.app';
    const encodedUrl = encodeURIComponent(adUrl);
    const endpoint = `${apiBase}/fb-video?url=${encodedUrl}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      if (data.videoUrl) {
        videoUrl = data.videoUrl;
        videoTitle = (data.title || 'facebook_ad_video').replace(/[^a-zA-Z0-9가-힣-_ ]/g, '').replaceAll(' ', '_');
        triggerDownload(videoUrl, `${videoTitle}.mp4`);
      } else {
        errorMessage = '동영상을 찾을 수 없습니다.';
      }
    } catch (err) {
      errorMessage = `요청 실패: ${err.message}`;
    } finally {
      isLoading = false;
    }
  }

  function triggerDownload(url: string, filename: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  }
</script>

<main class="p-6 max-w-xl mx-auto space-y-4">
  <h1 class="text-2xl font-bold">📽️ Facebook 광고 영상 추출기</h1>

  <input
    class="w-full p-2 border rounded"
    bind:value={adUrl}
    placeholder="Facebook 광고 URL을 붙여넣으세요"
  />

  <button
    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
    on:click={extractVideoUrl}
    disabled={isLoading}
  >
    {isLoading ? '추출 중...' : '🎬 동영상 추출하기'}
  </button>

  {#if errorMessage}
    <p class="text-red-500">❌ {errorMessage}</p>
  {/if}

  {#if videoUrl}
    <div class="mt-4">
      <p class="font-semibold text-green-600">✅ 추출 성공!</p>
      <video class="w-full mt-2" controls src={videoUrl}></video>
    </div>
  {/if}
</main>