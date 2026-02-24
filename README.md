# 🔊 faah-error-sound

> *"My workflows were failing silently. Now my whole house knows."*

---

## What is this? 🤔

It's a **Node.js server that screams at you** when your n8n workflow breaks.

That's it. That's the whole repo.

You leave a browser tab open. A workflow fails. Your computer goes:

## **FAHHHHH** 😭🔊

No more silently failing automations. No more checking logs at 2am wondering why nothing ran. The sound will find you.

---

## Is this production-ready? 🏭

**Absolutely not.**

Is it running in production? ...maybe.

---

## Tech Stack 🛠️

- Node.js (the serious part)
- Express (slightly less serious)
- Server-Sent Events (basically just vibes)
- One (1) MP3 file that makes people turn their heads

---

## Quick Start ⚡

```bash
npm install
npm start
```

Open **http://localhost:3001** — leave the tab open — watch your coworkers flinch.

---

## How it works 🔬

```
n8n workflow fails
       ↓
hits GET /error-sound
       ↓
server goes "hey browser tab!"
       ↓
browser tab goes "SAY LESS"
       ↓
MP3 plays at full volume
       ↓
you spill your coffee
       ↓
at least you know the workflow failed
```

---

## n8n Setup 🤖

1. Add an **Error Trigger** node
2. Connect to an **HTTP Request** node
3. Set Method: `GET`, URL: `http://localhost:3001/error-sound?workflow={{ $workflow.name }}`
4. Deploy
5. Pray it never triggers
6. It will trigger

---

## Endpoints 📡

| Route | What it does |
|---|---|
| `GET /play-sound` | 🔊 FAHHH |
| `GET /error-sound` | 🔊 also FAHHH (n8n alias) |
| `GET /health` | tells you how many tabs are suffering |
| `GET /events` | SSE stream (the browser uses this, you don't need to) |

Optional query param: `?workflow=MyWorkflowName` — shows the name of the guilty workflow in the UI, for extra shame.

---

## FAQ ❓

**Q: Why?**
A: Because `console.log("workflow failed")` doesn't give me the emotional response I need.

**Q: Is this a good idea?**
A: It's a *great* idea. It's also a terrible idea. It's both.

**Q: My coworkers keep getting startled.**
A: That's not a question but yes, that's a feature.

**Q: Can I change the sound?**
A: Replace the MP3 in `/public/` and update the `<audio>` src in `index.html`. Go wild. Air horn. Vine boom. The world is your oyster.

**Q: It's 3am and it just went off.**
A: Sorry. Also, check your workflows.

---

## Contributing 🤝

Found a bug? Open an issue.
Want to add a new sound? Open a PR.
Want to add a dark mode? It already has one. It's always dark mode. We live in the shadows now.

---

## License 📜

MIT — do whatever you want, just keep the chaos alive.

---

*Made with ☕ and mild anxiety about failing workflows.*
