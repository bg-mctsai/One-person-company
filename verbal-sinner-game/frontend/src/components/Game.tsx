import React, { useState, useEffect, useRef } from 'react';
import { scenes } from '../data';
import './Game.css';

const Game: React.FC = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0); // Formerly imageIndex
  const videoRef = useRef<HTMLVideoElement>(null);

  // Function to go to the next video or scene
  const handleVideoEnd = () => {
    const scene = scenes[currentScene];
    if (videoIndex < scene.images.length - 1) {
      // Go to the next video in the same scene
      setVideoIndex(videoIndex + 1);
    } else {
      // End of the scene, go to the next scene
      if (currentScene < scenes.length - 1) {
        setCurrentScene(currentScene + 1);
        setVideoIndex(0); // Reset for the new scene
      } else {
        console.log("Game Over");
        // TODO: Navigate to Game Over screen
      }
    }
  };

  // Effect to play the video when the source changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Browser prevented autoplay. User interaction needed.");
      });
    }
  }, [currentScene, videoIndex]); // Re-run when scene or video index changes

  const scene = scenes[currentScene];
  const currentDialogue = scene.dialogue[videoIndex];
  
  // Construct the video source path by replacing the extension
  // e.g., /images/scene1-image1.svg -> /videos/scene1-image1.mp4
  const imagePath = scene.images[videoIndex]; // e.g., "/images/scene1-image1.svg"
  const videoPath = imagePath.replace('/images/', '/videos/').replace('.svg', '.mp4');

  return (
    <div className="game-container">
      <div className="image-container"> {/* Reusing styles */}
        {/* The video element is re-rendered whenever the src changes, thanks to the `key` prop */}
        <video
          ref={videoRef}
          key={videoPath} 
          src={videoPath}
          onEnded={handleVideoEnd}
          autoPlay
          muted
          playsInline
          className={'visible'}
          width="100%"
          height="100%"
        />
      </div>
      <div className="dialogue-container">
        <p>{currentDialogue}</p>
      </div>
    </div>
  );
};

export default Game;
