//This component finds the JSON and gets all the data from it, passing them to the application and processing them

import { useEffect, useState, useRef } from "react";
import axios from "axios";
//we will pass everything here to this component, the core of Edi
import Engine from "./Engine";

// Add new demos here in the future
const DEMO_LIST = [
    { label: "Test Game", path: "/demos/testgame.json" },
];

const Home = () => {
    const [demoData, setDemoData] = useState(null);
    const [selectedDemo, setSelectedDemo] = useState(DEMO_LIST[0].path);
    const [customFileName, setCustomFileName] = useState(null);
    const [simulations, setSimulations] = useState(100);
    const [showLogs, setShowLogs] = useState(false);

    // Flow management states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fileInputRef = useRef(null);

    const loadDemo = (path) => {
        setLoading(true);
        setError(null);
        setCustomFileName(null);

        axios.get(path)
            .then((res) => {
                setDemoData(res.data || null);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Error on loading the demo.");
                setLoading(false);
            });
    };

    useEffect(() => {
        loadDemo(selectedDemo);
    }, [selectedDemo]);

    const handleDemoChange = (e) => {
        setSelectedDemo(e.target.value);
    };

    const handleDownloadDemo = () => {
        const demo = DEMO_LIST.find((d) => d.path === selectedDemo);
        if (!demo) return;

        const link = document.createElement("a");
        link.href = demo.path;
        link.download = demo.path.split("/").pop();
        link.click();
    };

    const handleFileImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                setDemoData(parsed);
                setCustomFileName(file.name);
                setError(null);
            } catch {
                setError("The selected file is not a valid JSON.");
                setDemoData(null);
                setCustomFileName(null);
            }
        };
        reader.onerror = () => {
            setError("Error on reading the file.");
        };
        reader.readAsText(file);

        // Reset input so the same file può essere ricaricato se necessario
        e.target.value = null;
    };

    const handleSimulationsChange = (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val > 0) setSimulations(val);
    };

    const currentLabel = customFileName
        ? `Custom: ${customFileName}`
        : DEMO_LIST.find((d) => d.path === selectedDemo)?.label ?? "Demo";

    return (
        <div>
            <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                {/* Demo selector */}
                <select value={selectedDemo} onChange={handleDemoChange}>
                    {DEMO_LIST.map((demo) => (
                        <option key={demo.path} value={demo.path}>
                            {demo.label}
                        </option>
                    ))}
                </select>

                <button onClick={handleDownloadDemo}>
                    Download demo
                </button>

                <button onClick={() => fileInputRef.current?.click()}>
                    Import JSON
                </button>
                <input
                    type="file"
                    accept=".json"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileImport}
                />

                <label>
                    Simulations:&nbsp;
                    <input
                        type="number"
                        min={1}
                        value={simulations}
                        onChange={handleSimulationsChange}
                        style={{ width: "80px" }}
                    />
                </label>

                <button onClick={() => setShowLogs((prev) => !prev)}>
                    {showLogs ? "Hide logs" : "Show logs"}
                </button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && demoData && (
                <div>
                    <h2>{currentLabel}: {demoData.game?.name}</h2>
                    <Engine JSONData={demoData} simulations={simulations} showLogs={showLogs} />
                </div>
            )}
        </div>
    );
};

export default Home;