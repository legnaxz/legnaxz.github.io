<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { extractAdIdFromUrl, extractVideoUrl } from '$lib/utils';

	let adUrl = '';
	let adId: string | null = null;
	let videoUrl: string | null = null;
	let isLoading = false;

	async function handleExtract() {
		adId = extractAdIdFromUrl(adUrl);
		if (!adId) {
			alert('❌ 유효한 Facebook 광고 URL이 아닙니다.');
			return;
		}

		isLoading = true;
		videoUrl = null;

		try {
			const url = await extractVideoUrl(adId);
			if (url) {
				videoUrl = url;
				console.log('✅ 추출된 videoUrl:', videoUrl);
			} else {
				alert('⚠️ 광고 영상 링크를 찾을 수 없습니다.');
			}
		} catch (e) {
			console.error('❌ 동영상 추출 중 오류:', e);
			alert('동영상을 가져오는 중 오류가 발생했습니다.');
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="p-6 max-w-xl mx-auto">
	<h1 class="text-2xl font-bold mb-4">📺 광고 동영상 추출기</h1>

	<input
		class="border px-3 py-2 w-full rounded mb-3"
		type="text"
		placeholder="예: https://www.facebook.com/ads/library/?id=1234567890"
		bind:value={adUrl}
	/>

	<button
		class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
		on:click={handleExtract}
		disabled={isLoading}
	>
		{isLoading ? '⏳ 추출 중...' : '🎥 광고 동영상 추출'}
	</button>

	{#if adId}
		<p class="mt-4 text-green-600">✅ 추출된 광고 ID: <strong>{adId}</strong></p>
	{/if}

	{#if isLoading}
		<p class="mt-2 text-gray-500">⏳ 동영상을 불러오는 중입니다...</p>
	{/if}

	{#if videoUrl}
		<video class="mt-6 w-full rounded" controls src={videoUrl}></video>
		<p class="mt-2 text-blue-600 underline">
			<a href={videoUrl} target="_blank" rel="noopener">🔗 원본 영상 링크 열기</a>
		</p>
	{/if}
</div>