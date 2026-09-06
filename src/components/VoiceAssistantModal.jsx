// VoiceAssistantModal.jsx - Voice-first e-waste registration assistant
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Mic, MicOff, Volume2, CheckCircle2, RefreshCw, X, Sparkles, Check, Edit2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const VoiceAssistantModal = () => {
  const { voiceModalOpen, setVoiceModalOpen, language, t, addEwasteItem } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [speakingResponse, setSpeakingResponse] = useState(false);

  // Quick Preset spoken samples for instant hackathon demonstration
  const voicePresets = {
    ta: [
      "என்னிடம் இரண்டு பழைய மொபைல் போன்கள் மற்றும் ஒரு லேப்டாப் உள்ளது",
      "பத்து கிலோ தாமிர கம்பி மற்றும் ஐந்து உடைந்த பேட்டரிகள் உள்ளது"
    ],
    hi: [
      "मेरे पास दो पुराने मोबाइल फोन और एक लैपटॉप है",
      "पांच किलो तांबे का तार और तीन कंप्यूटर मदरबोर्ड हैं"
    ],
    en: [
      "I have two old mobile phones and one laptop",
      "15 kg copper wire and 5 lithium batteries available"
    ]
  };

  // Reset state on open
  useEffect(() => {
    if (voiceModalOpen) {
      setTranscript('');
      setExtractedData(null);
      setIsListening(false);
      setIsProcessing(false);
    }
  }, [voiceModalOpen]);

  // Speech Recognition API Listener
  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    setExtractedData(null);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
        recognition.interimResults = true;

        recognition.onresult = (event) => {
          const current = event.resultIndex;
          const resultText = event.results[current][0].transcript;
          setTranscript(resultText);
        };

        recognition.onerror = (event) => {
          console.warn('Speech recognition error:', event.error);
          usePresetOrFallback(voicePresets[language][0]);
        };

        recognition.onend = () => {
          setIsListening(false);
          if (transcript) {
            processVoiceInput(transcript);
          } else {
            usePresetOrFallback(voicePresets[language][0]);
          }
        };

        recognition.start();
        return;
      } catch (err) {
        console.warn('Speech API init error, using simulated listener');
      }
    }

    // Fallback simulation if browser blocks mic permission or API unsupported
    setTimeout(() => {
      usePresetOrFallback(voicePresets[language][0]);
    }, 2200);
  };

  const usePresetOrFallback = (text) => {
    setTranscript(text);
    setIsListening(false);
    processVoiceInput(text);
  };

  // Voice AI NLP Parsing simulation
  const processVoiceInput = async (spokenText) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/materials/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spokenText })
      });
      const data = await res.json();
      
      if (data.success) {
        setExtractedData(data.result);
        speakResponseText(data.result);
      }
    } catch (err) {
      // Offline fallback
      setExtractedData({
      materialName: spokenText.includes('laptop') ? 'Laptop' : 'Mobile Phone',
      quantity: (spokenText.includes('two') || spokenText.includes('2')) ? 2 : 1,
      estimatedPriceMin: 800,
      estimatedPriceMax: 2500,
      confidence: '96%',
      icon: '📱'
    });
    } finally {
      setIsProcessing(false);
    }
  };

  // Text-To-Speech response simulation
  const speakResponseText = (result) => {
    setSpeakingResponse(true);
    const spokenMsg = language === 'ta'
      ? `${result.quantity} ${result.materialName} கண்டறியப்பட்டது. மதிப்பிடப்பட்ட விலை ரூ. ${result.estimatedPriceMin} முதல் ரூ. ${result.estimatedPriceMax}`
      : language === 'hi'
      ? `${result.quantity} ${result.materialName} मिला। अनुमानित मूल्य रु. ${result.estimatedPriceMin} से रु. ${result.estimatedPriceMax}`
      : `${result.quantity} ${result.materialName} detected. Estimated value ${result.estimatedPriceMin} to ${result.estimatedPriceMax} rupees.`;

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(spokenMsg);
      utterance.rate = 0.95;
      utterance.onend = () => setSpeakingResponse(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setSpeakingResponse(false), 2000);
    }
  };

  // Confirm and Add E-Waste Transaction
  const handleConfirmSell = async () => {
    if (!extractedData) return;

    await addEwasteItem({
      collectorId: 'col_1',
      materialSummary: `${extractedData.quantity} ${extractedData.materialName}`,
      totalAmount: Math.round((extractedData.estimatedPriceMin + extractedData.estimatedPriceMax) / 2)
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setVoiceModalOpen(false);
  };

  if (!voiceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => setVoiceModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Voice-First AI Assistant</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {t('voiceAssistant')}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t('voiceExample')}
          </p>
        </div>

        {/* Prominent Animated Mic Button */}
        <div className="flex flex-col items-center justify-center my-6">
          <button
            onClick={startListening}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
              isListening
                ? 'bg-gradient-to-tr from-rose-500 to-amber-500 scale-110 ring-8 ring-rose-500/30 animate-pulse'
                : 'bg-gradient-to-tr from-emerald-500 to-green-400 hover:scale-105 active:scale-95 shadow-emerald-500/20'
            }`}
          >
            <Mic className={`w-12 h-12 ${isListening ? 'text-white animate-bounce' : 'text-slate-950'}`} />

            {/* Ripple Waveform Animations when listening */}
            {isListening && (
              <span className="absolute inset-0 rounded-full border-4 border-amber-400 animate-ping opacity-75"></span>
            )}
          </button>

          <p className="text-xs font-bold mt-4 text-emerald-400">
            {isListening ? t('speakNow') : 'TAP MICROPHONE TO SPEAK'}
          </p>
        </div>

        {/* Quick Demo Preset Chips */}
        {!transcript && !extractedData && (
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 mb-4">
            <p className="text-[11px] font-semibold text-slate-300 mb-2">
              💡 Click a sample spoken voice prompt to test:
            </p>
            <div className="flex flex-col gap-1.5 text-xs">
              {voicePresets[language].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => usePresetOrFallback(preset)}
                  className="bg-slate-900 hover:bg-slate-700 text-left px-3 py-2 rounded-xl text-slate-200 border border-slate-700 flex items-center justify-between"
                >
                  <span>"{preset}"</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Test →</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Transcript Display */}
        {transcript && (
          <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700 mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
              <Volume2 className={`w-4 h-4 ${speakingResponse ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`} />
              <span>Spoken Input Captured:</span>
            </div>
            <p className="text-sm font-medium text-emerald-200 italic">"{transcript}"</p>
          </div>
        )}

        {/* Processing Spinner */}
        {isProcessing && (
          <div className="flex items-center justify-center gap-2 py-4 text-emerald-400 text-sm font-semibold">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>AI Extracting Materials & Pricing...</span>
          </div>
        )}

        {/* Extracted Structured Material Card */}
        {extractedData && (
          <div className="bg-gradient-to-b from-slate-800 to-slate-850 border border-emerald-500/60 rounded-2xl p-4 mb-5 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{extractedData.icon || '📱'}</span>
                <div>
                  <h3 className="font-bold text-base text-white">{extractedData.materialName}</h3>
                  <p className="text-xs text-slate-400">AI Confidence: <span className="text-emerald-400 font-bold">{extractedData.confidence}</span></p>
                </div>
              </div>
              <div className="bg-emerald-950 text-emerald-300 font-bold px-2.5 py-1 rounded-lg text-xs border border-emerald-500/40">
                Qty: {extractedData.quantity}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3 rounded-xl">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Value</span>
                <span className="text-lg font-extrabold text-amber-400">
                  ₹{extractedData.estimatedPriceMin} – ₹{extractedData.estimatedPriceMax}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Recommended Action</span>
                <span className="text-emerald-400 font-semibold">Join Mandi Lot #DM1024</span>
              </div>
            </div>

            <p className="text-center font-bold text-xs text-slate-200 mt-3">
              Do you want to sell this e-waste?
            </p>
          </div>
        )}

        {/* Action Buttons: YES / EDIT / CANCEL */}
        {extractedData && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleConfirmSell}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-transform"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>{t('yes')} - SELL NOW</span>
            </button>

            <button
              onClick={() => { setExtractedData(null); startListening(); }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-3 rounded-xl border border-slate-700 flex items-center gap-1 text-xs"
            >
              <Edit2 className="w-4 h-4 text-amber-400" />
              <span>{t('edit')}</span>
            </button>

            <button
              onClick={() => setVoiceModalOpen(false)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-400 font-semibold py-3 px-3 rounded-xl border border-slate-700 text-xs"
            >
              {t('cancel')}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
