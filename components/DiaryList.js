import React from 'react';
import html2canvas from 'html2canvas';

const emojiMap = {
  "기쁨": "😊", "슬픔": "😢", "화남": "😠", "불안": "😨", "사랑": "❤️",
  "자신감": "😎", "눈물": "😭", "피곤함": "😴", "당황": "😳", "혐오": "🤢",
  "설렘": "😍", "불편함": "😬", "혼란": "🤯", "평온함": "😇", "고민중": "🤔",
  "위로": "🤗", "무감정": "😶", "격노": "🤬", "열망": "🔥"
};

const DiaryList = ({ diaries, onEdit, onDelete }) => {
  const handleCapture = (id) => {
    const target = document.getElementById(`diary-${id}`);
    if (!target) return;
    html2canvas(target, { scale: 2 }).then(canvas => {
      const link = document.createElement('a');
      link.download = '일기.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{
      marginTop: '2rem',
      maxHeight: '500px',
      overflowY: 'auto', overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <h2 style={{ textAlign: 'center' }}>📘 일기 목록</h2>
      {diaries.length === 0 ? (
        <p>일기가 없습니다.</p>
      ) : (
        diaries.map(({ id, text, emotion, date }) => (
          <div key={id} id={`diary-${id}`} style={{
            backgroundColor: '#e6f2ff',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            maxWidth: '500px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            gap: '0.75rem'
          }}>
            <div style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{emojiMap[emotion] || emotion}</span>
              <span style={{ color: '#555' }}>| {new Date(date).toLocaleDateString()}</span>
            </div>
            <div style={{ fontSize: '1.1rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {text}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button onClick={() => onEdit(id)}>✏️ 수정</button>
              <button onClick={() => onDelete(id)} style={{ backgroundColor: '#f44336', color: 'white' }}>
                🗑️ 삭제
              </button>
              <button onClick={() => handleCapture(id)} style={{ backgroundColor: '#2196f3', color: 'white' }}>
                📸 이미지로 저장
              </button>
            </div>
          </div>
        ))
      )}
          </div>
    </div>
  );
};

export default DiaryList;
