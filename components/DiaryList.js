import React from 'react';
import html2canvas from 'html2canvas';

const emojiMap = {
  "기쁨": "😊", "슬픔": "😢", "화남": "😠", "불안": "😨", "사랑": "❤️",
  "자신감": "😎", "눈물": "😭", "피곤함": "😴", "당황": "😳", "혐오": "🤢",
  "설렘": "😍", "불편함": "😬", "혼란": "🤯", "평온함": "😇", "고민중": "🤔",
  "위로": "🤗", "무감정": "😶", "격노": "🤬", "열망": "🔥", "스트레스": "💢"
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
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div style={{
        marginTop: '2rem',
        maxHeight: '500px',
        overflowY: 'auto',
        overflowX: 'hidden', // 가로 스크롤 방지
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%',
        maxWidth: '400px', // ⭐ 최대 폭 제한
        boxSizing: 'border-box'
      }}>
        <h2 style={{ textAlign: 'center' }}>📘 일기 목록</h2>
        {diaries.length === 0 ? (
          <p>일기가 없습니다.</p>
        ) : (
          diaries.map((diary) => (
            <div key={diary.id} id={`diary-${diary.id}`} style={{
              backgroundColor: '#e6f2ff',
              borderRadius: '12px',
              padding: '1rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{emojiMap[diary.emotion] || diary.emotion}</span>
                <span style={{ color: '#555' }}>| {new Date(diary.date).toLocaleDateString()}</span>
              </div>
              {diary.text && (
                <div style={{ fontSize: '1.1rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {diary.text}
                </div>
              )}
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                justifyContent: 'flex-end',
                flexWrap: 'wrap'
              }}>
                <button onClick={() => onEdit(diary)}>✏️ 수정</button>
                <button onClick={() => onDelete(diary.id)} style={{ backgroundColor: '#f44336', color: 'white' }}>
                  🗑️ 삭제
                </button>
                <button onClick={() => handleCapture(diary.id)} style={{ backgroundColor: '#2196f3', color: 'white' }}>
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
