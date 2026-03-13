export function shuffleObjects(array) {
    const shuffled = [...array]; 
    
    for (let i = shuffled.length - 1; i > 0; i--) {
        //questo "random" deve essere sistemato con qualcos'altro che dia RNG seedato
        const randomIndex = Math.floor(Math.random() * (i + 1)); 
        [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }
    return shuffled;
    }