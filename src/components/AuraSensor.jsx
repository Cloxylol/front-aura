import React, { useEffect, useState, useRef } from 'react';

import { Camera, Activity } from 'lucide-react';
import '../styles/AuraSensor.css';

const EMOTIONS = [
    { label: 'Neutre', scoreMod: 0 },
    { label: 'Joyeux', scoreMod: +15 },
    { label: 'Concentré', scoreMod: +5 },
    { label: 'Surpris', scoreMod: +10 },
    { label: 'Fatigué', scoreMod: -5 },
];

const AuraSensor = ({ onScoreUpdate }) => {
    const [detecting, setDetecting] = useState(true);
    const [currentEmotion, setCurrentEmotion] = useState(EMOTIONS[0]);

    useEffect(() => {
        const interval = setInterval(() => {

            const randomEmotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
            setCurrentEmotion(randomEmotion);
            onScoreUpdate(prev => prev + randomEmotion.scoreMod);
        }, 3000);

        return () => clearInterval(interval);
    }, [onScoreUpdate]);

    return null;
};

export default AuraSensor;
