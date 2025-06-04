// server.js
import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
app.use(express.json());

app.get('/fb-video', async (req, res) => {
    const { url } = req.query;

    if (!url) return res.status(400).json({ error: 'Missing Facebook post URL' });

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 45000,
        });

        // 동영상 재생 버튼 클릭 시도
        await page.evaluate(() => {
            const playButton = document.querySelector('div[role="button"][tabindex]');
            if (playButton) playButton.click();
        });

        await page.waitForTimeout(5000); // 동영상 로딩 대기

        // video 태그 안에 있는 mp4 링크 추출
        const videoUrl = await page.evaluate(() => {
            const video = document.querySelector('video');
            return video?.src || null;
        });

        await browser.close();

        if (videoUrl) {
            res.json({ videoUrl });
        } else {
            res.json({ videoUrl: null });
        }
    } catch (err) {
        console.error('❌ Puppeteer error:', err);
        res.status(500).json({ error: 'Puppeteer failed' });
    }
});

app.listen(3000, '0.0.0.0', () => {
    console.log('✅ Proxy ready at http://0.0.0.0:3000');
});