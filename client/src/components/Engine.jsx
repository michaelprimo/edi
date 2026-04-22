//the core of Edi: we receive the data from the JSON, we run multiple times the fights and we get the results
 
import { useState, useEffect } from "react";
import { runEngine } from '.././engine/engine.js';
import { validateData } from '.././engine/validateData.js';
 
export default function Engine({ JSONData, simulations = 100, showLogs = false })
{
    const [winRates, setWinRates] = useState([]);
    const [logs, setLogs] = useState([]);
    const [seed, setSeed] = useState(0);
 
    useEffect(() => {
 
        let winCount = {};
        let loseCount = {};
        let allLogs = [];
 
        for (let i = 0; i < simulations; i++)
        {
            let result = runEngine(JSONData);
 
            const winnersEntry = result.checkRules?.find(r => r.winners);
            const losersEntry  = result.checkRules?.find(r => r.losers);
 
            if (winnersEntry)
            {
                const winner = winnersEntry.winners[0].battlerType;
                winCount[winner] = (winCount[winner] || 0) + 1;
            }
 
            if (losersEntry)
            {
                const loser = losersEntry.losers[0].battlerType;
                loseCount[loser] = (loseCount[loser] || 0) + 1;
            }
 
            allLogs.push(`Simulation ${i + 1}`, ...result.logs);
        }
 
        // winrate calculation
        const results = Object.entries(winCount).map(([type, count]) => ({
            type,
            winRate: ((count / simulations) * 100).toFixed(2),
            wins: count,
        }));
 
        setWinRates(results);
        setLogs(allLogs);
 
    }, [JSONData, simulations, seed]);
 
    return (
        <div>
            <h3>Win Rates ({simulations} simulazioni)&nbsp;
                <button onClick={() => setSeed(s => s + 1)}>Riesegui</button>
            </h3>
            <p>Seed: {seed}</p>
            {winRates.length === 0
                ? <p>Nessun risultato.</p>
                : winRates.map(({ type, winRate, wins }) => (
                    <p key={type}>{type}: {winRate}% ({wins}/{simulations})</p>
                ))
            }
 
            {showLogs && (
                <div>
                    {logs.map((log, i) => <p key={i}>{log}</p>)}
                </div>
            )}
        </div>
    );
}