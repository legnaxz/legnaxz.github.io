// ✅ backend: server.js
import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';
const app = express();
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('ngrok-skip-browser-warning', 'true'); // 👈 반드시 필요
    next();
});
app.get('/fb-video', async (req, res) => {
    const rawUrl = req.query.url;
    if (!rawUrl || !rawUrl.includes('facebook.com/ads/library/?id=')) {
        return res.status(400).json({ error: 'Invalid or missing URL' });
    }

    console.log('▶️ Opening URL:', rawUrl);
    try {
        const browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']  // ✅ 추가
        });
        const page = await browser.newPage();
        await page.goto(rawUrl, { waitUntil: 'networkidle2', timeout: 30000 });

        // 재생 버튼 클릭 시도
        try {
            console.log('✅ 재생버튼 탐지 시도');
            await page.waitForSelector('div[aria-label="재생"], div[aria-label="Play"]', { timeout: 15000 });

            console.log('🎯 재생버튼 클릭');
            await page.click('div[aria-label="재생"], div[aria-label="Play"]');

            console.log('⏳ 비디오 로딩 대기 중...');
            await page.waitForTimeout(5000);

            const content = await page.content();
            console.log('📄 HTML 길이:', content.length);

            // 1차 시도: playable_url 찾기
            let match = content.match(/"playable_url":"(https:\\u002F\\u002Fvideo[^"]+)"/);
            let title = await page.$eval('meta[property="og:title"]', el => el.content).catch(() => null);

            let videoUrl = null;

            if (match) {
                console.log('✅ playable_url 발견됨');
                videoUrl = decodeURIComponent(match[1].replace(/\\u002F/g, '/'));
            } else {
                console.warn('⚠️ playable_url 없음, video 태그 시도');
                videoUrl = await page.$eval('video', el => el.src).catch(() => null);
            }

            await browser.close();

            return res.json({ videoUrl, title });
        } catch (e) {
            console.warn('⚠️ 재생 버튼 클릭 실패 또는 타임아웃');
        }

        const content = await page.content();
        const match = content.match(/"playable_url":"(https:\\u002F\\u002Fvideo[^"]+)"/);
        const title = await page.$eval('meta[property="og:title"]', el => el.content).catch(() => null);

        await browser.close();

        if (match) {
            const url = match[1].replace(/\\u002F/g, '/');
            return res.json({ videoUrl: decodeURIComponent(url), title });
        } else {
            return res.json({ videoUrl: null });
        }
    } catch (err) {
        console.error('puppeteer error:', err);
        return res.status(500).json({ error: 'Puppeteer failed' });
    }
});

app.listen(3000, '0.0.0.0', () => {
    console.log('✅ Proxy with puppeteer ready on http://0.0.0.0:3000');
});
