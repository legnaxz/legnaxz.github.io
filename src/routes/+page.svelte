<script lang="ts">
 import { fetchFbVideo } from '$lib/api/fetchVideo';

let adUrl = '';
let videoUrl: string | null = null;
let videoTitle: string = '';
let downloadFilename: string = '';
let isLoading = false;
let errorMessage = '';

async function extractVideoUrl() {
  if (!adUrl.includes('facebook.com/ads/library/?id=')) {
    errorMessage = '올바른 Facebook 광고 URL을 입력해주세요.';
    return;
  }

  isLoading = true;
  videoUrl = null;
  videoTitle = '';
  downloadFilename = '';
  errorMessage = '';

  try {
    const data = await fetchFbVideo(adUrl);
    if (data.videoUrl) {
      videoUrl = data.videoUrl;
      videoTitle = data.title || 'facebook_video';
      downloadFilename = data.filename || 'video.mp4'; // ✅ 백엔드가 준 이름 우선

      // ✅ 자동 다운로드
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      errorMessage = '동영상을 찾을 수 없습니다.';
    }
  } catch (err) {
    errorMessage = `요청 실패: ${err.message}`;
  } finally {
    isLoading = false;
  }
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
      <a
        class="block mt-2 text-blue-600 underline"
        href={videoUrl}
        target="_blank"
        download={filename}
      >
        ⬇️ 수동 다운로드
      </a>
    </div>
  {/if}
</main>

<style>
  main {
    font-family: sans-serif;
  }
</style>
