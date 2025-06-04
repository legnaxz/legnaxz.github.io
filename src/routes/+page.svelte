<script lang="ts">
	import { extractVideoUrl } from '$lib/utils';

	let adUrl = '';
	let videoUrl: string | null = null;
	let isLoading = false;
	let error: string | null = null;

	async function handleSubmit() {
		isLoading = true;
		error = null;
		videoUrl = null;

		try {
			const result = await extractVideoUrl(adUrl);
			if (result) {
				videoUrl = result;
			} else {
				error = '❌ 동영상을 찾을 수 없습니다.';
			}
		} catch (e) {
			error = '⚠️ 오류 발생: ' + e;
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="p-6 max-w-xl mx-auto">
	<h1 class="text-2xl font-bold mb-4">🎥 Facebook 광고 동영상 추출기</h1>

	<input
		class="border px-3 py-2 w-full rounded mb-3"
		type="text"
		bind:value={adUrl}
		placeholder="광고 공유 링크 입력 (예: https://www.facebook.com/ads/library/?id=...)"
	/>

	<button
		class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
		on:click={handleSubmit}
		disabled={isLoading}
	>
		{isLoading ? '🔄 추출 중...' : '📥 동영상 추출'}
	</button>

	{#if error}
		<p class="text-red-500 mt-3">{error}</p>
	{/if}

	{#if videoUrl}
		<div class="mt-6">
			<video controls class="w-full rounded">
				<source src={videoUrl} type="video/mp4" />
				브라우저가 video 태그를 지원하지 않습니다.
			</video>
			<a href={videoUrl} download class="block mt-3 text-blue-600 hover:underline">
				⬇️ 동영상 다운로드
			</a>
		</div>
	{/if}
</div>