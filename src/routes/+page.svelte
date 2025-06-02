const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();

app.use((_, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	next();
});

app.get('/fb-video', async (req, res) => {
	const id = req.query.id;
	if (!id) return res.status(400).json({ error: 'Missing ad ID' });

	const targetUrl = `https://www.facebook.com/ads/library/?id=${id}`;

	try {
		const html = await fetch(targetUrl, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/119 Safari/537.36',
			},
		}).then((r) => r.text());

		// 동영상 URL 추출 (JS 객체 파싱 기반)
		const match = html.match(/"playable_url":"(https:\\/\\/video[^"]+)"/);

		if (match) {
			const rawUrl = match[1];
			const cleanUrl = rawUrl
				.replace(/\\u0025/g, '%')
				.replace(/\\\//g, '/');
			return res.json({ videoUrl: decodeURIComponent(cleanUrl) });
		}

		// 백업 플랜: 고화질 URL 있는 경우
		const hdMatch = html.match(/"playable_url_quality_hd":"(https:\\/\\/video[^"]+)"/);
		if (hdMatch) {
			const rawUrl = hdMatch[1];
			const cleanUrl = rawUrl
				.replace(/\\u0025/g, '%')
				.replace(/\\\//g, '/');
			return res.json({ videoUrl: decodeURIComponent(cleanUrl) });
		}

		return res.json({ videoUrl: null });
	} catch (err) {
		console.error('❌ ERROR FETCHING:', err);
		return res.status(500).json({ error: 'Facebook 페이지 요청 실패' });
	}
});

app.listen(3000, () => console.log('✅ Proxy listening on http://localhost:3000'));