import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import clsx from 'clsx';

const VoiceInput = ({ onTranscript, isProcessing }) => {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = 'en-US';

            recognitionInstance.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                onTranscript(transcript);
                setIsListening(false);
            };

            recognitionInstance.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognitionInstance.onend = () => {
                setIsListening(false);
            };

            setRecognition(recognitionInstance);
        } else {
            console.warn('Speech recognition not supported in this browser.');
        }
    }, [onTranscript]);

    const toggleListening = () => {
        if (isListening) {
            recognition?.stop();
        } else {
            recognition?.start();
            setIsListening(true);
        }
    };

    if (!recognition) return null;

    return (
        <div className="relative group">
            {isListening && (
                <>
                    <span className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping"></span>
                    <span className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-pulse delay-75"></span>
                </>
            )}
            <button
                onClick={toggleListening}
                disabled={isProcessing}
                className={clsx(
                    "relative z-10 p-5 rounded-full transition-all duration-300 shadow-xl flex items-center justify-center border-4",
                    isListening
                        ? "bg-red-500 border-red-200 scale-110"
                        : "bg-gradient-to-br from-blue-600 to-indigo-600 border-white/20 hover:scale-105 hover:shadow-blue-500/30",
                    isProcessing && "opacity-70 cursor-not-allowed grayscale"
                )}
                title={isListening ? "Stop recording" : "Press to speak"}
            >
                {isProcessing ? (
                    <Loader2 className="w-7 h-7 text-white animate-spin" />
                ) : isListening ? (
                    <div className="flex items-center justify-center w-7 h-7">
                        <div className="w-3 h-3 bg-white rounded-sm animate-bounce mr-1"></div>
                        <div className="w-3 h-3 bg-white rounded-sm animate-bounce delay-100 mr-1"></div>
                        <div className="w-3 h-3 bg-white rounded-sm animate-bounce delay-200"></div>
                    </div>
                ) : (
                    <Mic className="w-7 h-7 text-white" />
                )}
            </button>

            {/* Tooltip */}
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {isListening ? "Listening..." : "Voice Command"}
                <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
        </div>
    );
};

export default VoiceInput;
