# 🔊 faah-n8n-error

> *"My workflows were failing silently. Now my whole house knows."*

It's an alarm system for n8n that **screams at you** in your browser when a workflow breaks. No more silently failing automations. The sound will find you. 

---

## 🛑 Choose Your Weapon

There are two ways to deploy this chaos. Pick your poison:

### [👉 Version 2: Instance-Wide Monitor (Recommended)](./v2.md)
The lazy dev's dream. Runs locally, connects securely to your n8n instance via API key (stored only in browser memory), polls every 10 seconds, and blasts the sound if *any* workflow fails anywhere. Bonus: Clickable links straight to the failed execution!

### [👉 Version 1: The Webhook Method (Classic)](./v1.md)
The OG approach. No API keys required. You just add an **HTTP Request** node to your n8n Error Trigger and point it at this server. Great if you only want the alarm on *specific* workflows.

---

## 🎵 Wait, what does it sound like?

It plays the glorious `/public/fahhh_KcgAXfs.mp3` file. 

Feel free to replace it with an air horn, a Vine boom, or a recording of your boss sighing. Just replace the MP3 file and restart.

---

## 🙋‍♂️ FAQ

**Q: Why?**
A: Because checking logs at 2am doesn't give me the emotional response I need.

**Q: Is this a good idea?**
A: It's a *great* idea. It's also a terrible idea. It's both.

**Q: My coworkers keep getting startled.**
A: That's not a question but yes, that's a feature.

**Q: It's 3am and it just went off.**
A: Sorry. Also, check your workflows.

---

## 📜 License
MIT — do whatever you want, just keep the chaos alive.

*Made with ☕ and mild anxiety about failing workflows.*
