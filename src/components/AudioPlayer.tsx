import { useEffect, useRef, useState, useCallback } from "react";
import Icon from "@/components/ui/icon";

export interface Track {
  title: string;
  author: string;
  genre: string;
  duration: string;
  plays: string;
}

interface AudioPlayerProps {
  track: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const GENRE_CONFIGS: Record<string, { baseFreq: number; type: OscillatorType; lfoSpeed: number; filterFreq: number }> = {
  Synthwave: { baseFreq: 220, type: "sawtooth", lfoSpeed: 2, filterFreq: 800 },
  "Lo-Fi": { baseFreq: 196, type: "triangle", lfoSpeed: 0.5, filterFreq: 600 },
  Electronic: { baseFreq: 261, type: "square", lfoSpeed: 4, filterFreq: 1200 },
  Ambient: { baseFreq: 174, type: "sine", lfoSpeed: 0.3, filterFreq: 400 },
  "Drum & Bass": { baseFreq: 293, type: "sawtooth", lfoSpeed: 6, filterFreq: 1500 },
  Chillstep: { baseFreq: 185, type: "triangle", lfoSpeed: 1, filterFreq: 700 },
};

const NOTE_PATTERNS: Record<string, number[]> = {
  Synthwave: [0, 3, 7, 12, 7, 3, 0, -5],
  "Lo-Fi": [0, 4, 7, 0, 3, 7, 12, 7],
  Electronic: [0, 0, 12, 0, 7, 0, 5, 0],
  Ambient: [0, 7, 12, 7, 5, 12, 7, 0],
  "Drum & Bass": [0, 0, 12, 7, 0, 0, 10, 5],
  Chillstep: [0, 5, 7, 12, 10, 7, 5, 0],
};

const AudioPlayer = ({ track, isPlaying, onPlayPause, onNext, onPrev }: AudioPlayerProps) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ osc: OscillatorNode; lfo: OscillatorNode; gain: GainNode; filter: BiquadFilterNode } | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const noteIndexRef = useRef(0);

  const parseDuration = (dur: string) => {
    const [m, s] = dur.split(":").map(Number);
    return m * 60 + s;
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const stopSynth = useCallback(() => {
    if (nodesRef.current) {
      try {
        nodesRef.current.gain.gain.linearRampToValueAtTime(0, (audioCtxRef.current?.currentTime || 0) + 0.1);
        setTimeout(() => {
          nodesRef.current?.osc.stop();
          nodesRef.current?.lfo.stop();
          nodesRef.current = null;
        }, 150);
      } catch {
        nodesRef.current = null;
      }
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startSynth = useCallback(() => {
    if (!track) return;

    const config = GENRE_CONFIGS[track.genre] || GENRE_CONFIGS.Ambient;
    const pattern = NOTE_PATTERNS[track.genre] || NOTE_PATTERNS.Ambient;

    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    osc.type = config.type;
    osc.frequency.value = config.baseFreq;

    filter.type = "lowpass";
    filter.frequency.value = config.filterFreq;
    filter.Q.value = 5;

    lfo.type = "sine";
    lfo.frequency.value = config.lfoSpeed;
    lfoGain.gain.value = config.baseFreq * 0.05;

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(volume * 0.15, ctx.currentTime + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    lfo.start();

    nodesRef.current = { osc, lfo, gain, filter };
    noteIndexRef.current = 0;

    const totalSec = parseDuration(track.duration);
    const noteInterval = 400;

    intervalRef.current = window.setInterval(() => {
      noteIndexRef.current = (noteIndexRef.current + 1) % pattern.length;
      const semitones = pattern[noteIndexRef.current];
      const freq = config.baseFreq * Math.pow(2, semitones / 12);

      if (nodesRef.current) {
        nodesRef.current.osc.frequency.linearRampToValueAtTime(freq, ctx.currentTime + 0.1);
      }

      setCurrentTime((prev) => {
        const next = prev + noteInterval / 1000;
        if (next >= totalSec) {
          onNext();
          return 0;
        }
        setProgress((next / totalSec) * 100);
        return next;
      });
    }, noteInterval);
  }, [track, volume, onNext]);

  useEffect(() => {
    stopSynth();
    setProgress(0);
    setCurrentTime(0);

    if (isPlaying && track) {
      startSynth();
    }

    return () => stopSynth();
  }, [track, isPlaying, startSynth, stopSynth]);

  useEffect(() => {
    if (nodesRef.current) {
      nodesRef.current.gain.gain.linearRampToValueAtTime(
        volume * 0.15,
        (audioCtxRef.current?.currentTime || 0) + 0.1
      );
    }
  }, [volume]);

  if (!track) return null;

  const totalSec = parseDuration(track.duration);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-accent/20">
      <div className="w-full h-1 bg-accent/10 cursor-pointer group" onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = ((e.clientX - rect.left) / rect.width) * 100;
        setProgress(pct);
        setCurrentTime((pct / 100) * totalSec);
      }}>
        <div
          className="h-full bg-gradient-to-r from-accent to-accent/70 transition-all duration-300 group-hover:h-1.5 relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-12 h-12 rounded-lg bg-accent/20 border border-accent/20 flex items-center justify-center flex-shrink-0">
            <Icon name="Music" size={18} className="text-accent" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-white truncate">{track.title}</p>
            <p className="text-xs text-muted-foreground truncate">{track.author}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onPrev} className="p-2 text-muted-foreground hover:text-white transition-colors">
            <Icon name="SkipBack" size={18} />
          </button>
          <button
            onClick={onPlayPause}
            className="w-10 h-10 rounded-full bg-accent flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Icon name={isPlaying ? "Pause" : "Play"} size={18} className="text-white" />
          </button>
          <button onClick={onNext} className="p-2 text-muted-foreground hover:text-white transition-colors">
            <Icon name="SkipForward" size={18} />
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{track.duration}</span>
        </div>

        <div className="hidden md:flex items-center gap-2 ml-4">
          <Icon name="Volume2" size={16} className="text-muted-foreground" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 accent-accent bg-accent/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
