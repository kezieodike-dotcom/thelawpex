import React, { useRef, useState } from 'react';
import {
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

const QUICK_PROMPTS = [
  { label: 'Salu v. Egeibon on locus standi' },
  { label: 'Section 84 Evidence Act certificate' },
  { label: 'Interlocutory injunction motion' },
  { label: 'Court of Appeal notice on jurisdiction' },
];

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
    <section className="relative isolate overflow-hidden border-b border-amber-300 bg-[#fff7cf] text-[#181411]">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <img
          src="/hero-justice.jpg"
          alt=""
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full scale-[1.05] object-cover object-[56%_42%] opacity-[0.42] sm:object-[62%_45%] lg:opacity-[0.54]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,247,207,0.94)_0%,rgba(255,226,88,0.58)_45%,rgba(255,248,214,0.98)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(250,204,21,0.72),transparent_26rem),radial-gradient(circle_at_82%_18%,rgba(245,158,11,0.34),transparent_24rem)]" />
      </div>

      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-7xl flex-col items-center justify-center px-3 pb-10 pt-28 text-center sm:px-6 sm:py-14 lg:px-8">
        <div className="-translate-y-14 sm:translate-y-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500 bg-yellow-300/88 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#5f4104] shadow-sm backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5" />
            Nigerian litigation intelligence
          </div>

          <p className="mt-4 max-w-[21rem] font-serif text-lg font-black italic leading-7 text-[#181411] sm:mt-6 sm:max-w-2xl sm:text-2xl sm:leading-9">
            Research Nigerian law, prepare stronger arguments, and draft with confidence.
          </p>
        </div>

        <form
          onSubmit={submitSearch}
          className="mt-7 w-full max-w-4xl rounded-[1.45rem] border border-amber-400 bg-yellow-50/96 p-1.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_34px_90px_-54px_rgba(180,126,18,0.92)] backdrop-blur-2xl sm:mt-7 sm:rounded-[1.7rem] sm:p-2"
        >
          <div className="grid grid-cols-[minmax(0,1fr)_3rem_3rem] items-center gap-1.5 sm:flex sm:gap-2 sm:items-center">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Search LAWPEX</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-700 sm:left-5 sm:h-5 sm:w-5" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Ask a legal question, search a citation, statute, rule or draft..."
                className="lawpex-focus-ring min-h-12 w-full rounded-[1.05rem] border border-transparent bg-yellow-100/80 py-3 pl-10 pr-2 text-[13px] font-medium text-neutral-900 placeholder:text-neutral-500 focus:border-amber-400 focus:bg-white focus:outline-none sm:min-h-14 sm:rounded-2xl sm:py-4 sm:pl-13 sm:pr-4 sm:text-base"
              />
            </label>

            <button
              type="button"
              onClick={toggleVoiceInput}
              aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
              aria-pressed={isListening}
              className={`lawpex-focus-ring inline-flex min-h-12 min-w-12 items-center justify-center rounded-[1.05rem] border text-sm font-black transition active:scale-[0.98] sm:min-h-14 sm:min-w-14 sm:rounded-2xl ${
                isListening
                  ? 'border-yellow-300 bg-[#facc15] text-[#181411]'
                  : 'border-amber-200 bg-white text-amber-800 hover:border-amber-400 hover:bg-yellow-50'
              }`}
            >
              {isListening ? <MicOff className="h-[18px] w-[18px] sm:h-5 sm:w-5" /> : <Mic className="h-[18px] w-[18px] sm:h-5 sm:w-5" />}
            </button>

            <button
              type="submit"
              aria-label="Search LAWPEX"
              className="lawpex-focus-ring inline-flex min-h-12 min-w-12 items-center justify-center rounded-[1.05rem] bg-[#181411] text-yellow-200 transition hover:bg-[#2a2118] active:scale-[0.98] sm:min-h-14 sm:min-w-14 sm:rounded-2xl"
            >
              <Search className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
            </button>
          </div>

          {voiceMessage && (
            <p
              className={`px-2 pt-2 text-xs font-bold ${
                isListening ? 'text-amber-800' : 'text-neutral-600'
              }`}
              aria-live="polite"
            >
              {voiceMessage}
            </p>
          )}
        </form>

        <div className="mt-4 flex w-full max-w-4xl flex-nowrap justify-start gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt.label}
              onClick={() => {
                setSearchQuery(prompt.label);
              }}
              className="lawpex-focus-ring shrink-0 rounded-full border border-amber-300 bg-yellow-100/88 px-3 py-1.5 text-[11px] font-bold text-[#5f4104] shadow-sm backdrop-blur hover:border-amber-500 hover:bg-yellow-200 hover:text-neutral-950"
            >
              {prompt.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid w-full max-w-2xl grid-cols-3 divide-x divide-amber-300 overflow-hidden rounded-2xl border border-amber-300 bg-yellow-100/72 py-3 backdrop-blur sm:mt-8 sm:rounded-none sm:border-x-0 sm:py-4">
          {METRICS.map((metric) => (
            <div key={metric.label} className="px-3">
              <div className="text-xl font-black tracking-tight text-[#181411] sm:text-2xl">
                {metric.value}
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-800 sm:text-[11px]">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
