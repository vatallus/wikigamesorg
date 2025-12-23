import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import styles from "../../styles/battle.module.scss";
import { Item } from "../../types/item";
import { GameState } from "../../types/game";
import { checkCorrect, getRandomItem, preloadImage } from "../../lib/items";
import badCards from "../../lib/bad-cards";
import NextItemList from "../next-item-list";
import PlayedItemList from "../played-item-list";
import Loading from "../loading";
import useAutoMoveSensor from "../../lib/useAutoMoveSensor";

export default function TimeBattle() {
    const [gameState, setGameState] = useState<"loading" | "ready" | "playing" | "gameover">("loading");
    const [items, setItems] = useState<Item[] | null>(null);
    const [state, setState] = useState<GameState | null>(null);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isDragging, setIsDragging] = useState(false);

    // Load data
    useEffect(() => {
        const fetchGameData = async () => {
            try {
                const res = await axios.get<string>("/items.json");
                const parsedItems: Item[] = res.data
                    .trim()
                    .split("\n")
                    .map((line) => JSON.parse(line))
                    .filter((item) => !item.label.includes(String(item.year)))
                    .filter((item) => !item.description.includes(String(item.year)))
                    .filter((item) => !/(?:th|st|nd)[ -]century/i.test(item.description))
                    .filter((item) => !(item.id in badCards));
                setItems(parsedItems);
                setGameState("ready");
            } catch (err) {
                console.error("Failed to fetch items", err);
            }
        };
        fetchGameData();
    }, []);

    const createBattleState = useCallback((deck: Item[]): GameState => {
        const played = [{ ...getRandomItem(deck, []), played: { correct: true } }];
        const next = getRandomItem(deck, played);
        const nextButOne = getRandomItem(deck, [...played, next]);
        const imageCache = [preloadImage(next.image), preloadImage(nextButOne.image)];

        return {
            badlyPlaced: null,
            deck,
            imageCache,
            lives: 999,
            next,
            nextButOne,
            played,
        };
    }, []);

    const startGame = () => {
        if (!items) return;
        setState(createBattleState(items));
        setGameState("playing");
        setTimeLeft(60);
    };

    const score = useMemo(() => {
        if (!state) return 0;
        return state.played.filter((item) => item.played.correct).length - 1;
    }, [state]);

    // Timer logic
    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | undefined;
        if (gameState === "playing" && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((t) => Math.max(0, t - 1));
            }, 1000);
        } else if (timeLeft === 0 && gameState === "playing") {
            setGameState("gameover");
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [gameState, timeLeft]);

    const onDragStart = () => setIsDragging(true);

    const onDragEnd = (result: DropResult) => {
        setIsDragging(false);
        if (!state || !state.next) return;

        const { source, destination } = result;
        if (!destination || (source.droppableId === "next" && destination.droppableId === "next")) return;

        const item = { ...state.next };

        if (source.droppableId === "next" && destination.droppableId === "played") {
            const newPlayed = [...state.played];
            const { correct, delta } = checkCorrect(newPlayed, item, destination.index);

            newPlayed.splice(destination.index, 0, {
                ...state.next,
                played: { correct },
            });

            if (!correct) {
                setTimeLeft(t => Math.max(0, t - 5));
            } else {
                setTimeLeft(t => t + 2);
            }

            const newNext = state.nextButOne;
            const newNextButOne = getRandomItem(state.deck, newNext ? [...newPlayed, newNext] : newPlayed);

            setState({
                ...state,
                imageCache: [preloadImage(newNextButOne.image)],
                next: newNext,
                nextButOne: newNextButOne,
                played: newPlayed,
                badlyPlaced: correct ? null : { index: destination.index, rendered: false, delta },
            });
        }
    };

    if (gameState === "loading") return <Loading />;

    return (
        <div className={styles.battleContainer}>
            {gameState === "ready" && (
                <div className={styles.overlay}>
                    <h1>TIME BATTLE</h1>
                    <p>Accuracy matters. Speed is everything. 60 seconds on the clock.</p>
                    <div className={styles.rules}>
                        <div className={styles.ruleItem}>✅ +2s Bonus</div>
                        <div className={styles.ruleItem}>❌ -5s Penalty</div>
                    </div>
                    <button className={styles.primeButton} onClick={startGame}>START BATTLE</button>
                </div>
            )}

            {gameState === "playing" && state && (
                <div className={styles.gameArea}>
                    <div className={styles.stats}>
                        <div className={`${styles.timer} ${timeLeft < 10 ? styles.lowTime : ""}`}>
                            🕒 {timeLeft}s
                        </div>
                        <div className={styles.score}>SCORE: {score}</div>
                    </div>

                    <DragDropContext
                        onDragEnd={onDragEnd}
                        onDragStart={onDragStart}
                        sensors={[useAutoMoveSensor.bind(null, state)]}
                    >
                        <div className={styles.battleBoard}>
                            <div className={styles.topSection}>
                                <NextItemList next={state.next} />
                            </div>
                            <div className={styles.bottomSection}>
                                <PlayedItemList
                                    items={state.played}
                                    isDragging={isDragging}
                                    badlyPlacedIndex={state.badlyPlaced?.index ?? null}
                                />
                            </div>
                        </div>
                    </DragDropContext>
                </div>
            )}

            {gameState === "gameover" && (
                <div className={styles.overlay}>
                    <h1 className={styles.gameOverTitle}>TIME UP!</h1>
                    <div className={styles.finalScore}>FINAL SCORE: {score}</div>
                    <p>The history books have closed for today.</p>
                    <button className={styles.primeButton} onClick={startGame}>TRY AGAIN</button>
                </div>
            )}
        </div>
    );
}
