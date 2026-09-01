import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  Mic,
  MicOff,
  Search,
  Sparkles,
} from 'lucide-react';

interface VoiceRecognitionAlternative {
  transcript: string;
}

interface VoiceRecognitionResult {
  readonly 0: VoiceRecognitionAlternative;
  isFinal: boolean;
}

interface VoiceRecognitionEvent {
  resultIndex: number;
  results: ArrayLike<VoiceRecognitionResult>;
}

interface VoiceRecognitionErrorEvent {
  error?: string;
}

interface VoiceRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: VoiceRecognitionEvent) => void) | null;
  onerror: ((event: VoiceRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type VoiceRecognitionConstructor = new () => VoiceRecognition;
type VoiceRecognitionErrorCode =
  | 'aborted'
  | 'audio-capture'
  | 'bad-grammar'
  | 'language-not-supported'
  | 'network'
  | 'no-speech'
  | 'not-allowed'
  | 'service-not-allowed'
  | string;

declare global {
  interface Window {
    SpeechRecognition?: VoiceRecognitionConstructor;
    webkitSpeechRecognition?: VoiceRecognitionConstructor;
  }
}

interface HeroSearchProps {
  onSearch: (query?: string, category?: string) => void;
}

const METRICS = [
  { label: 'Authority format', value: 'LDLR' },
  { label: 'Practice areas', value: '20+' },
  { label: 'Jurisdictions', value: '37' },
];

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState('');
  const recognitionRef = useRef<VoiceRecognition | null>(null);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) onSearch(searchQuery.trim());
    else onSearch();
  };

  const getVoiceErrorMessage = (error?: VoiceRecognitionErrorCode) => {
    switch (error) {
      case 'not-allowed':
      case 'service-not-allowed':
        return 'Please allow microphone access in your browser, then try again.';
      case 'audio-capture':
        return 'No working microphone was found. Check your device microphone.';
      case 'no-speech':
        return 'I did not hear anything. Tap the mic and speak clearly.';
      case 'network':
        return 'Voice recognition needs an internet connection in this browser.';
      case 'language-not-supported':
        return 'This browser does not support the selected voice language.';
      case 'aborted':
        return '';
      default:
        return 'Voice input could not be captured. Please try again.';
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setVoiceMessage('');
      return;
    }

    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceMessage('Voice search is not supported in this browser.');
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let transcript = '';
      let isFinal = false;

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += event.results[index][0]?.transcript ?? '';
        isFinal = isFinal || event.results[index].isFinal;
      }

      const cleanTranscript = transcript.trim();
      if (!cleanTranscript) return;

      setSearchQuery(cleanTranscript);
      setVoiceMessage(isFinal ? 'Voice captured.' : 'Listening...');

      if (isFinal) {
        onSearch(cleanTranscript);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setVoiceMessage(getVoiceErrorMessage(event.error));
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
      setIsListening(true);
      setVoiceMessage('Listening...');
    } catch {
      setIsListening(false);
      setVoiceMessage('Voice input could not be started. Please try again.');
    }
  };

  return (
    <section className="lawpex-hero-motion lawpex-home-hero relative isolate overflow-hidden border-b border-white/10 bg-[#003f37] text-white">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <img
          src="/hero-justice.jpg"
          alt=""
          loading="eager"
          fetchPriority="high"
          className="lawpex-hero-image absolute inset-0 h-full w-full scale-[1.03] object-cover object-[55%_48%] opacity-75 sm:object-[58%_46%] lg:opacity-85"
        />
        <div className="lawpex-hero-wash absolute inset-0" />
      </div>

      <div className="mx-auto flex min-h-[620px] max-w-7xl flex-col items-center justify-center px-5 pb-14 pt-16 text-center sm:min-h-[680px] sm:px-8 sm:pb-16 sm:pt-20 lg:px-12 lg:pb-20 lg:pt-24">
        <div className="max-w-[820px]">
          <div className="lawpex-hero-reveal inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-xs font-bold uppercase text-white/85 shadow-lg backdrop-blur-md [--hero-delay:80ms]">
            <Sparkles className="h-3.5 w-3.5" />
            Nigerian litigation workspace
          </div>

          <h1 className="lawpex-hero-reveal mx-auto mt-5 max-w-[780px] text-[2.5rem] font-bold leading-[1.08] text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.72)] sm:mt-6 sm:text-[4rem] sm:leading-[1.08] [--hero-delay:190ms]">
            Nigerian litigation, <span className="lawpex-hero-highlight">clearly connected.</span>
          </h1>
        </div>

        <form
          onSubmit={submitSearch}
          className="lawpex-hero-search-shell lawpex-hero-reveal mt-8 w-full max-w-4xl rounded-[1.15rem] border border-white/15 bg-[#171717]/95 p-1.5 text-left shadow-[0_28px_70px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:mt-9 sm:p-2 [--hero-delay:340ms]"
        >
          <div className="grid grid-cols-[minmax(0,1fr)_3rem_3rem] items-center gap-1.5 sm:flex sm:gap-2 sm:items-center">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Search LAWPEX</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/55 sm:left-5 sm:h-5 sm:w-5" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Ask a legal question, search a citation, statute, rule or draft..."
                className="lawpex-focus-ring min-h-[52px] w-full rounded-xl border border-transparent bg-transparent py-3 pl-10 pr-2 text-base font-medium text-white placeholder:text-white/45 focus:border-white/10 focus:bg-white/5 focus:outline-none sm:min-h-[58px] sm:py-3.5 sm:pl-13 sm:pr-4"
              />
            </label>

            <button
              type="button"
              onClick={toggleVoiceInput}
              aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
              aria-pressed={isListening}
              className={`lawpex-focus-ring inline-flex min-h-[52px] min-w-[48px] items-center justify-center rounded-xl border text-base font-semibold transition active:scale-[0.98] sm:min-h-[58px] sm:min-w-[58px] ${
                isListening
                  ? 'border-[#f7c915] bg-[#f7c915] text-[#181411]'
                  : 'border-white/10 bg-white/5 text-white/80 hover:border-white/25 hover:bg-white/10'
              }`}
            >
              {isListening ? <MicOff className="h-[18px] w-[18px] sm:h-5 sm:w-5" /> : <Mic className="h-[18px] w-[18px] sm:h-5 sm:w-5" />}
            </button>

            <button
              type="submit"
              aria-label="Search LAWPEX"
              className="lawpex-focus-ring inline-flex min-h-[52px] min-w-[48px] items-center justify-center rounded-xl border border-[#f7c915] bg-[#f7c915] text-[#181411] shadow-[0_8px_24px_-12px_rgba(247,201,21,0.8)] transition hover:bg-[#ffe05a] active:scale-[0.98] sm:min-h-[58px] sm:min-w-[58px]"
            >
              <ArrowRight className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
            </button>
          </div>

          {voiceMessage && (
            <p
              className={`px-2 pt-2 text-xs font-bold ${
                isListening ? 'text-[#f7d94c]' : 'text-white/65'
              }`}
              aria-live="polite"
            >
              {voiceMessage}
            </p>
          )}
        </form>

        <div className="lawpex-hero-reveal mt-7 flex w-full max-w-2xl flex-wrap justify-center gap-2 sm:mt-9 [--hero-delay:520ms]">
          {METRICS.map((metric, index) => (
            <div
              key={metric.label}
              style={{ '--hero-delay': `${620 + index * 90}ms` } as React.CSSProperties}
              className="lawpex-hero-reveal min-w-[104px] rounded-full border border-white/12 bg-black/55 px-4 py-2.5 text-left shadow-lg backdrop-blur-md sm:min-w-[132px]"
            >
              <div className="text-base font-black text-white sm:text-lg">
                {metric.value}
              </div>
              <div className="mt-0.5 text-[10px] font-bold uppercase text-white/65 sm:text-[11px]">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
