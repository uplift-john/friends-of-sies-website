// Cloudflare Pages Function: receives the volunteer form POST from
// /ways-to-give/#volunteer, verifies Turnstile, and emails the submission
// via Resend. Secrets (set in the Pages project dashboard, see FORM_SETUP.md):
//   RESEND_API_KEY, TURNSTILE_SECRET_KEY

const TO_ADDRESS = "siesfriends.skimmers@gmail.com";
const FROM_ADDRESS = "FRIENDS of SIES Website <website@siesfriends.org>";
const ALLOWED_INTERESTS = ["Spring Auction", "Fun Run", "General interest"];

function seeOther(location) {
  return new Response(null, { status: 303, headers: { Location: location } });
}

function backWithError(code) {
  return seeOther(`/ways-to-give/?form=${code}#volunteer`);
}

export async function onRequestPost({ request, env }) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return backWithError("invalid");
  }

  // Honeypot: bots fill the hidden "website" field. Pretend success.
  if (form.get("website")) {
    return seeOther("/volunteer-thanks/");
  }

  const name = String(form.get("name") || "").trim().slice(0, 200);
  const email = String(form.get("email") || "").trim().slice(0, 200);
  const message = String(form.get("message") || "").trim().slice(0, 2000);
  const interests = form
    .getAll("interest")
    .map(String)
    .filter((v) => ALLOWED_INTERESTS.includes(v));

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return backWithError("missing");
  }

  const token = form.get("cf-turnstile-response");
  if (!token) {
    return backWithError("turnstile");
  }
  const verifyRes = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: String(token),
        remoteip: request.headers.get("CF-Connecting-IP") || "",
      }),
    }
  );
  const verdict = await verifyRes.json();
  if (!verdict.success) {
    return backWithError("turnstile");
  }

  const lines = [
    "New volunteer interest via siesfriends.org",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Interested in: ${interests.length ? interests.join(", ") : "(none selected)"}`,
  ];
  if (message) {
    lines.push("", "Message:", message);
  }

  const sendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [TO_ADDRESS],
      reply_to: email,
      subject: `Volunteer interest: ${name}`,
      text: lines.join("\n"),
    }),
  });
  if (!sendRes.ok) {
    return backWithError("send");
  }

  return seeOther("/volunteer-thanks/");
}
