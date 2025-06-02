<!-- src/routes/+page.svelte -->
<script lang="ts">
	let adUrl = '';
	let adId: string | null = null;
	let videoUrl: string | null = null;

	// 광고 URL에서 adId 추출
	function extractAdIdFromUrl(url: string): string | null {
		const match = url.match(/id=(\d+)/);
		return match ? match[1] : null;
	}

	// 프록시 서버로부터 video URL 추출
	async function handleExtractVideo() {
		adId = extractAdIdFromUrl(adUrl);
		videoUrl = null;

		if (!adId) {
			alert('⚠️ 유효한 Facebook 광고 URL이 아닙니다.');
			return;
		}

		try {
			const res = await fetch(`http://localhost:3000/fb-video?id=${adId}`);
			const data = await res.json();

			if (data.videoUrl) {
				videoUrl = data.videoUrl;
			} else {
				alert('❌ 동영상을 찾을 수 없습니다.');
			}
		} catch (err) {
			console.error('❌ 동영상 추출 실패:', err);
			alert('❌ 동영상 추출 중 오류가 발생했습니다.');
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
		class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
		on:click={handleExtractVideo}
	>
		🎬 광고 동영상 추출
	</button>

	{#if adId}
		<p class="mt-4 text-green-600 font-medium">🔎 광고 ID: <strong>{adId}</strong></p>
	{/if}

	{#if videoUrl}
		<div class="mt-6">
			<p class="text-lg font-semibold mb-2">📽️ 추출된 동영상:</p>
			<video controls class="w-full rounded shadow">
				<source src={videoUrl} type="video/mp4" />
				Your browser does not support the video tag.
			</video>

			<a
				href={videoUrl}
				download="facebook-ad-video.mp4"
				class="block mt-4 text-blue-600 underline"
			>
				⬇️ 동영상 다운로드
			</a>
		</div>
	{/if}
</div>