interface LeaderboardEntry {
    username: string;
    score: number;
    gameMode: "trivia" | "battle" | "gallery" | "oracle";
    timestamp: number;
}

interface Leaderboard {
    trivia: LeaderboardEntry[];
    battle: LeaderboardEntry[];
    gallery: LeaderboardEntry[];
    oracle: LeaderboardEntry[];
}

const LEADERBOARD_KEY = "wikigames_leaderboard";
const MAX_ENTRIES = 100; // Keep top 100 per game mode

function generateUsername(): string {
    const adjectives = ["Swift", "Wise", "Brave", "Ancient", "Mystic", "Noble", "Clever", "Bold"];
    const nouns = ["Scholar", "Explorer", "Historian", "Sage", "Seeker", "Pioneer", "Curator", "Oracle"];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 9999);
    return `${adj}${noun}_${num}`;
}

export function getUsername(): string {
    if (typeof window === "undefined") return "";

    let username = localStorage.getItem("wikigames_username");
    if (!username) {
        username = generateUsername();
        localStorage.setItem("wikigames_username", username);
    }
    return username;
}

export function setUsername(username: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("wikigames_username", username);
}

function getLeaderboard(): Leaderboard {
    if (typeof window === "undefined") {
        return { trivia: [], battle: [], gallery: [], oracle: [] };
    }

    const stored = localStorage.getItem(LEADERBOARD_KEY);
    if (!stored) {
        return { trivia: [], battle: [], gallery: [], oracle: [] };
    }

    try {
        return JSON.parse(stored);
    } catch {
        return { trivia: [], battle: [], gallery: [], oracle: [] };
    }
}

function saveLeaderboard(leaderboard: Leaderboard): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
}

export function submitScore(
    gameMode: "trivia" | "battle" | "gallery" | "oracle",
    score: number
): void {
    const leaderboard = getLeaderboard();
    const username = getUsername();

    const entry: LeaderboardEntry = {
        username,
        score,
        gameMode,
        timestamp: Date.now()
    };

    leaderboard[gameMode].push(entry);

    // Sort by score (descending) and keep top MAX_ENTRIES
    leaderboard[gameMode].sort((a, b) => b.score - a.score);
    leaderboard[gameMode] = leaderboard[gameMode].slice(0, MAX_ENTRIES);

    saveLeaderboard(leaderboard);
}

export function getTopScores(
    gameMode: "trivia" | "battle" | "gallery" | "oracle",
    limit: number = 10
): LeaderboardEntry[] {
    const leaderboard = getLeaderboard();
    return leaderboard[gameMode].slice(0, limit);
}

export function getUserRank(
    gameMode: "trivia" | "battle" | "gallery" | "oracle"
): { rank: number; score: number } | null {
    const leaderboard = getLeaderboard();
    const username = getUsername();

    const userEntries = leaderboard[gameMode].filter(e => e.username === username);
    if (userEntries.length === 0) return null;

    const bestScore = Math.max(...userEntries.map(e => e.score));
    const rank = leaderboard[gameMode].findIndex(e => e.username === username && e.score === bestScore) + 1;

    return { rank, score: bestScore };
}

export function getAllTimeStats() {
    const leaderboard = getLeaderboard();
    const username = getUsername();

    return {
        trivia: getUserRank("trivia"),
        battle: getUserRank("battle"),
        gallery: getUserRank("gallery"),
        oracle: getUserRank("oracle"),
        totalGames: Object.values(leaderboard).reduce((sum, entries) =>
            sum + entries.filter((e: LeaderboardEntry) => e.username === username).length, 0
        )
    };
}
