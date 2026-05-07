"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Mic, Send, Square, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: Event) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEvent = {
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
  resultIndex: number;
};

function getSpeechRecognition():
  | (new () => SpeechRecognitionLike)
  | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

function messageText(msg: UIMessage): string {
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

const SUGGESTED = [
  "What are you building right now?",
  "What did you learn from Monroe?",
  "Why Stanford GSB?",
];

export default function ChatInterface() {
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );
  const { messages, sendMessage, status, stop, error } = useChat({ transport });

  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [interim, setInterim] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const audioQueueRef = useRef<HTMLAudioElement[]>([]);
  const playingRef = useRef(false);
  const ttsCursorRef = useRef(0);
  const ttsMessageIdRef = useRef<string | null>(null);
  const voiceEnabledRef = useRef(voiceEnabled);

  const streaming = status === "streaming" || status === "submitted";

  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
    if (!voiceEnabled) {
      audioQueueRef.current.forEach((a) => {
        a.pause();
        URL.revokeObjectURL(a.src);
      });
      audioQueueRef.current = [];
      playingRef.current = false;
    }
  }, [voiceEnabled]);

  useEffect(() => {
    setVoiceSupported(Boolean(getSpeechRecognition()));
  }, []);

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, interim]);

  const playNext = useCallback(() => {
    const next = audioQueueRef.current.shift();
    if (!next) {
      playingRef.current = false;
      return;
    }
    playingRef.current = true;
    next.onended = () => {
      URL.revokeObjectURL(next.src);
      playNext();
    };
    next.play().catch(() => {
      URL.revokeObjectURL(next.src);
      playNext();
    });
  }, []);

  const enqueueTTS = useCallback(
    async (text: string) => {
      if (!voiceEnabledRef.current) return;
      const trimmed = text.trim();
      if (!trimmed) return;
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: trimmed }),
        });
        if (!res.ok) return;
        const blob = await res.blob();
        if (!voiceEnabledRef.current) return;
        const audio = new Audio(URL.createObjectURL(blob));
        audioQueueRef.current.push(audio);
        if (!playingRef.current) playNext();
      } catch {
        /* voice is best-effort */
      }
    },
    [playNext],
  );

  // Per-sentence TTS as the latest assistant message streams in.
  useEffect(() => {
    const last = messages.at(-1);
    if (!last || last.role !== "assistant") return;

    if (ttsMessageIdRef.current !== last.id) {
      ttsMessageIdRef.current = last.id;
      ttsCursorRef.current = 0;
    }

    const fullText = messageText(last);
    const remaining = fullText.slice(ttsCursorRef.current);
    const boundary = /[.!?]+(?:\s|$)/g;
    let lastEnd = 0;
    let m: RegExpExecArray | null;
    while ((m = boundary.exec(remaining)) !== null) {
      const end = m.index + m[0].length;
      const sentence = remaining.slice(lastEnd, end).trim();
      if (sentence.length >= 4) enqueueTTS(sentence);
      lastEnd = end;
    }
    ttsCursorRef.current += lastEnd;

    if (status === "ready") {
      const leftover = fullText.slice(ttsCursorRef.current).trim();
      if (leftover) enqueueTTS(leftover);
      ttsCursorRef.current = fullText.length;
    }
  }, [messages, status, enqueueTTS]);

  const submit = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;
      sendMessage({ text: trimmed });
      setInput("");
      setInterim("");
    },
    [sendMessage, streaming],
  );

  const toggleListening = useCallback(() => {
    const SR = getSpeechRecognition();
    if (!SR) return;

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalText = "";
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        if (result.isFinal) finalText += transcript;
        else interimText += transcript;
      }
      setInterim(interimText);
    };
    recognition.onerror = () => {
      setListening(false);
      setInterim("");
    };
    recognition.onend = () => {
      setListening(false);
      setInterim("");
      const combined = (input ? input + " " : "") + finalText.trim();
      if (combined.trim()) submit(combined);
    };

    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }, [listening, input, submit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(input);
  };

  return (
    <div className="flex h-[calc(100dvh-3.5rem-1px)] flex-col">
      <div className="border-b border-border/60">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-4 sm:px-8">
          <div>
            <h1 className="font-display text-lg font-semibold">
              Chat with Ben
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              An AI clone trained on Ben&rsquo;s writing and a profile he wrote.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setVoiceEnabled((v) => !v)}
            aria-label={voiceEnabled ? "Mute voice" : "Unmute voice"}
            aria-pressed={voiceEnabled}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {voiceEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div ref={scrollerRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8">
          {messages.length === 0 && (
            <div className="space-y-4 text-muted-foreground">
              <p className="text-sm">
                Ask about Kasava, the Monroe years, what I learned at Flexport,
                or anything I&rsquo;ve written about. I&rsquo;ll talk back —
                literally, if your speakers are on.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {SUGGESTED.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => submit(q)}
                    disabled={streaming}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <ul className="space-y-6">
            {messages.map((m) => {
              const text = messageText(m);
              return (
                <li
                  key={m.id}
                  className={cn(
                    "flex flex-col gap-1",
                    m.role === "user" ? "items-end" : "items-start",
                  )}
                >
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {m.role === "user" ? "You" : "Ben"}
                  </span>
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-foreground text-background"
                        : "bg-muted text-foreground",
                    )}
                  >
                    {text || (
                      <span className="inline-flex gap-1">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:120ms]" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:240ms]" />
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {error && (
            <p className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error.message}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-border/60 bg-background">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-3xl items-end gap-2 px-5 py-4 sm:px-8"
        >
          <div className="relative flex-1">
            <textarea
              value={listening && interim ? input + " " + interim : input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              placeholder={
                listening ? "Listening…" : "Ask me anything. Enter to send."
              }
              rows={1}
              disabled={streaming}
              className="min-h-[44px] w-full resize-none rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none disabled:opacity-50"
            />
          </div>

          {voiceSupported && (
            <button
              type="button"
              onClick={toggleListening}
              disabled={streaming}
              aria-label={listening ? "Stop listening" : "Start voice input"}
              aria-pressed={listening}
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-md border transition-colors disabled:opacity-50",
                listening
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Mic className="h-4 w-4" />
            </button>
          )}

          {streaming ? (
            <button
              type="button"
              onClick={() => stop()}
              aria-label="Stop generating"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Square className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-foreground text-background transition-opacity hover:opacity-90 disabled:opacity-30"
            >
              <Send className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
