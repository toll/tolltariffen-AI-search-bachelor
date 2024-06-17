import React, {useContext, useState} from "react";
import "./Chat.css";
import {ThemeContext} from '../contexts/ThemeContext';
import LoadingIndicator from "./LoadingIndicator";

interface ResponseData {
    result?: string;
    prompt?: string;
    options?: Record<number, string>;
}

interface ChatMessage {
    type: 'response' | 'user';
    text: string;
}

const Chat = () => {
    const {themeColor} = useContext(ThemeContext);
    const [userInput, setUserInput] = useState<string>("");
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [options, setOptions] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };

    const handleRequest = async (params: Record<string, string>) => {
        setIsLoading(true);
        setError(null);
        try {
            const url = new URL('/api/prompt-input', window.location.origin);
            url.search = new URLSearchParams(params).toString();

            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: ResponseData = await response.json();

            // Using type guards to ensure data.result and data.prompt are strings
            if (typeof data.result === 'string') {
                // @ts-expect-error type is fine
                setChatHistory(prev => [...prev, {type: 'response', text: data.result}]);
                setOptions({});
            } else if (typeof data.prompt === 'string' && data.options) {
                // @ts-expect-error type is fine
                setChatHistory(prev => [...prev, {type: 'response', text: data.prompt}]);
                setOptions(data.options);
            }
        } catch (error: any) {
            setError(`Failed to fetch: ${error.message || error.toString()}`);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleSubmit = () => {
        if (userInput.length < 2) {
            setError("Please enter at least 2 letters");
            return; // Stop the function if the condition is not met
        }
        setError(null); // Clear previous errors if any
        setChatHistory([]); // Reset chat history if needed before making a new request
        setOptions({});
        void handleRequest({query: userInput});
    };

    const handleUserSelection = (selection: string) => {
        // @ts-expect-error type is fine
        setChatHistory(prev => [...prev, {type: 'user', text: options[selection]}]);
        void handleRequest({query: userInput, selection});
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSubmit();
            e.preventDefault();  // Prevent the default action to avoid submitting the form (if any)
        }
    };


    return (
        <>
            {isLoading && <LoadingIndicator/>}
            <div className={`chat-container ${themeColor === 'light' ? 'light-theme' : 'dark-theme'}`}>
                <div className="input-container">
                    <div className="input-and-error">
                        {error && <p className="text-red-500">{error}</p>}
                        <input
                            type="text"
                            value={userInput}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            className={`input-field ${themeColor === 'light' ? 'light-input' : 'dark-input'} ${error ? 'input-error' : ''}`}
                            placeholder="Type your message..."
                        />
                    </div>
                    <button onClick={handleSubmit} disabled={isLoading}
                            className={`submit-button ${themeColor === 'light' ? 'light-button' : 'dark-button'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="enter-icon"
                             fill="currentColor">
                            <path d="M3 11h12.17l-3.59-3.59L13 6l6 6-6 6-1.41-1.41L15.17 13H3v-2z"/>
                            <path d="M21 18V6h-2v12h2z"/>
                        </svg>
                    </button>
                </div>
                <div className="chat-history">
                    {chatHistory.map((message, index) => (
                        <div key={index}
                             className={`chat-message ${message.type === 'response' ? 'chat-response' : `chat-user ${themeColor}`}`}>
                            {message.text}
                        </div>
                    ))}
                </div>
                <div className="chat-options">
                    {Object.entries(options).map(([key, value]) => (
                        <button key={key} onClick={() => handleUserSelection(key)}
                                className={`option-button ${themeColor === 'light' ? 'light-option' : 'dark-option'}`}>
                            {value}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Chat;
