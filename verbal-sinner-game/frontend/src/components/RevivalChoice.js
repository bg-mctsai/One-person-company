import React from 'react';
import './RevivalChoice.css';

function RevivalChoice({ onRevive, onEnd }) {
  const handleRevive = () => {
    alert('（模擬廣告）感謝您的觀看，歡迎回來！');
    onRevive();
  };

  return (
    <div className="revival-container">
      <p>你，願意復活，找出真相嗎？</p>
      <div className="revival-buttons">
        <button onClick={handleRevive}>復活（觀看廣告）</button>
        <button onClick={onEnd}>不，就這樣吧</button>
      </div>
    </div>
  );
}

export default RevivalChoice;
