import React from "react";
import styles from "../../styles/hub.module.scss";

interface GameCardProps {
    title: string;
    description: string;
    icon: string;
    onClick: () => void;
    tag?: string;
}

const GameCard = ({ title, description, icon, onClick, tag }: GameCardProps) => (
    <div className={styles.gameCard} onClick={onClick}>
        {tag && <span className={styles.tag}>{tag}</span>}
        <div className={styles.icon}>{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className={styles.glare} />
    </div>
);

export default function Hub({ onSelectGame }: { onSelectGame: (game: string) => void }) {
    return (
        <div className={styles.hubContainer}>
            <header className={styles.header}>
                <h1 className={styles.logo}>WIKIGAMES<span>.ORG</span></h1>
                <p className={styles.slogan}>The Encyclopedia of Play</p>
            </header>

            <div className={styles.grid}>
                <GameCard
                    title="Wiki Trivia"
                    description="The classic timeline challenge. Order historical events correctly."
                    icon="⏳"
                    onClick={() => onSelectGame("trivia")}
                />
                <GameCard
                    title="The Oracle AI"
                    description="Ask the AI about any historical mystery. Learn as you play."
                    icon="🔮"
                    tag="AI POWERED"
                    onClick={() => onSelectGame("oracle")}
                />
                <GameCard
                    title="Wiki Gallery"
                    description="Browse historical cards and collect rare events in your museum."
                    icon="🖼️"
                    onClick={() => onSelectGame("gallery")}
                />
                <GameCard
                    title="Time Battle"
                    description="Place cards against the clock! How fast is your historical intuition?"
                    icon="⚔️"
                    tag="PREMIUM"
                    onClick={() => onSelectGame("battle")}
                />
                <GameCard
                    title="Leaderboard"
                    description="Compete globally! See where you rank among history masters."
                    icon="🏆"
                    tag="NEW"
                    onClick={() => onSelectGame("leaderboard")}
                />
            </div>

            <div className={styles.factBox}>
                <span className={styles.factLabel}>⚡ FACT OF THE DAY</span>
                <p>&quot;The Great Pyramid of Giza was the tallest man-made structure in the world for over 3,800 years.&quot;</p>
            </div>

            <footer className={styles.footer}>
                <p>&copy; 2025 Wikigames.org - Knowledge is the Ultimate Game</p>
            </footer>
        </div>
    );
}
