<script>
  import { onMount } from 'svelte';
  let adId = '';
  let videoUrl = '';
  let loading = false;
  let errorMessage = '';

  async function fetchVideo() {
    if (!adId) return;

    loading = true;
    videoUrl = '';
    errorMessage = '';

    try {
      const response = await fetch(`https://4221-118-130-112-221.ngrok-free.app/fb-video?url=https://www.facebook.com/ads/library/?id=${adId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.videoUrl) {
        videoUrl = data.videoUrl;
      } else {
        errorMessage = '❌ 동영상 URL을 찾지 못했습니다.';
      }
    } catch (error) {
      console.error('❌ 동영상 추출 실패:', error);
      errorMessage = `❌ 오류 발생: ${error.message}`;
    } finally {
      loading = false;
    }
  }
</script>

<main class="p-4 space-y-4">
  <h1 class="text-xl font-bold">Facebook 광고 동영상 추출기</h1>

  <input
    bind:value={adId}
    class="border p-2 rounded w-full"
    placeholder="광고 ID 입력 (예: 1502024377873930)" />

  <button on:click={fetchVideo} class="bg-blue-600 text-white px-4 py-2 rounded">
    동영상 추출
  </button>

  {#if loading}
    <p>🔄 추출 중입니다...</p>
  {:else if videoUrl}
    <div class="space-y-2">
      <p>✅ 추출 성공!</p>
      <a href={videoUrl} target="_blank" class="text-blue-500 underline">동영상 열기</a>
      <video src={videoUrl} controls class="w-full mt-2"></video>
    </div>
  {:else if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {/if}
</main>