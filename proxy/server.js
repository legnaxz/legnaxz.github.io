import express from 'express';
import puppeteer from 'puppeteer';

const app = express();

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/fb-video', async (req, res) => {
    const adUrl = req.query.url;

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.goto(adUrl, { waitUntil: 'networkidle2', timeout: 60000 });

        // 광고 재생 버튼 강제 클릭
        await page.evaluate(() => {
            const button = document.querySelector('div[role="button"][tabindex]');
            if (button) button.click();
        });

        // 약간 기다림 (JS 동적 로딩 대비)
        await new Promise(resolve => setTimeout(resolve, 3000));

        const content = await page.content();

        const match = content.match(/"playable_url":"(https:\/\/video[^"]+)"/);
        await browser.close();

        if (match) {
            const cleanedUrl = match[1].replace(/\\\//g, '/');
            return res.json({ videoUrl: decodeURIComponent(cleanedUrl) });
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