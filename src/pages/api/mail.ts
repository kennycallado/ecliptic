import { transporter } from "$lib/server/services/mail.ts";

import type { AstroSharedContext as Ctx } from "astro";

export const prerender = false;

export async function POST({ request }: Ctx): Promise<Response> {
  if (request.headers.get("Content-Type") === "application/json") {
    const { subject, message } = await request.json();

    try {
      await transporter.sendMail({
        from: '"Info 🤓" <dev.impulsa@ipsitec.es>',
        to: "kennycallado@hotmail.com",
        subject,
        text: message,
        html: `<b>${message}</b>`,
      });
    } catch (e) {
      console.error("Error sending email:", e);
      return new Response("Error sending email", { status: 500 });
    }

    return new Response("ok", { status: 200 });
  }

  return new Response("Invalid request", { status: 400 });
}
