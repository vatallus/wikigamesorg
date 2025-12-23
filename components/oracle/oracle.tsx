import React, { useState, useEffect, useRef } from "react";
import styles from "../../styles/oracle.module.scss";

interface Message {
    role: "user" | "oracle";
    text: string;
}

export default function Oracle() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "oracle", text: "Greetings, traveler. I am the Wiki Oracle. Ask me anything about the events, people, or mysteries of time." }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", text: userMsg }]);
        setIsTyping(true);

        // Simulate AI behavior
        setTimeout(() => {
            let response = "That is a fascinating question. According to the annals of history, ";
            if (userMsg.toLowerCase().includes("trivia")) {
                response += "Wiki Trivia is the best way to master the chronological order of these events.";
            } else {
                response += `the mystery of "${userMsg}" is deep. I suggest checking the latest updates on wikigames.org/museum for more visual details.`;
            }
            setMessages(prev => [...prev, { role: "oracle", text: response }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className={styles.oracleContainer}>
            <div className={styles.chatWindow} ref={scrollRef}>
                {messages.map((m, i) => (
                    <div key={i} className={`${styles.message} ${styles[m.role]}`}>
                        <div className={styles.bubble}>{m.text}</div>
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
                />
                <button onClick={handleSend}>Consult</button>
            </div>
        </div>
    );
}
