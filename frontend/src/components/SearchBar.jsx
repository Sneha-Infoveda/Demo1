import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ query, setQuery, setChatHistory }) => {
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState("en"); // State for selected language

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);

        // Add user message to chat history
        setChatHistory(prevChat => [
            ...prevChat,
            { text: query, isUser: true }
        ]);

        try {
            const res = await fetch("https://chatveda.onrender.com/get_answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: query, language: language }) // Send language to backend
            });

            const data = await res.json();

            // Add bot response to chat history
            setChatHistory(prevChat => [
                ...prevChat,
                { text: data.response, isUser: false, followUpQuestions: data.follow_up_questions || [] }
            ]);

            setQuery(""); // Clear input field after sending
        } catch (error) {
            console.error("Error fetching response:", error);
        } finally {
            setLoading(false);
        }
    };

    // Trigger search on Enter key press
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="search-bar">
            <input 
                type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                onKeyPress={handleKeyPress} // Detect Enter key
                placeholder="Type a message and press Enter..."
            />
            <button onClick={handleSearch} disabled={loading}>
                {loading ? "Thinking..." : <i className="fas fa-paper-plane"></i>}
            </button>

            {/* Language Selection Dropdown */}
            <select id="language-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
                {/* Add more languages as needed */}
            </select>
        </div>
    );
};

export default SearchBar;
