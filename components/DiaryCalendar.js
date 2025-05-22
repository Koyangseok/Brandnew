import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const emotionLabels = {
  "😊": "기쁨", "😢": "슬픔", "😠": "화남", "😨": "불안", "❤️": "사랑",
  "😎": "자신감", "😭": "눈물", "😴": "피곤함", "😳": "당황", "🤢": "혐오",
  "😍": "설렘", "😬": "불편함", "🤯": "혼란", "😇": "평온함", "🤔": "고민중",
  "🤗": "위로", "😶": "무감정", "🤬": "격노", "🔥": "열망"
};

const DiaryCalendar = ({ diaries }) => {
  const emotionMap = diaries.reduce((map, diary) => {
    const dateKey = new Date(diary.date).toDateString();
    const emoji = Object.keys(emotionLabels).find(e => diary.emotion === e || emotionLabels[e] === diary.emotion) || "❓";

    if (!map[dateKey]) map[dateKey] = [];
    if (!map[dateKey].includes(emoji) && map[dateKey].length < 3) {
      map[dateKey].push(emoji);
    }

    return map;
  }, {});

  return (
    <div style={{ minWidth: '350px' }}>
      <h3 style={{ textAlign: 'center' }}>📅 감정 달력</h3>
      <Calendar
        tileContent={({ date }) => {
          const key = date.toDateString();
          const emoji = emotionMap[key];
          return emoji ? (
            <div style={{ fontSize: '1.2rem', lineHeight: '1.2' }}>
              {emoji}
            </div>
          ) : null;
        }}
      />
    </div>
  );
};

export default DiaryCalendar;
