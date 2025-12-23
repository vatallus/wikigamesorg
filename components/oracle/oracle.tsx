import React, { useState, useEffect, useRef } from "react";
import styles from "../../styles/oracle.module.scss";
import ShareCard from "../share/share-card";

interface Message {
    role: "user" | "oracle";
    text: string;
}

export default function Oracle() {
    const [messages, setMessages] = useState<Message[]>(() => {
        // Load conversation history from localStorage
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("oracle_history");
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch {
                    return [{ role: "oracle", text: "Greetings, traveler. I am the Wiki Oracle. Ask me anything about the events, people, or mysteries of time." }];
                }
            }
        }
        return [{ role: "oracle", text: "Greetings, traveler. I am the Wiki Oracle. Ask me anything about the events, people, or mysteries of time." }];
    });
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showShareCard, setShowShareCard] = useState(false);
    const [shareMessage, setShareMessage] = useState<Message | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Save conversation history to localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("oracle_history", JSON.stringify(messages));
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMsg = input.trim();
        setInput("");
        const newMessages = [...messages, { role: "user" as const, text: userMsg }];
        setMessages(newMessages);
        setIsTyping(true);

        try {
            const response = await fetch("/api/oracle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg,
                    conversationHistory: messages.slice(-6).map(m => ({
                        role: m.role === "oracle" ? "assistant" : "user",
                        content: m.text
                    }))
                })
            });

            if (!response.ok) {
                throw new Error("Oracle API failed");
            }

            const data = await response.json();
            setMessages(prev => [...prev, { role: "oracle", text: data.response }]);
        } catch (error) {
            console.error("Oracle error:", error);
            setMessages(prev => [...prev, {
                role: "oracle",
                text: "The Oracle encountered a disturbance in the timeline. Please try again."
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleShare = (message: Message) => {
        setShareMessage(message);
        setShowShareCard(true);
    };

    const clearHistory = () => {
        const initialMessage = { role: "oracle" as const, text: "Greetings, traveler. I am the Wiki Oracle. Ask me anything about the events, people, or mysteries of time." };
        setMessages([initialMessage]);
        localStorage.removeItem("oracle_history");
    };

    return (
        <>
            <div className={styles.oracleContainer}>
                <div className={styles.chatWindow} ref={scrollRef}>
                    {messages.map((m, i) => (
                        <div key={i} className={`${styles.message} ${styles[m.role]}`}>
                            <div className={styles.bubble}>
                                {m.text}
                                {m.role === "oracle" && i > 0 && (
                                    <button
                                        className={styles.shareBtn}
                                        onClick={() => handleShare(m)}
                                        title="Share this wisdom"
                                    >
                                        🚀
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className={`${styles.message} ${styles.oracle}`}>
                            <div className={styles.typing}><span>.</span><span>.</span><span>.</span></div>
                        </div>
                    )}
                </div>
                <div className={styles.inputArea}>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask the Oracle..."
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isTyping}
                    />
                    <button onClick={handleSend} disabled={isTyping || !input.trim()}>
                        Consult
                    </button>
                    {messages.length > 1 && (
                        <button onClick={clearHistory} className={styles.clearBtn}>
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {showShareCard && shareMessage && (
                <ShareCard
                    score={messages.filter(m => m.role === "user").length}
                    gameMode="oracle"
                    onClose={() => setShowShareCard(false)}
                />
            )}
        </>
    );
}
