import React, { useState, useEffect } from "react";
import styles from "../../styles/leaderboard.module.scss";
import { getTopScores, getUserRank, getUsername, setUsername } from "../../lib/leaderboard";

type GameMode = "trivia" | "battle" | "gallery" | "oracle";
type TimePeriod = "today" | "week" | "alltime";

const GAME_MODE_LABELS = {
    trivia: "Wiki Trivia",
    battle: "Time Battle",
    gallery: "Wiki Gallery",
    oracle: "AI Oracle"
};

export default function Leaderboard() {
    const [gameMode, setGameMode] = useState<GameMode>("trivia");
    const [timePeriod, setTimePeriod] = useState<TimePeriod>("alltime");
    const [isEditingName, setIsEditingName] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [currentUsername, setCurrentUsername] = useState("");

    useEffect(() => {
        setCurrentUsername(getUsername());
    }, []);

    const topScores = getTopScores(gameMode, 10);
    const userRank = getUserRank(gameMode);

    const handleSaveName = () => {
        if (newUsername.trim()) {
            setUsername(newUsername.trim());
            setCurrentUsername(newUsername.trim());
            setIsEditingName(false);
        }
    };

    return (
        <div className={styles.leaderboardContainer}>
            <header className={styles.header}>
                <h1>🏆 LEADERBOARD</h1>
                <p>Compete with history enthusiasts worldwide</p>
            </header>

            <div className={styles.filters}>
                <div className={styles.gameModes}>
                    {(Object.keys(GAME_MODE_LABELS) as GameMode[]).map(mode => (
                        <button
                            key={mode}
                            className={gameMode === mode ? styles.active : ""}
                            onClick={() => setGameMode(mode)}
                        >
                            {GAME_MODE_LABELS[mode]}
                        </button>
                    ))}
                </div>
            </div>

            {userRank && (
                <div className={styles.userCard}>
                    <div className={styles.userInfo}>
                        <div className={styles.rank}>#{userRank.rank}</div>
                        <div className={styles.details}>
                            {isEditingName ? (
                                <div className={styles.editName}>
                                    <input
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        placeholder="Enter username"
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                                    />
                                    <button onClick={handleSaveName}>✓</button>
                                    <button onClick={() => setIsEditingName(false)}>✗</button>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.username}>
                                        {currentUsername}
                                        <button
                                            className={styles.editBtn}
                                            onClick={() => {
                                                setNewUsername(currentUsername);
                                                setIsEditingName(true);
                                            }}
                                        >
                                            ✎
                                        </button>
                                    </div>
                                </>
                            )}
                            <div className={styles.score}>Best: {userRank.score}</div>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.table}>
                <div className={styles.tableHeader}>
                    <div>Rank</div>
                    <div>Player</div>
                    <div>Score</div>
                </div>
                {topScores.length === 0 ? (
                    <div className={styles.empty}>
                        <p>No scores yet. Be the first!</p>
                    </div>
                ) : (
                    topScores.map((entry, index) => (
                        <div
                            key={`${entry.username}-${entry.timestamp}`}
                            className={`${styles.row} ${entry.username === currentUsername ? styles.highlight : ""}`}
                        >
                            <div className={styles.rankCell}>
                                {index === 0 && "🥇"}
                                {index === 1 && "🥈"}
                                {index === 2 && "🥉"}
                                {index > 2 && `#${index + 1}`}
                            </div>
                            <div className={styles.nameCell}>{entry.username}</div>
                            <div className={styles.scoreCell}>{entry.score}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
