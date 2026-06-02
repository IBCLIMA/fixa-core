"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, MicOff, Check, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

// Extend Window for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface Props {
  onTranscription: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export function VoiceRecorder({ onTranscription, placeholder, className }: Props) {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
    }
  }, []);

  const startRecording = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition: SpeechRecognitionInstance = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "es-ES";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = "";
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalText) {
        setTranscript((prev) => prev + finalText);
      }
      setInterimText(interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        setSupported(false);
      }
      setRecording(false);
    };

    recognition.onend = () => {
      // Auto-restart if still recording (browser may stop automatically)
      if (recognitionRef.current === recognition && recording) {
        try {
          recognition.start();
        } catch {
          setRecording(false);
        }
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
    setTranscript("");
    setInterimText("");
  }, [recording]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setRecording(false);
    setInterimText("");
  }, []);

  const confirmTranscription = useCallback(() => {
    const text = transcript.trim();
    if (text) {
      onTranscription(text);
    }
    stopRecording();
    setTranscript("");
  }, [transcript, onTranscription, stopRecording]);

  if (!supported) {
    return null; // Silently hide if not supported
  }

  // Not recording, show mic button
  if (!recording && !transcript) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={`h-8 w-8 rounded-full text-muted-foreground hover:text-brand ${className || ""}`}
        onClick={startRecording}
        title="Nota de voz"
      >
        <Mic className="h-4 w-4" />
      </Button>
    );
  }

  // Recording or has transcript
  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      {recording && (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="h-8 w-8 rounded-full animate-pulse"
          onClick={stopRecording}
          title="Detener grabación"
        >
          <Square className="h-3 w-3" />
        </Button>
      )}

      {(transcript || interimText) && (
        <p className="text-xs text-muted-foreground flex-1 min-w-0 truncate">
          {transcript}
          {interimText && (
            <span className="text-muted-foreground/50 italic">{interimText}</span>
          )}
        </p>
      )}

      {(transcript || !recording) && transcript && (
        <Button
          type="button"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={confirmTranscription}
          title="Confirmar texto"
        >
          <Check className="h-3 w-3" />
        </Button>
      )}

      {!recording && !transcript && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-muted-foreground hover:text-brand"
          onClick={startRecording}
          title="Nota de voz"
        >
          <Mic className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
