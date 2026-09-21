import webpush from "web-push";
import { db } from "@/lib/db";

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

let configured = false;

function ensureConfigured() {
  if (configured) return;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );
  configured = true;
}

export async function sendPushToSubscription(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: PushPayload,
) {
  ensureConfigured();
  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: { p256dh: subscription.p256dh, auth: subscription.auth },
      },
      JSON.stringify(payload),
    );
    return { ok: true as const };
  } catch (err) {
    const statusCode =
      err && typeof err === "object" && "statusCode" in err
        ? (err as { statusCode: number }).statusCode
        : undefined;
    return { ok: false as const, expired: statusCode === 404 || statusCode === 410 };
  }
}

export async function broadcastPush(payload: PushPayload) {
  const subscriptions = await db.pushSubscription.findMany();
  let sent = 0;
  for (const sub of subscriptions) {
    const result = await sendPushToSubscription(sub, payload);
    if (result.ok) {
      sent++;
    } else if (result.expired) {
      await db.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
    }
  }
  return { sent, total: subscriptions.length };
}
