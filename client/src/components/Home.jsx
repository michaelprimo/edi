import { useEffect, useState } from "react";
import axios from "axios";
import Engine from "./Engine";

const Home = () => {
    const [demoData, setDemoData] = useState([]);

    // Stati per la gestione del flusso
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("/demos/finalcombo.json")
            .then((res) => {
                setDemoData(res.data || []);

                // --- PUNTO CRUCIALE ---
                setLoading(false); // Diciamo a React che i dati sono arrivati!
            })
            .catch((err) => {
                console.error(err);
                setError("Errore nel caricamento");
                setLoading(false); // Anche in caso di errore smettiamo di caricare
            });
    }, []);

    if (loading) return <p>Caricamento in corso...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Demo: {demoData.game.name}</h2>
            <p>Turni trascorsi: {demoData.game.turns}</p>

            <h3>Combattenti:</h3>
            <ul>
                {demoData.battlers.map((b, index) => (
                    <li key={index}>
                        <strong>{b.name}</strong> - Salute: {b.stats.health}
                    </li>
                ))}
                {demoData.rules.map((r, index) => (
                    <li key={index}>
                        <strong>{r.condition.stat}</strong> - Salute: {r.condition.operator}

                    </li>
                ))}

                <strong>{JSON.stringify(demoData)}</strong>
                <Engine JSONData={demoData} />
            </ul>
        </div>
    );
};

export default Home;