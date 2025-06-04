<script lang="ts">
  import { fetchFbVideo } from '$lib/api/fetchVideo';

  let adUrl = '';
  let videoUrl: string | null = null;
  let videoTitle: string = '';
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
  errorMessage = '';

  try {
    const data = await fetchFbVideo(adUrl);
    if (data.videoUrl) {
      videoUrl = data.videoUrl;
      videoTitle = data.title || 'facebook_video';

      // ✅ 자동 다운로드 트리거
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = sanitizeFilename(videoTitle) + '.mp4';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // ✅ UI 초기화
      setTimeout(() => {
        adUrl = '';
        videoUrl = null;
        videoTitle = '';
        errorMessage = '';
      }, 1000); // 1초 뒤 초기화
    } else {
      errorMessage = '동영상을 찾을 수 없습니다.';
    }
  } catch (err) {
    errorMessage = `요청 실패: ${err.message}`;
  } finally {
    isLoading = false;
  }
}

  // 파일명에서 특수문자 제거 (크롬 안정성)
  function sanitizeFilename(name: string): string {
    return name.replace(/[^a-z0-9가-힣_\- ]/gi, '_').slice(0, 50);
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
        download={sanitizeFilename(videoTitle) + '.mp4'}
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