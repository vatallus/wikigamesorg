import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

const Game = dynamic(() => import("../components/game"), { ssr: false });
const Hub = dynamic(() => import("../components/hub/hub"), { ssr: false });
const Oracle = dynamic(() => import("../components/oracle/oracle"), { ssr: false });
const Gallery = dynamic(() => import("../components/gallery/gallery"), { ssr: false });
const Battle = dynamic(() => import("../components/battle/battle"), { ssr: false });

export default function Index() {
  const [activeView, setActiveView] = React.useState<"hub" | "trivia" | "oracle" | "gallery" | "battle">("hub");

  const NavButton = () => (
    <button
      onClick={() => setActiveView("hub")}
      style={{
        position: "fixed",
        top: "20px",
        left: "20px",
        zIndex: 2000,
        background: "rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.2)",
        color: "white",
        padding: "10px 20px",
        borderRadius: "100px",
        cursor: "pointer",
        backdropFilter: "blur(10px)",
        fontWeight: "bold",
        fontSize: "0.9rem",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.3s"
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = "#4ecca3";
        e.currentTarget.style.color = "#000";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = "rgba(0,0,0,0.5)";
        e.currentTarget.style.color = "#fff";
      }}
    >
      <span>🏰</span> HUB
    </button>
  );

  return (
    <>
      <Head>
        <title>Wikigames.org - The Encyclopedia of Play | Wiki Trivia, AI Oracle & History Hub</title>
        <meta
          name="description"
          content="Explore history through play at Wikigames.org. Play the viral Wiki Trivia, consult the AI History Oracle, explore the Wiki Gallery museum, or enter the Time Battle arena. The ultimate destination for knowledge lovers."
        />
        <meta
          name="keywords"
          content="wikigames, wiki trivia, history oracle, time battle, wiki gallery, wikipedia games, history timeline, educational platform, trivia games"
        />
        <meta name="author" content="Wikigames.org" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Wikigames.org",
            "operatingSystem": "All",
            "applicationCategory": "GameApplication, EducationalApplication",
            "description": "An interactive platform for learning history through games like Wiki Trivia and AI Oracle.",
            "url": "https://wikigames.org",
            "author": {
              "@type": "Organization",
              "name": "Wikigames.org"
            }
          })}
        </script>

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wikigames.org" />
        <meta property="og:title" content="Wikigames.org - Knowledge is the Ultimate Game" />
        <meta
          property="og:description"
          content="Explore history through interactive games. Play the viral Wiki Trivia game, chat with the AI History Oracle, or browse the Museum."
        />
        <meta property="og:image" content="https://wikigames.org/og-image.png" />

        <link rel="canonical" href="https://wikigames.org" />
        <link
          rel="shortcut icon"
          href="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Ctext%20y%3D%22.9em%22%20font-size%3D%2290%22%3E%F0%9F%8F%9B%EF%B8%8F%3C%2Ftext%3E%3C%2Fsvg%3E"
          type="image/svg+xml"
        />
      </Head>

      {activeView === "hub" && (
        <Hub onSelectGame={(game: string) => setActiveView(game as any)} />
      )}

      {activeView !== "hub" && <NavButton />}

      {activeView === "trivia" && (
        <div style={{ height: "100vh" }}>
          <Game />
        </div>
      )}

      {activeView === "oracle" && (
        <div style={{
          height: "100vh",
          background: "radial-gradient(circle at top, #1e293b 0%, #0f172a 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <header style={{ textAlign: "center", marginBottom: "30px" }}>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "10px" }}>THE HISTORY ORACLE</h1>
            <p style={{ opacity: 0.5, letterSpacing: "4px" }}>AI POWERED KNOWLEDGE ENGINE</p>
          </header>
          <Oracle />
        </div>
      )}

      {activeView === "gallery" && (
        <Gallery />
      )}

      {activeView === "battle" && (
        <Battle />
      )}
    </>
  );
}
