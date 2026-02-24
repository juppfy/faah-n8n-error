const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

// ─── Static files (v2 UI) ────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// Serve the shared MP3 from v1's public folder
app.use('/sounds', express.static(path.join(__dirname, '..', 'public')));

// ─── SSE Client Registry ─────────────────────────────────────────────────────
const clients = new Set();

app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    res.write('event: connected\ndata: {"status":"connected"}\n\n');
    clients.add(res);
    console.log(`✅ Client connected. Total: ${clients.size}`);

    const keepAlive = setInterval(() => res.write(': ping\n\n'), 20000);

    req.on('close', () => {
        clearInterval(keepAlive);
        clients.delete(res);
        console.log(`❌ Client disconnected. Total: ${clients.size}`);
    });
});

// ─── Sound trigger (SSE broadcast) ───────────────────────────────────────────
function broadcastSound(workflow = null, executionId = null) {
    const payload = JSON.stringify({
        event: 'play-sound',
        workflow,
        executionId,
        timestamp: new Date().toISOString(),
    });

    let count = 0;
    for (const client of clients) {
        client.write(`event: play-sound\ndata: ${payload}\n\n`);
        count++;
    }

    console.log(`🔊 Sound! Clients notified: ${count} | Workflow: "${workflow || 'unknown'}" | Exec: ${executionId || '-'}`);
    return count;
}

app.get(['/play-sound', '/error-sound'], (req, res) => {
    const workflow = req.query.workflow || null;
    const executionId = req.query.executionId || null;
    const notified = broadcastSound(workflow, executionId);

    res.json({
        success: true,
        message: '🔊 Sound triggered!',
        clientsNotified: notified,
        workflow,
        executionId,
        timestamp: new Date().toISOString(),
    });
});

// ─── n8n Proxy ───────────────────────────────────────────────────────────────
// Accepts credentials in POST body (never in URL / query string)
// Forwards to n8n API and returns results. Credentials are NOT stored.
app.post('/n8n-proxy', async (req, res) => {
    const { baseUrl, apiKey, lastId } = req.body;

    if (!baseUrl || !apiKey) {
        return res.status(400).json({ error: 'baseUrl and apiKey are required' });
    }

    // Sanitise base URL (strip trailing slash)
    const base = baseUrl.replace(/\/$/, '');

    try {
        // Dynamically import node-fetch compatible with Node 18+
        const url = `${base}/api/v1/executions?status=error&limit=25&includeData=false`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-N8N-API-KEY': apiKey,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const text = await response.text();
            return res.status(response.status).json({
                error: `n8n responded with ${response.status}`,
                detail: text.slice(0, 300),
            });
        }

        const data = await response.json();
        const executions = data.data || data.results || data || [];

        // Filter: only return executions newer than lastId (client tracks this)
        const filtered = lastId
            ? executions.filter(e => e.id > lastId)
            : executions.slice(0, 5); // First load: return last 5 only

        res.json({ executions: filtered, total: executions.length });
    } catch (err) {
        console.error('n8n proxy error:', err.message);
        res.status(502).json({ error: 'Could not reach n8n', detail: err.message });
    }
});

// ─── Health ──────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({ status: 'ok', version: 2, connectedClients: clients.size });
});

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log('');
    console.log('  🎵  Faah Error Sound — v2 (n8n Monitor)');
    console.log('  ─────────────────────────────────────────');
    console.log(`  🌐  Open browser →  http://localhost:${PORT}`);
    console.log(`  🔁  Polls n8n API automatically once connected`);
    console.log(`  🔒  Credentials stay in browser sessionStorage`);
    console.log('  ─────────────────────────────────────────');
    console.log('');
});
