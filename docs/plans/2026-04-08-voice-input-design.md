# Voice Input — Phase 1 Design

**Date:** 2026-04-08
**Status:** Approved
**Phase:** 1 (Transcription only)

---

## Overview

A start/stop voice recorder using the browser's Web Speech API that displays an editable transcript with copy functionality. This is Phase 1 — transcription only. Phase 2 will handle structured data extraction from the transcript.

---

## User Stories

- As a provider, I want to dictate patient information using my microphone so I don't have to type
- As a provider, I want to review and edit the transcript before using it
- As a provider, I want to copy the transcript to my clipboard for pasting into notes

---

## UI Components

### Recording Section

**Start/Stop Button:**
- Large, prominent button
- Default state: "Start Recording" with microphone icon
- Active state: "Stop Recording" with red styling and pulsing animation
- Disabled state while processing

**Recording Indicator:**
- Pulsing red dot when recording is active
- Animated microphone icon during recording
- Text showing recording duration (optional)

### Transcript Section

**Transcript Display:**
- Large text area (textarea) for displaying transcript
- Editable by the user for corrections
- Placeholder text: "Your transcript will appear here..."
- Scrollable for long transcripts
- Minimum height to show several lines

**Empty State:**
- Shows placeholder when no transcript exists
- Subtle hint text encouraging user to start recording

### Actions

**Copy to Clipboard:**
- Button below transcript: "Copy to Clipboard"
- Shows "Copied!" confirmation briefly after clicking
- Icon: clipboard or copy icon

**Clear/Reset:**
- Secondary button to clear transcript and start fresh
- Only visible when transcript exists

---

## State Management

```typescript
interface VoiceInputState {
  recordingState: 'idle' | 'recording' | 'processing';
  transcript: string;
  interimTranscript: string; // Live results during recording
}
```

**Persistence:** Use existing `useSessionState` hook to persist transcript across page navigation.

---

## Technical Approach

### Web Speech API

Use the browser's native `SpeechRecognition` API:

```typescript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;       // Keep listening until stopped
recognition.interimResults = true;  // Show interim results
recognition.lang = 'en-US';         // English only (Phase 1)
```

### Event Handlers

- `onresult` — Handle transcription results
- `onerror` — Handle errors (microphone denied, no speech detected, etc.)
- `onend` — Recording stopped by user
- `onstart` — Recording started

### Error Handling

| Error | User Message |
|-------|--------------|
| `not-allowed` | "Microphone access denied. Please allow microphone access to use voice input." |
| `no-speech` | "No speech detected. Please try again." |
| `network` | "Network error. Please check your connection." |
| `audio-capture` | "No microphone found. Please connect a microphone." |

### Browser Support

- Chrome/Edge: Full support
- Firefox: Limited support (may need fallback message)
- Safari: Partial support (webkit prefix)

Check for `SpeechRecognition` support and show fallback message if unsupported.

---

## File Structure

```
src/
├── pages/
│   └── VoiceInput.tsx          # Main voice input page
├── hooks/
│   └── useSpeechRecognition.ts # Custom hook for Web Speech API
└── ...
```

---

## Component Inventory

### VoiceInput Page

**States:**
- `idle` — Initial state, shows "Start Recording" button
- `recording` — Active recording, shows "Stop Recording" button + live transcript
- `processing` — Brief state while stopping, button disabled
- `error` — Error message displayed, can retry
- `unsupported` — Browser doesn't support Web Speech API

### Recording Button

**States:**
- Default: Gray/outlined, microphone icon, "Start Recording"
- Recording: Red background, pulsing, "Stop Recording"
- Disabled: Grayed out, during processing
- Error: Shows retry option

### Transcript Area

**States:**
- Empty: Placeholder text shown
- Has Content: Transcript displayed, editable
- Live: Interim transcript shown in lighter color, final in darker

---

## Out of Scope (Phase 1)

- Language selection (English only for now)
- Structured data extraction to form fields (Phase 2)
- Audio playback
- Audio file storage
- Multi-language support
- Whisper integration (cloud or local)

---

## Future Considerations (Phase 2+)

- Parse transcript for structured data (demographics, diagnosis, treatment)
- Auto-populate form fields from transcript
- Support for Spanish language
- Whisper integration for better accuracy
- Audio playback of recorded speech
