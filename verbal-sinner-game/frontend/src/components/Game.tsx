import React, { useState } from 'react';
import { scenes } from './data';

const Game: React.FC = () => {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);

  const handleNext = () => {
    if (imageIndex < scenes[sceneIndex].images.length - 1) {
      setImageIndex(imageIndex + 1);
    } else if (sceneIndex < scenes.length - 1) {
      setSceneIndex(sceneIndex + 1);
      setImageIndex(0);
    } else {
      // Game over
      console.log('Game Over');
    }
  };

  const currentScene = scenes[sceneIndex];
  const currentImage = currentScene.images[imageIndex];
  const currentDialogue = currentScene.dialogue[imageIndex];

  return (
    <div className="w-screen h-screen bg-black flex flex-col justify-center items-center">
      <h1 className="text-4xl text-white mb-8">{currentScene.title}</h1>
      <img src={currentImage} alt="game scene" className="w-3/4 h-3/4 object-contain" />
      <div className="absolute bottom-10 left-10 right-10 bg-gray-800 bg-opacity-75 p-4 rounded-lg">
        <p className="text-white text-2xl">{currentDialogue}</p>
        <button onClick={handleNext} className="text-white mt-4 bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded">
          下一步
        </button>
      </div>
    </div>
  );
};

export default Game;