const one = (s, max) => String(s ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/contact") return env.ASSETS.fetch(request);
    if (request.method !== "POST") return json({ ok: false }, 405);

    let d;
    try { d = await request.json(); } catch { return json({ ok: false }, 400); }

    // Anti-spam : le champ cache doit rester vide
    if (d.website) return json({ ok: true });

    const name = one(d.name, 100);
    const email = one(d.email, 150);
    const company = one(d.company, 120);
    const subject = one(d.subject, 120) || "Contact";
    const message = String(d.message ?? "").trim().slice(0, 4000);
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || message.length < 5) {
      return json({ ok: false, error: "invalid" }, 400);
    }

    const text = [
      `Nom : ${name}`,
      `E-mail : ${email}`,
      `Entreprise : ${company || "-"}`,
      `Sujet : ${subject}`,
      `Langue du site : ${one(d.lang, 5) || "-"}`,
      "",
      message,
    ].join("\n");

    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: env.CONTACT_FROM,
          to: [env.CONTACT_TO],
          reply_to: email,
          subject: `[Tradeline] ${subject} - ${name}`,
          text,
        }),
      });
      if (!r.ok) return json({ ok: false, error: "send_failed" }, 502);
      return json({ ok: true });
    } catch {
      return json({ ok: false, error: "send_failed" }, 502);
    }
  },
};
