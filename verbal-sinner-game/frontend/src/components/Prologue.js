import React, { useState, useEffect } from 'react';
import './Prologue.css';

const scenes = [
  {
    image: '/assets/images/scene1.jpg',
    sound: '/assets/sounds/bgm1.mp3',
    text: '2019年，我認識了他們，一切似乎都很美好...'
  },
  {
    image: '/assets/images/scene2.jpg',
    sound: '/assets/sounds/bgm2.mp3',
    text: '但事情開始變了，我感覺被無形的網纏住。'
  },
  {
    image: '/assets/images/scene3.jpg',
    sound: '/assets/sounds/bgm3.mp3',
    text: '我在絕望中死去，卻不知道兇手是誰。'
  },
  {
    image: null,
    sound: '/assets/sounds/system.mp3',
    text: '你的一生充滿了言語造成的罪孽...現在，給你一個機會。'
  }
];

function Prologue({ onFinish }) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [fade, setFade] = useState('in');

  useEffect(() => {
    if (currentSceneIndex >= scenes.length) {
      onFinish();
      return;
    }

    const scene = scenes[currentSceneIndex];
    // Placeholder for playing sound
    // const audio = new Audio(scene.sound);
    // audio.play();

    const fadeOutTimer = setTimeout(() => {
      setFade('out');
    }, 4000); // Scene duration

    const nextSceneTimer = setTimeout(() => {
      setCurrentSceneIndex(currentSceneIndex + 1);
      setFade('in');
    }, 5000); // Transition duration

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(nextSceneTimer);
    };
  }, [currentSceneIndex, onFinish]);

  if (currentSceneIndex >= scenes.length) {
    return null;
  }

  const currentScene = scenes[currentSceneIndex];

  return (
    <div className={`prologue-container fade-${fade}`} style={{ backgroundImage: `url(${currentScene.image})` }}>
      <p className="prologue-text">{currentScene.text}</p>
    </div>
  );
}

export default Prologue;
