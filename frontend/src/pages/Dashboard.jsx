import axios from "axios";
import { useState, useEffect } from "react";

const API = "http://localhost:8000";

function Dashboard() {
    const [topic, setTopic] = useState("");
    const [tone, setTone] = useState("professional");
    const [length, setLength] = useState("medium");
    const [generatedText, setGeneratedText] = useState("");
    const [loading, setLoading] = useState(false);
    const [linkedinConnected, setLinkedinConnected] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    // Check LinkedIn connection status on load & handle OAuth redirect
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("linkedin") === "success") {
            setStatusMessage("✅ LinkedIn connected successfully!");
            window.history.replaceState({}, "", "/");
        } else if (params.get("linkedin") === "error") {
            setStatusMessage("❌ LinkedIn connection failed: " + (params.get("message") || "Unknown error"));
            window.history.replaceState({}, "", "/");
        }

        // Check if already connected
        axios.get(`${API}/linkedin/status`)
            .then(res => setLinkedinConnected(res.data.connected))
            .catch(() => { });
    }, []);

    const generateContent = async () => {
        if (!topic.trim()) return alert("Please enter a topic!");
        setLoading(true);
        try {
            const res = await axios.post(`${API}/content/generate`, {
                topic,
                tone,
                length,
            });
            setGeneratedText(res.data.generated_text);
        } catch (err) {
            alert("Error generating content: " + (err.response?.data?.detail || err.message));
        }
        setLoading(false);
    };

    const loginLinkedIn = async () => {
        try {
            const res = await axios.get(`${API}/linkedin/login`);
            window.location.href = res.data.auth_url;
        } catch (err) {
            alert("Error: " + (err.response?.data?.detail || err.message));
        }
    };

    const disconnectLinkedIn = async () => {
        if (!window.confirm("Are you sure you want to disconnect your LinkedIn account?")) return;
        try {
            await axios.delete(`${API}/linkedin/disconnect`);
            setLinkedinConnected(false);
            setStatusMessage("🔓 LinkedIn account disconnected. You can now connect a different account.");
        } catch (err) {
            alert("Error: " + (err.response?.data?.detail || err.message));
        }
    };

    const postToLinkedIn = async () => {
        if (!generatedText.trim()) return alert("Generate content first!");
        if (!linkedinConnected) return alert("Please connect your LinkedIn account first!");
        try {
            const res = await axios.post(`${API}/linkedin/post?text=${encodeURIComponent(generatedText)}`);
            alert("✅ " + res.data.message);
        } catch (err) {
            alert("Error: " + (err.response?.data?.detail || err.message));
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedText);
        alert("Copied to clipboard!");
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>🚀 LinkedIn Post Generator</h1>

            {/* Status Message */}
            {statusMessage && (
                <div style={styles.statusBar}>
                    {statusMessage}
                </div>
            )}

            {/* LinkedIn Connection — show at top so user connects first */}
            <div style={styles.card}>
                <h2 style={styles.cardTitle}>🔗 LinkedIn Account</h2>
                {linkedinConnected ? (
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ ...styles.connectedBadge, flex: 1 }}>
                            ✅ LinkedIn Connected
                        </div>
                        <button onClick={disconnectLinkedIn} style={styles.btnDisconnect}>
                            Disconnect
                        </button>
                    </div>
                ) : (
                    <button onClick={loginLinkedIn} style={styles.btnLinkedIn}>
                        Connect LinkedIn
                    </button>
                )}
            </div>

            {/* Content Generation Section */}
            <div style={styles.card}>
                <h2 style={styles.cardTitle}>✨ Generate Content</h2>

                <input
                    type="text"
                    placeholder="Enter your topic (e.g., AI in healthcare)"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    style={styles.input}
                />

                <div style={styles.row}>
                    <div style={styles.selectGroup}>
                        <label style={styles.label}>Tone</label>
                        <select value={tone} onChange={(e) => setTone(e.target.value)} style={styles.select}>
                            <option value="professional">Professional</option>
                            <option value="casual">Casual</option>
                            <option value="inspirational">Inspirational</option>
                            <option value="humorous">Humorous</option>
                            <option value="educational">Educational</option>
                        </select>
                    </div>

                    <div style={styles.selectGroup}>
                        <label style={styles.label}>Length</label>
                        <select value={length} onChange={(e) => setLength(e.target.value)} style={styles.select}>
                            <option value="short">Short</option>
                            <option value="medium">Medium</option>
                            <option value="long">Long</option>
                        </select>
                    </div>
                </div>

                <button onClick={generateContent} disabled={loading} style={styles.btnPrimary}>
                    {loading ? "⏳ Generating..." : "🪄 Generate Post"}
                </button>
            </div>

            {/* Generated Content Section */}
            {generatedText && (
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>📝 Generated Post</h2>
                    <textarea
                        value={generatedText}
                        onChange={(e) => setGeneratedText(e.target.value)}
                        style={styles.textarea}
                        rows={10}
                    />
                    <div style={styles.row}>
                        <button onClick={copyToClipboard} style={styles.btnSecondary}>
                            📋 Copy
                        </button>
                        <button onClick={postToLinkedIn} style={{ ...styles.btnPrimary, flex: 1, width: "auto" }}>
                            📤 Post to LinkedIn
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: 700,
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "'Segoe UI', sans-serif",
        background: "#f5f7fa",
        minHeight: "100vh",
    },
    title: {
        textAlign: "center",
        fontSize: 28,
        color: "#1a1a2e",
        marginBottom: 30,
    },
    statusBar: {
        padding: "12px 16px",
        borderRadius: 8,
        background: "#e8f5e9",
        color: "#2e7d32",
        fontSize: 14,
        marginBottom: 20,
        textAlign: "center",
    },
    card: {
        background: "#fff",
        borderRadius: 12,
        padding: 24,
        marginBottom: 20,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    },
    cardTitle: {
        fontSize: 18,
        color: "#333",
        marginTop: 0,
        marginBottom: 16,
    },
    connectedBadge: {
        padding: "12px 16px",
        borderRadius: 8,
        background: "#e8f5e9",
        color: "#2e7d32",
        fontSize: 15,
        fontWeight: 600,
        textAlign: "center",
    },
    input: {
        width: "100%",
        padding: "12px 16px",
        fontSize: 15,
        border: "2px solid #e0e0e0",
        borderRadius: 8,
        outline: "none",
        boxSizing: "border-box",
        marginBottom: 16,
    },
    row: {
        display: "flex",
        gap: 16,
        marginBottom: 16,
        flexWrap: "wrap",
    },
    selectGroup: {
        flex: 1,
        minWidth: 140,
    },
    label: {
        display: "block",
        fontSize: 13,
        color: "#666",
        marginBottom: 6,
    },
    select: {
        width: "100%",
        padding: "10px 12px",
        fontSize: 14,
        border: "2px solid #e0e0e0",
        borderRadius: 8,
        outline: "none",
        background: "#fff",
    },
    textarea: {
        width: "100%",
        padding: "12px 16px",
        fontSize: 14,
        lineHeight: 1.6,
        border: "2px solid #e0e0e0",
        borderRadius: 8,
        outline: "none",
        resize: "vertical",
        boxSizing: "border-box",
        marginBottom: 16,
        fontFamily: "'Segoe UI', sans-serif",
    },
    btnPrimary: {
        padding: "12px 24px",
        fontSize: 15,
        fontWeight: 600,
        color: "#fff",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        width: "100%",
    },
    btnSecondary: {
        padding: "12px 24px",
        fontSize: 15,
        fontWeight: 600,
        color: "#667eea",
        background: "#f0f0ff",
        border: "2px solid #667eea",
        borderRadius: 8,
        cursor: "pointer",
        flex: 1,
    },
    btnLinkedIn: {
        padding: "12px 24px",
        fontSize: 15,
        fontWeight: 600,
        color: "#fff",
        background: "#0077b5",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        width: "100%",
    },
    btnDisconnect: {
        padding: "12px 18px",
        fontSize: 13,
        fontWeight: 600,
        color: "#fff",
        background: "#e53935",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        whiteSpace: "nowrap",
    },
};

export default Dashboard;