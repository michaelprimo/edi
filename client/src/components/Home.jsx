//This component finds the JSON and gets all the data from it, passing them to the application and processing them

import { useEffect, useState } from "react";
import axios from "axios";
//we will pass everything here to this component, the core of Edi
import Engine from "./Engine";

const Home = () => {
    //the data inside JSON
    const [demoData, setDemoData] = useState([]);

    // Flow management states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        //To fix later, for now we have a static JSON
        axios.get("/demos/finalcombo.json")
            .then((res) => {
                //We put all the data on the state or a blank array
                setDemoData(res.data || []);

                //finished loading
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Loading Error");
                setLoading(false); 
            });
    }, []);

    if (loading) return <p>Loading...</p>;
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