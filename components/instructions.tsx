import React from "react";
import GitHubButton from "react-github-btn";
import styles from "../styles/instructions.module.scss";
import Button from "./button";
import Score from "./score";

interface Props {
  highscore: number;
  start: () => void;
}

export default function Instructions(props: Props) {
  const { highscore, start } = props;

  return (
    <div className={styles.instructions}>
      <div className={styles.wrapper}>
        <h1 style={{ color: "white", marginBottom: "10px", fontSize: "3.5rem", fontWeight: "bold" }}>Wiki Trivia</h1>
        <h2 style={{ textTransform: "none", fontStyle: "normal", fontSize: "1.5rem", color: "#eee" }}>
          The Ultimate Chronological Timeline Challenge
        </h2>

        <div style={{ color: "#bbb", margin: "20px auto 40px", maxWidth: "600px", lineHeight: "1.6" }}>
          <p style={{ fontSize: "1.1rem", marginBottom: "15px" }}>
            Test your knowledge of history, science, and culture! Drag and drop cards into their correct position on the timeline.
          </p>
          <p style={{ fontSize: "0.95rem", opacity: 0.8 }}>
            Sắp xếp các sự kiện lịch sử và văn hóa vào đúng trình tự thời gian. Mỗi lựa chọn đúng sẽ tăng chuỗi ghi điểm của bạn!
          </p>
        </div>

        {highscore !== 0 && (
          <div className={styles.highscoreWrapper}>
            <Score score={highscore} title="Your Best Streak" />
          </div>
        )}
        <Button onClick={start} text="Start Your Journey" />
        <div className={styles.about}>
          <div>
            A project by{" "}
            <a href="https://wikigames.org" target="_blank" rel="noopener noreferrer">
              Wikigames.org
            </a>
          </div>
          <div>
            All data sourced from{" "}
            <a
              href="https://www.wikidata.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikidata
            </a>{" "}
            and{" "}
            <a
              href="https://www.wikipedia.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikipedia
            </a>
            .
          </div>
          <div>
            Have feedback? Please report it on{" "}
            <a
              href="https://github.com/tom-james-watson/wikitrivia/issues/"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            .
          </div>
          <GitHubButton
            href="https://github.com/tom-james-watson/wikitrivia"
            data-size="large"
            data-show-count="true"
            aria-label="Star tom-james-watson/wikitrivia on GitHub"
          >
            Star
          </GitHubButton>
        </div>
      </div>
    </div>
  );
}
