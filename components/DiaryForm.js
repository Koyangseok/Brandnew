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
  const [analyzeUsed, setAnalyzeUsed] = useState(false);
  const [lbtiUsed, setLbtiUsed] = useState(false);

  const emotionMap = {
    "기쁨": "😊", "슬픔": "😢", "화남": "😠", "불안": "😨",
    "사랑": "❤️", "자신감": "😎", "눈물": "😭", "피곤함": "😴",
    "당황": "😳", "혐오": "🤢", "설렘": "😍", "불편함": "😬",
    "혼란": "🤯", "평온함": "😇", "고민중": "🤔", "위로": "🤗",
    "무감정": "😶", "격노": "🤬", "열망": "🔥", "스트레스": "💢" 
  };

  const emotionList = Object.keys(emotionMap);

  useEffect(() => {
    if (editingDiary) {
      const validEmotion = emotionList.includes(editingDiary.emotion)
        ? editingDiary.emotion
        : '기타';
      setText(editingDiary.text);
      setEmotion(validEmotion);
    } else {
      setText('');
      setEmotion('기쁨');
    }
    setAnalyzeUsed(false);
    setLbtiUsed(false);
  }, [editingDiary]);

  const handleAnalyze = async () => {
    if (analyzeUsed) {
      alert('이 일기에 대해 감정 추천은 이미 사용했습니다.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/emotion', { text });
      let apiEmotion = response.data.emotion?.trim();
      if (!emotionList.includes(apiEmotion)) {
        apiEmotion = '기타';
      }
      setEmotion(apiEmotion);
      setAnalyzeUsed(true);
    } catch (error) {
      console.error('감정 분석 오류:', error.message);
      setEmotion('기타');
    } finally {
      setLoading(false);
    }
  };

  const handleLbti = async () => {
    if (lbtiUsed) {
      alert('이 일기에 대해 생활유형지수 분석은 이미 사용했습니다.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/lbti', { text });
      setLbtiResult(response.data);
      setShowPopup(true);
      setLbtiUsed(true);
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
    setAnalyzeUsed(false);
    setLbtiUsed(false);
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
          {emotionList.map((label) => (
            <option key={label} value={label}>
              {label} {emotionMap[label]}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button type="button" onClick={handleAnalyze} disabled={loading || analyzeUsed}>
          🧠 감정 추천
        </button>
        <button type="button" onClick={handleLbti} disabled={loading || lbtiUsed}>
          🌈 생활유형지수 분석
        </button>
        <button type="submit">✍️ 저장</button>
      </div>

      {showPopup && lbtiResult && (
        <LbtiPopup result={lbtiResult} onClose={() => setShowPopup(false)} />
      )}
    </form>
  );
};

export default DiaryForm;
