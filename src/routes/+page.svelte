<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { extractAdIdFromUrl, extractVideoUrl } from '$lib/utils';

	let adUrl = '';
	let adId: string | null = null;
	let videoUrl: string | null = null;

	async function handleExtract() {
		adId = extractAdIdFromUrl(adUrl);

		if (!adId) {
			alert('❌ 유효한 Facebook 광고 URL이 아닙니다.');
			return;
		}

		console.log('✅ 추출된 광고 ID:', adId);
		videoUrl = await extractVideoUrl(adId);

		if (!videoUrl) {
			alert('❌ 동영상을 찾을 수 없습니다.');
		} else {
			console.log('✅ 추출된 videoUrl:', videoUrl);
		}
	}
</script>

<div class="p-6 max-w-xl mx-auto">
	<h1 class="text-2xl font-bold mb-4">📺 Facebook 광고 동영상 추출기</h1>

	<input
		class="border px-3 py-2 w-full rounded mb-3"
		type="text"
		placeholder="예: https://www.facebook.com/ads/library/?id=1234567890"
		bind:value={adUrl}
	/>

	<button
		class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
		on:click={handleExtract}
	>
		🔍 광고 동영상 추출
	</button>

	{#if adId}
		<p class="mt-4 text-green-700">✅ 광고 ID: <strong>{adId}</strong></p>
	{/if}

	{#if videoUrl}
		<div class="mt-6">
			<p class="text-green-800 font-semibold">🎥 동영상 미리보기:</p>
			<video class="mt-2 rounded w-full" controls src={videoUrl}></video>

			<a
				href={videoUrl}
				download={`facebook-ad-${adId}.mp4`}
				class="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
			>
				⬇️ 동영상 다운로드
			</a>
		</div>
	{/if}
</div>