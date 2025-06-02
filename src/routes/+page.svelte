<script lang="ts">
	import { extractAdIdFromUrl, extractVideoUrl } from '$lib/utils';

	let adUrl = '';
	let videoUrl: string | null = null;

	async function handleExtract() {
		const adId = extractAdIdFromUrl(adUrl);
		if (!adId) return alert('잘못된 광고 URL입니다.');

		videoUrl = await extractVideoUrl(adId);

		if (!videoUrl) {
			alert('❌ 동영상을 찾을 수 없습니다.');
		}
	}
</script>

<input bind:value={adUrl} placeholder="광고 URL 입력" />
<button on:click={handleExtract}>🎥 광고 동영상 추출</button>

{#if videoUrl}
	<video controls src={videoUrl} width="100%" />
	<p><a href={videoUrl} download>📥 다운로드</a></p>
{/if}