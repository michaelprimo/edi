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

                
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Errore nel caricamento");
                setLoading(false); 
            });
    }, []);

    if (loading) return <p>Caricamento in corso...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Demo: {demoData.game.name}</h2>
            <p>Turni trascorsi: {demoData.game.turns}</p>
            
                <Engine JSONData={demoData} />
            
        </div>
    );
};

export default Home;