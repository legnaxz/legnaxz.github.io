<!-- src/routes/+page.svelte -->
<script lang="ts">
	let adUrl = '';
	let adId: string | null = null;

	function extractAdIdFromUrl(url: string): string | null {
		// 여기서 실제 Facebook 광고 URL에서 ID를 추출하는 로직을 구현할 수 있어
		// 예: https://www.facebook.com/ads/library/?id=1234567890
		const match = url.match(/id=(\d+)/);
		return match ? match[1] : null;
	}

	function handleSubmit() {
		adId = extractAdIdFromUrl(adUrl);
		if (adId) {
			console.log('✅ 추출된 광고 ID:', adId);
			downloadAdId(adId);
		} else {
			alert('유효한 Facebook 광고 URL이 아닙니다.');
		}
	}

	function downloadAdId(id: string) {
		const blob = new Blob([id], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = 'ad-id.txt';
		a.click();

		URL.revokeObjectURL(url);
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
		📥 광고 ID 추출 및 다운로드
	</button>

	{#if adId}
		<p class="mt-4 text-green-600 font-medium">🔎 추출된 광고 ID: <strong>{adId}</strong></p>
	{/if}
</div>
