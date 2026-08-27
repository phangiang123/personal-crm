"use client";

import { useEffect, useState, useTransition } from "react";
import { saveSubscription, removeSubscription } from "@/lib/actions/push";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

type Status = "unsupported" | "loading" | "off" | "on" | "denied";

export function NotificationToggle() {
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    async function check() {
      if (
        typeof window === "undefined" ||
        !("serviceWorker" in navigator) ||
        !("PushManager" in window)
      ) {
        setStatus("unsupported");
        return;
      }
      if (Notification.permission === "denied") {
        setStatus("denied");
        return;
      }
      const reg = await navigator.serviceWorker.register("/sw.js");
      const sub = await reg.pushManager.getSubscription();
      setStatus(sub ? "on" : "off");
    }
    check().catch(() => setStatus("unsupported"));
  }, []);

  function enable() {
    setError(null);
    startTransition(async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setStatus(permission === "denied" ? "denied" : "off");
          return;
        }
        const reg = await navigator.serviceWorker.register("/sw.js");
        const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!publicKey) throw new Error("Thiếu cấu hình VAPID public key.");

        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
        const json = sub.toJSON();
        await saveSubscription({
          endpoint: sub.endpoint,
          p256dh: json.keys!.p256dh,
          auth: json.keys!.auth,
        });
        setStatus("on");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
      }
    });
  }

  function disable() {
    setError(null);
    startTransition(async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await removeSubscription(sub.endpoint);
          await sub.unsubscribe();
        }
        setStatus("off");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
      }
    });
  }

  if (status === "loading") return null;

  if (status === "unsupported") {
    return (
      <p className="text-sm text-neutral-500">
        Trình duyệt/thiết bị này chưa hỗ trợ thông báo đẩy. Trên iPhone, hãy
        &quot;Add to Home Screen&quot; trước rồi mở app từ màn hình chính để bật được.
      </p>
    );
  }

  if (status === "denied") {
    return (
      <p className="text-sm text-red-600">
        Bạn đã chặn quyền thông báo cho trang này. Vào cài đặt trình duyệt để
        cho phép lại.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-neutral-600">
        {status === "on"
          ? "Thông báo nhắc lịch liên hệ đang bật cho thiết bị này."
          : "Bật thông báo để được nhắc khi đến hạn liên hệ ai đó."}
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={status === "on" ? disable : enable}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {pending
          ? "Đang xử lý..."
          : status === "on"
            ? "Tắt thông báo trên thiết bị này"
            : "Bật thông báo"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
