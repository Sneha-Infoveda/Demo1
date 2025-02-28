// Sidebar.jsx
import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Sidebar = ({ setQuery, isOpen, setIsOpen }) => {
    const questions = [
        "What are the four Vedas?",
        "Dharma, Karma and Moksha?",
        "What are the stages of life?",
        "How many Puranas?",
        "Concept and types of Vimanas?",
        "Types of Weapons in Atharvaved?",
        "Astrology and its key concepts?",
        "Metallurgy as per Vedas?",
        "Astronomy as per Vedas?",
        "Dharma in Puranas?",
        "Concept of ‘Shunya’ or Zero?",
        "Rituals and its significance?",
        "Geometrical concepts in Vedas?",
        "Puranas and kingship?"
    ];

    return (
        <div className={`side-panel ${isOpen ? 'open' : 'closed'}`}>
            <div className="toggle-button" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
            </div>

            <div className="logo-container">
                {isOpen && <h2 className="chatveda-text">ChatVeda AI</h2>}
            </div>

            {isOpen && (
                <ul className="conversation-list">
                    {questions.map((question, index) => (
                        <li 
                            key={index} 
                            onClick={() => setQuery(question)}
                            className="clickable-item"
                        >
                            {question}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Sidebar;
