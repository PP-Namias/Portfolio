// Thanks @shadcn

"use client"

import { useEffect, useRef } from "react"

import type { PreviewSearchParams } from "@/app/(preview)/lib/search-params"

type ParentToIframeMessage = {
  type: "preview-params"
  data: PreviewSearchParams
}

export const isInIframe = () => {
  if (typeof window === "undefined") {
    return false
  }
  return window.self !== window.top
}

const ALLOWED_PARENT_HOSTS = new Set(["namias.tech", "ppnamias.com"])

export function useIframeMessageListener<
  Message extends ParentToIframeMessage,
  MessageType extends Message["type"],
>(
  messageType: MessageType,
  onMessage: (data: Extract<Message, { type: MessageType }>["data"]) => void
) {
  const onMessageRef = useRef(onMessage)

  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  useEffect(() => {
    if (!isInIframe()) {
      return
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== window.parent) return
      let allowedOrigin = false
      if (event.origin) {
        try {
          const host = new URL(event.origin).hostname
          allowedOrigin = host === window.location.hostname || ALLOWED_PARENT_HOSTS.has(host)
        } catch {
          allowedOrigin = false
        }
      } else {
        allowedOrigin = true
      }
      if (!allowedOrigin) return
      if (event.data.type === messageType) {
        onMessageRef.current(event.data.data)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [messageType])
}

export function sendToIframe<
  Message extends ParentToIframeMessage,
  MessageType extends Message["type"],
>(
  iframe: HTMLIFrameElement | null,
  messageType: MessageType,
  data: Extract<Message, { type: MessageType }>["data"]
) {
  if (!iframe?.contentWindow) {
    return
  }

  iframe.contentWindow.postMessage(
    {
      type: messageType,
      data,
    },
    "*"
  )
}
