// App.js
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import ChatContainer from './components/ChatContainer';
import './assets/styles.css';
import './assets/panel.css';

function App() {
    const [query, setQuery] = useState(""); // Track user input
    const [chatHistory, setChatHistory] = useState([]); // Store chat history
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Track sidebar state
    const [showWelcome, setShowWelcome] = useState(true); // Welcome message state

    // Hide welcome message when user sends a message
    useEffect(() => {
        if (chatHistory.length > 0) {
            setShowWelcome(false);
        }
    }, [chatHistory]);

    // Close sidebar when clicking outside
    const handleContentClick = () => {
        if (isSidebarOpen) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            {/* Pass isSidebarOpen as a prop */}
            <Navbar onSearch={(query) => setQuery(query)} isSidebarOpen={isSidebarOpen} />
            <Sidebar setQuery={setQuery} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            
            {/* Display Welcome Message Before Chat Starts */}
            {showWelcome && (
                <div className="welcome-message">
                    <h2>
                        ॐ असतो मा सद्गमय। तमसो मा ज्योतिर्गमय। मृत्योर्मा अमृतं गमय।
                        <span role="img" aria-label="smile">🙏</span>
                    </h2>
                </div>
            )}
            
            {/* Main Content */}
            <div className="main-content" onClick={handleContentClick}>
                <SearchBar query={query} setQuery={setQuery} setChatHistory={setChatHistory} />
                <ChatContainer chatHistory={chatHistory} setQuery={setQuery} />
            </div>
        </div>
    );
}

export default App;
