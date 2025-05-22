import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import html2canvas from 'html2canvas';

const COLORS = ['#FFCC00', '#00C49F', '#FF6F61', '#FF9F00', '#8884d8', '#FFA07A', '#98FB98', '#DDA0DD'];

const emotionLabels = {
  "😊": "기쁨", "😢": "슬픔", "😠": "화남", "😨": "불안", "❤️": "사랑",
  "😎": "자신감", "😭": "눈물", "😴": "피곤함", "😳": "당황", "🤢": "혐오",
  "😍": "설렘", "😬": "불편함", "🤯": "혼란", "😇": "평온함", "🤔": "고민중",
  "🤗": "위로", "😶": "무감정", "🤬": "격노"
};

const EmotionStats = ({ diaries }) => {
  const normalizeEmotion = (e) => {
    if (emotionLabels[e]) return e;
    const found = Object.entries(emotionLabels).find(([, label]) => label === e);
    return found ? found[0] : e;
  };

  const stats = diaries.reduce((acc, { emotion }) => {
    const normalized = normalizeEmotion(emotion);
    const label = emotionLabels[normalized] || "기타";
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(stats).map(([name, value]) => ({
    name,
    value,
    emoji: Object.entries(emotionLabels).find(([, label]) => label === name)?.[0] || "❓"
  }));

  const handleDownload = () => {
    const chartArea = document.getElementById('emotion-chart');
    if (!chartArea) return;
    html2canvas(chartArea, { scale: 3 }).then(canvas => {
      const link = document.createElement('a');
      link.download = '감정통계.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>📊 감정 분포 통계</h3>
      {data.length === 0 ? (
        <p>아직 통계를 낼 데이터가 없습니다.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          <div id="emotion-chart" style={{ textAlign: 'center' }}>
            <PieChart width={400} height={300}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label={({ name, x, y }) => (
                  <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={18}>
                    {data.find(d => d.name === name)?.emoji} {name}
                  </text>
                )}
              >
                {data.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            <button onClick={handleDownload} style={{
              marginTop: '1rem', padding: '0.4rem 1rem', backgroundColor: '#4caf50',
              color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer'
            }}>
              📷 이미지로 저장
            </button>
          </div>
          <div>
            <h4>감정별 횟수</h4>
            <table style={{ borderCollapse: 'collapse', width: '200px' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>감정</th>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'right' }}>횟수</th>
                </tr>
              </thead>
              <tbody>
                {data.map(({ name, value, emoji }) => (
                  <tr key={name}>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{emoji}</span>
                      <span>{name}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionStats;
