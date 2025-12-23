import React, { useState, useEffect } from "react";
import { animated, useSpring } from "react-spring";
import styles from "../styles/game-over.module.scss";
import Button from "./button";
import Score from "./score";
import ShareCard from "./share/share-card";
import { submitScore } from "../lib/leaderboard";

interface Props {
  highscore: number;
  resetGame: () => void;
  score: number;
}

function getMedal(score: number): string {
  if (score >= 20) {
    return "🥇 ";
  } else if (score >= 10) {
    return "🥈 ";
  } else if (score >= 1) {
    return "🥉 ";
  }
  return "";
}

export default function GameOver(props: Props) {
  const { highscore, resetGame, score } = props;
  const [showShareCard, setShowShareCard] = useState(false);

  const animProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
  });

  // Submit score to leaderboard on mount
  useEffect(() => {
    submitScore("trivia", score);
  }, [score]);

  return (
    <>
      <animated.div style={animProps} className={styles.gameOver}>
        <div className={styles.scoresWrapper}>
          <div className={styles.score}>
            <Score score={score} title="Streak" />
          </div>
          <div className={styles.score}>
            <Score score={highscore} title="Best streak" />
          </div>
        </div>
        <div className={styles.buttons}>
          <Button onClick={resetGame} text="Play again" />
          <Button onClick={() => setShowShareCard(true)} text="Share Score 🚀" minimal />
        </div>
      </animated.div>

      {showShareCard && (
        <ShareCard
          score={score}
          gameMode="trivia"
          onClose={() => setShowShareCard(false)}
        />
      )}
    </>
  );
}
