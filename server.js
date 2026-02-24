const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── SSE Client Registry ────────────────────────────────────────────────────
const clients = new Set();

// ─── Static Files (serves index.html + the MP3) ─────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── SSE: Browser subscribes here to receive events ─────────────────────────
app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    // Send a heartbeat immediately so the client knows it's connected
    res.write('event: connected\ndata: {"status":"connected"}\n\n');

    const clientId = Date.now();
    clients.add(res);
    console.log(`✅ Client connected (id: ${clientId}). Total clients: ${clients.size}`);

    // Keep-alive ping every 20s to prevent timeouts
    const keepAlive = setInterval(() => {
        res.write(': ping\n\n');
    }, 20000);

    req.on('close', () => {
        clearInterval(keepAlive);
        clients.delete(res);
        console.log(`❌ Client disconnected (id: ${clientId}). Total clients: ${clients.size}`);
    });
});

// ─── Trigger Endpoint: Hit this to broadcast the sound ──────────────────────
function broadcastSound(workflowName = null) {
    const payload = JSON.stringify({
        event: 'play-sound',
        workflow: workflowName,
        timestamp: new Date().toISOString(),
    });

    let count = 0;
    for (const client of clients) {
        client.write(`event: play-sound\ndata: ${payload}\n\n`);
        count++;
    }

    console.log(`🔊 Sound triggered! Notified ${count} client(s).${workflowName ? ` Workflow: "${workflowName}"` : ''}`);
    return count;
}

// GET /play-sound  (also aliased as /error-sound)
app.get(['/play-sound', '/error-sound'], (req, res) => {
    const workflow = req.query.workflow || null;
    const notified = broadcastSound(workflow);

    res.json({
        success: true,
        message: '🔊 Sound triggered!',
        clientsNotified: notified,
        workflow,
        timestamp: new Date().toISOString(),
    });
});

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({ status: 'ok', connectedClients: clients.size });
});

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log('');
    console.log('  🎵  Faah Error Sound Server');
    console.log('  ─────────────────────────────────────────');
    console.log(`  🌐  Open browser →  http://localhost:${PORT}`);
    console.log(`  🚨  Trigger URL  →  http://localhost:${PORT}/play-sound`);
    console.log(`  📡  n8n webhook  →  GET http://localhost:${PORT}/error-sound`);
    console.log('  ─────────────────────────────────────────');
    console.log('');
});
