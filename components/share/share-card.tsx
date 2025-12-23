import React, { useRef } from "react";
import { toPng } from "html-to-image";
import styles from "../../styles/share.module.scss";

interface ShareCardProps {
    score: number;
    gameMode: "trivia" | "battle" | "gallery" | "oracle";
    onClose: () => void;
}

const GAME_MODE_LABELS = {
    trivia: "Wiki Trivia",
    battle: "Time Battle",
    gallery: "Wiki Gallery",
    oracle: "AI Oracle"
};

const GAME_MODE_ICONS = {
    trivia: "⏳",
    battle: "⚔️",
    gallery: "🖼️",
    oracle: "🔮"
};

export default function ShareCard({ score, gameMode, onClose }: ShareCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!cardRef.current) return;

        try {
            const dataUrl = await toPng(cardRef.current, {
                quality: 1.0,
                pixelRatio: 2,
                width: 1200,
                height: 630
            });

            const link = document.createElement("a");
            link.download = `wikigames-${gameMode}-${score}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Failed to generate image", err);
        }
    };

    const handleShareTwitter = () => {
        const text = `I just scored ${score} on ${GAME_MODE_LABELS[gameMode]} at Wikigames.org! ${GAME_MODE_ICONS[gameMode]} Can you beat my score?`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent("https://wikigames.org")}`;
        window.open(url, "_blank");
    };

    const handleShareFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://wikigames.org")}`;
        window.open(url, "_blank");
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>&times;</button>

                <div ref={cardRef} className={styles.shareCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.logo}>
                            <span className={styles.logoIcon}>🏰</span>
                            <span className={styles.logoText}>WIKIGAMES.ORG</span>
                        </div>
                    </div>

                    <div className={styles.cardBody}>
                        <div className={styles.gameIcon}>{GAME_MODE_ICONS[gameMode]}</div>
                        <h2 className={styles.gameTitle}>{GAME_MODE_LABELS[gameMode]}</h2>

                        <div className={styles.scoreDisplay}>
                            <div className={styles.scoreLabel}>MY SCORE</div>
                            <div className={styles.scoreValue}>{score}</div>
                        </div>

                        <div className={styles.challenge}>
                            Can you beat this?
                        </div>
                    </div>

                    <div className={styles.cardFooter}>
                        <div className={styles.date}>{new Date().toLocaleDateString()}</div>
                        <div className={styles.tagline}>The Encyclopedia of Play</div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button className={styles.downloadBtn} onClick={handleDownload}>
                        📥 Download Image
                    </button>
                    <button className={styles.twitterBtn} onClick={handleShareTwitter}>
                        🐦 Share on Twitter
                    </button>
                    <button className={styles.facebookBtn} onClick={handleShareFacebook}>
                        📘 Share on Facebook
                    </button>
                </div>
            </div>
        </div>
    );
}
