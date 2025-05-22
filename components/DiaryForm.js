import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LbtiPopup from './LbtiPopup';

const DiaryForm = ({ onAdd, editingDiary }) => {
  const [text, setText] = useState('');
  const [emotion, setEmotion] = useState('기쁨');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [lbtiResult, setLbtiResult] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (editingDiary) {
      setText(editingDiary.text);
      setEmotion(editingDiary.emotion);
    } else {
      setText('');
      setEmotion('기쁨');
    }
  }, [editingDiary]);

  
const MAX_DAILY_USAGE = 2;

const getUsageCount = (key) => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const usage = JSON.parse(localStorage.getItem(key)) || {};
  return usage[today] || 0;
};

const incrementUsageCount = (key) => {
  const today = new Date().toISOString().slice(0, 10);
  const usage = JSON.parse(localStorage.getItem(key)) || {};
  usage[today] = (usage[today] || 0) + 1;
  localStorage.setItem(key, JSON.stringify(usage));
};


  const handleAnalyze = async () => {
    const count = getUsageCount('analyzeUsage');
    if (count >= MAX_DAILY_USAGE) {
      alert('오늘은 감정 추천을 더 이상 이용할 수 없습니다. 내일 다시 시도해 주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/emotion', { text });
      setEmotion(response.data.emotion);
      incrementUsageCount('analyzeUsage');
    } catch (error) {
      console.error('감정 분석 오류:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLbti = async () => {
    const count = getUsageCount('lbtiUsage');
    if (count >= MAX_DAILY_USAGE) {
      alert('오늘은 생활유형지수 분석을 더 이상 이용할 수 없습니다. 내일 다시 시도해 주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/lbti', { text });
      setLbtiResult(response.data);
      setShowPopup(true);
      incrementUsageCount('lbtiUsage');
    } catch (error) {
      console.error('LBTI 분석 오류:', error.message);
      alert('분석 실패! 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text || !emotion) return;

    onAdd({ text, emotion });
    setText('');
    setEmotion('기쁨');
    setRecommendation('');
  };

  const emotionMap = {
    "기쁨": "😊", "슬픔": "😢", "화남": "😠", "불안": "😨",
    "사랑": "❤️", "자신감": "😎", "눈물": "😭", "피곤함": "😴",
    "당황": "😳", "혐오": "🤢", "설렘": "😍", "불편함": "😬",
    "혼란": "🤯", "평온함": "😇", "고민중": "🤔", "위로": "🤗",
    "무감정": "😶", "격노": "🤬"
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>오늘의 마음을 적어보세요</h2>
      <textarea
        rows="4"
        placeholder="내용 입력"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        style={{ width: '100%', fontSize: '16px', marginBottom: '0.5rem' }}
      />
      <div>
        <label>감정 선택: </label>
        <select value={emotion} onChange={(e) => setEmotion(e.target.value)} required>
          {Object.entries(emotionMap).map(([label, emoji]) => (
            <option key={label} value={label}>
              {label} {emoji}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button type="button" onClick={handleAnalyze} disabled={loading}>🧠 감정 추천</button>
        <button type="button" onClick={handleLbti} disabled={loading}>🌈 생활유형지수 분석</button>
        <button type="submit">✍️ 저장</button>
      </div>

      {showPopup && lbtiResult && (
        <LbtiPopup result={lbtiResult} onClose={() => setShowPopup(false)} />
      )}
    </form>
  );
};

export default DiaryForm;