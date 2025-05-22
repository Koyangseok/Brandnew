
import React from 'react';

const LbtiPopup = ({ result, onClose }) => {
  if (!result) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%',
      height: '100%', backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white', padding: '2rem', borderRadius: '12px',
        width: '90%', maxWidth: '400px', textAlign: 'center'
      }}>
        <h3>생활유형: {result.type}</h3>
        <p><strong>{result.title}</strong></p>
         <p style={{ marginTop: '1rem' }}>{result.description}</p>
        <h4>오늘의 마음 상태</h4>
        {Object.entries(result.scores).map(([label, score]) => (
          <div key={label} style={{ margin: '0.5rem 0' }}>
            <div style={{ fontSize: '14px', textAlign: 'left' }}>{label}: {score}</div>
            <input type="range" min="0" max="10" value={score} disabled style={{ width: '100%' }} />
          </div>
        ))}
        <button onClick={onClose} style={{ marginTop: '1rem' }}>닫기</button>
      </div>
    </div>
  );
};

export default LbtiPopup;
