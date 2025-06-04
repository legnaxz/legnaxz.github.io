import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
app.use(express.json());

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/fb-video', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).json({ error: 'Missing URL' });

    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });

        // ✅ 재생 버튼 기다리고 클릭
        await page.waitForSelector('div[aria-label="재생"], div[aria-label="Play"]', { timeout: 15000 });
        await page.click('div[aria-label="재생"], div[aria-label="Play"]');

        // ✅ 영상 로딩 기다림
        await page.waitForSelector('video', { timeout: 10000 });

        // ✅ video src 추출
        const videoUrl = await page.evaluate(() => {
            const video = document.querySelector('video');
            return video?.src || null;
        });

        // ✅ 스크린샷 저장 (디버깅용)
        await page.screenshot({ path: 'debug.png', fullPage: true });

        await browser.close();

        res.json({ videoUrl });
    } catch (err) {
        console.error('puppeteer error:', err);
        res.status(500).json({ error: 'Puppeteer failed' });
    }
});

app.listen(3000, '0.0.0.0', () => {
    console.log('✅ Proxy with puppeteer ready on http://0.0.0.0:3000');
});