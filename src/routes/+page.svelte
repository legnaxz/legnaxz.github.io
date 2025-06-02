<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { extractAdIdFromUrl, extractVideoUrl } from '$lib/utils';

	let adUrl = '';
	let adId: string | null = null;
	let videoUrl: string | null = null;

	async function handleExtract() {
		adId = extractAdIdFromUrl(adUrl);
		if (!adId) return alert('잘못된 광고 URL입니다.');

		videoUrl = await extractVideoUrl(adId);

		if (!videoUrl) {
			alert('❌ 동영상을 찾을 수 없습니다.');
		}
	}
</script>

<div class="p-6 max-w-xl mx-auto">
	<h1 class="text-2xl font-bold mb-4">📺 Facebook 광고 동영상 추출기</h1>

	<input
		type="text"
		bind:value={adUrl}
		placeholder="예: https://www.facebook.com/ads/library/?id=1234567890"
		class="border px-3 py-2 w-full rounded mb-3"
	/>

	<button
		on:click={handleExtract}
		class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
	>
		📥 광고 동영상 추출
	</button>

	{#if adId}
		<p class="mt-4 text-green-600">✅ 광고 ID: {adId}</p>
	{/if}

	{#if videoUrl}
		<video controls class="mt-4 w-full rounded">
			<source src={videoUrl} type="video/mp4" />
			비디오를 재생할 수 없습니다.
		</video>
	{/if}
</div>