import React, { useState, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ query, setQuery, setChatHistory, language, setLanguage, setIsGenerating }) => {
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false); 
    const [voices, setVoices] = useState([]);

    // Load available voices
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                setVoices(availableVoices);
                console.log("Loaded voices:", availableVoices);
            }
        };

        // Load voices when they change
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices(); // Load immediately as well
    }, []);

    const handleSearch = async () => {
        if (!query || !query.trim()) return;
        setLoading(true);
        setIsGenerating(true);

        // Add user message to chat history
        setChatHistory(prevChat => [
            ...prevChat,
            { text: query, isUser: true }
        ]);

        try {
            const res = await fetch("https://chatveda.onrender.com/get_answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: query, language })
            });

            const data = await res.json();

            // Add bot response to chat history
            setChatHistory(prevChat => [
                ...prevChat,
                { text: data.response, isUser: false, followUpQuestions: data.follow_up_questions || [] }
            ]);

            setQuery("");
        } catch (error) {
            console.error("Error fetching response:", error);
        } finally {
            setLoading(false);
            setIsGenerating(false);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    // Handle voice input using Web Speech API
    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Sorry, your browser does not support speech recognition.');
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsRecording(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            handleSearch();
            setIsRecording(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsRecording(false);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognition.start();
    };

    // Handle speaking the text aloud
    const handleSpeak = (text) => {
        const synth = window.speechSynthesis;

        if (!text || voices.length === 0) {
            console.warn("No text to speak or voices not loaded!");
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);

        // Set language based on user selection
        if (language === "hi") {
            utterance.lang = "hi-IN";
            utterance.pitch = 1.0;
            utterance.rate = 0.9;
            // Use male voice for Hindi
            utterance.voice = voices.find(voice => voice.lang === "hi-IN" && !voice.name.toLowerCase().includes("female"));
        } else if (language === "mr") {
            utterance.lang = "mr-IN";
            utterance.pitch = 1.0;
            utterance.rate = 0.9;
            // Use male voice for Marathi
            utterance.voice = voices.find(voice => voice.lang === "mr-IN" && !voice.name.toLowerCase().includes("female"));
        } else {
            utterance.lang = "en-IN";
            utterance.pitch = 1.2;
            utterance.rate = 1.0;
            // Use female voice for English
            utterance.voice = voices.find(voice => voice.lang === "en-IN" && voice.name.toLowerCase().includes("female"));
        }

        // Fallback to the first available voice if no match is found
        if (!utterance.voice) {
            utterance.voice = voices[0];
        }

        synth.speak(utterance);
    };

    return (
        <div className="search-bar">
            <input 
                type="text"
                value={query || ""}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything..."
                disabled={loading}
            />

            {/* Voice Input Button */}
            <button 
                onClick={handleVoiceInput} 
                className={`voice-button ${isRecording ? 'recording' : ''}`}
                title={isRecording ? "Recording..." : "Click to speak"}
            >
                {isRecording ? (
                    <i className="fas fa-microphone-slash"></i>
                ) : (
                    <i className="fas fa-microphone"></i>
                )}
            </button>

          
            

            {/* Search Button */}
            <button onClick={handleSearch} disabled={loading}>
                {loading ? ". . ." : <i className="fas fa-paper-plane"></i>}
            </button>

            {/* Language Selection Dropdown */}
            <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
            >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
            </select>
        </div>
    );
};

export default SearchBar;
