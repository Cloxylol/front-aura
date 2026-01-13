import React, { useEffect, useState, useRef } from 'react';
import Webcam from 'react-webcam';
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
            // Simulation of AI analysis
            const randomEmotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
            setCurrentEmotion(randomEmotion);
            onScoreUpdate(prev => prev + randomEmotion.scoreMod);
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, [onScoreUpdate]);

    return (
        <div className="aura-sensor-widget">
            <div className="webcam-container">
                <Webcam
                    audio={false}
                    width={120}
                    height={90}
                    screenshotFormat="image/jpeg"
                    className="webcam-feed"
                />
                <div className="scan-overlay"></div>
            </div>

            <div className="sensor-info">
                <div className="status-row">
                    <Camera size={14} className="blink-icon" />
                    <span>Analyse en cours...</span>
                </div>
                <div className="emotion-row">
                    <Activity size={14} />
                    <span>{currentEmotion.label}</span>
                </div>
            </div>
        </div>
    );
};

export default AuraSensor;
