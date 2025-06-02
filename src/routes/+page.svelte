<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { extractAdId } from '$lib/utils';

	let adUrl = '';
	let adId: string | null = null;

	function handleSubmit() {
		adId = extractAdId(adUrl);
		if (adId) {
			console.log('✅ 추출된 광고 ID:', adId);
		} else {
			alert('유효한 Facebook 광고 URL이 아닙니다.');
		}
	}
</script>

<div class="p-6 max-w-xl mx-auto">
	<h1 class="text-2xl font-bold mb-4">📺 광고 동영상 추출기</h1>

	<input
		class="border px-3 py-2 w-full rounded mb-3"
		type="text"
		placeholder="Facebook 광고 상세 URL 입력"
		bind:value={adUrl}
	/>

	<button
		class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
		on:click={handleSubmit}
	>
		광고 ID 추출
	</button>

	{#if adId}
		<p class="mt-4 text-green-600 font-medium">🔎 광고 ID: {adId}</p>
	{/if}
</div>
