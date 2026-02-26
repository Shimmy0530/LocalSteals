"use client";

import { useState, useEffect, useCallback } from "react";
import { app, getMessaging, getToken, isSupported } from "@/lib/firebase-client";

type PermissionState = "loading" | "unsupported" | "unconfigured" | "default" | "granted" | "denied";

export default function NotificationSetup() {
  const [permState, setPermState] = useState<PermissionState>("loading");
  const [isRegistering, setIsRegistering] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // ── Check support & current permission on mount ──────────────
  const checkStatus = useCallback(async () => {
    // Check if Firebase config is actually set
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (!vapidKey || !projectId) {
      setPermState("unconfigured");
      return;
    }

    // Check if browser supports notifications & Firebase messaging
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermState("unsupported");
      return;
    }

    try {
      const supported = await isSupported();
      if (!supported) {
        setPermState("unsupported");
        return;
      }
    } catch {
      setPermState("unsupported");
      return;
    }

    setPermState(Notification.permission as "default" | "granted" | "denied");
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // ── Enable notifications: request permission + get FCM token ──
  const enableNotifications = async () => {
    setIsRegistering(true);
    setFeedback(null);

    try {
      // Request browser permission
      const permission = await Notification.requestPermission();
      setPermState(permission as "default" | "granted" | "denied");

      if (permission !== "granted") {
        setIsRegistering(false);
        return;
      }

      // Get service worker registration (Serwist serves sw.js)
      const swRegistration = await navigator.serviceWorker.getRegistration("/sw.js");
      if (!swRegistration) {
        // Try waiting briefly for SW to register
        await navigator.serviceWorker.ready;
      }
      const registration =
        swRegistration ?? (await navigator.serviceWorker.getRegistration());

      if (!registration) {
        setFeedback({
          type: "error",
          message: "Service worker not found. Try refreshing the page.",
        });
        setIsRegistering(false);
        return;
      }

      // Get FCM token
      const messaging = getMessaging(app);
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (!token) {
        setFeedback({
          type: "error",
          message: "Could not get notification token. Try again.",
        });
        setIsRegistering(false);
        return;
      }

      // Store token on the server
      const res = await fetch("/api/fcm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        throw new Error("Server rejected the token");
      }

      setFeedback({
        type: "success",
        message: "Notifications enabled! You'll get deal alerts here.",
      });
    } catch (err) {
      console.error("FCM registration error:", err);
      setFeedback({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  // ── Loading state ───────────────────────────────────────────
  if (permState === "loading") {
    return (
      <div className="flex items-center gap-2">
        <div
          className="skeleton-shimmer h-2 w-2 rounded-full"
        />
        <div className="skeleton-shimmer h-4 w-32 rounded" />
      </div>
    );
  }

  // ── Firebase not configured ─────────────────────────────────
  if (permState === "unconfigured") {
    return (
      <div
        className="rounded-lg px-3 py-2.5 text-xs"
        style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}
      >
        <p style={{ color: "#a3a3a3" }}>
          Push notifications are not configured yet. Set your Firebase environment
          variables (<code style={{ color: "#E8772E" }}>NEXT_PUBLIC_FIREBASE_*</code>{" "}
          and <code style={{ color: "#E8772E" }}>NEXT_PUBLIC_FIREBASE_VAPID_KEY</code>)
          to enable this feature.
        </p>
      </div>
    );
  }

  // ── Browser doesn't support notifications ───────────────────
  if (permState === "unsupported") {
    return (
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: "#737373" }}
        />
        <span className="text-xs" style={{ color: "#737373" }}>
          Push notifications are not supported in this browser.
        </span>
      </div>
    );
  }

  // ── Permission granted ──────────────────────────────────────
  if (permState === "granted") {
    return (
      <div>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full pulse-dot"
            style={{ backgroundColor: "#2D6A4F" }}
          />
          <span className="text-xs font-medium" style={{ color: "#2D6A4F" }}>
            Notifications enabled
          </span>
        </div>
        {feedback?.type === "success" && (
          <p className="mt-2 text-[10px] fade-in" style={{ color: "#40916C" }}>
            {feedback.message}
          </p>
        )}
      </div>
    );
  }

  // ── Permission denied ───────────────────────────────────────
  if (permState === "denied") {
    return (
      <div>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "#D63B2F" }}
          />
          <span className="text-xs" style={{ color: "#D63B2F" }}>
            Blocked by browser
          </span>
        </div>
        <p className="mt-2 text-[10px]" style={{ color: "#D63B2F" }}>
          Notifications were blocked. To enable them, click the lock icon in your
          browser&apos;s address bar and allow notifications, then refresh this page.
        </p>
      </div>
    );
  }

  // ── Default: not yet asked ──────────────────────────────────
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "#737373" }}
          />
          <span className="text-xs" style={{ color: "#a3a3a3" }}>
            Not enabled
          </span>
        </div>

        <button
          onClick={enableNotifications}
          disabled={isRegistering}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
          style={{
            backgroundColor: isRegistering ? "#1a1a1a" : "#E8772E",
            color: isRegistering ? "#737373" : "#0a0a0a",
            cursor: isRegistering ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (!isRegistering) e.currentTarget.style.backgroundColor = "#D45D10";
          }}
          onMouseLeave={(e) => {
            if (!isRegistering) e.currentTarget.style.backgroundColor = "#E8772E";
          }}
        >
          {isRegistering && (
            <div
              className="w-3 h-3 border-2 rounded-full animate-spin"
              style={{ borderColor: "#555", borderTopColor: "#a3a3a3" }}
            />
          )}
          {isRegistering ? "Enabling..." : "Enable Notifications"}
        </button>
      </div>

      {feedback?.type === "error" && (
        <p className="mt-2 text-[10px] fade-in" style={{ color: "#D63B2F" }}>
          {feedback.message}
        </p>
      )}
    </div>
  );
}
