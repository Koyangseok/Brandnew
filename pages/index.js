import React, { useState, useEffect } from 'react';
import DiaryForm from '../components/DiaryForm';
import DiaryList from '../components/DiaryList';
import DiaryCalendar from '../components/DiaryCalendar';
import { getAllDiaries, addDiary, updateDiary, deleteDiary } from '../components/idb';
import EmotionStats from '../components/EmotionStats';

export default function Home() {
  const [diaries, setDiaries] = useState([]);
  const [view, setView] = useState('diary'); // 'diary' 또는 'stats'

  useEffect(() => {
    getAllDiaries().then(setDiaries);
  }, []);

  const handleAdd = async (diary) => {
    await addDiary({ ...diary, date: new Date().toISOString() });
    const updated = await getAllDiaries();
    setDiaries(updated);
  };

  const handleEdit = async (id, newText) => {
    const updatedDiaries = diaries.map(d => d.id === id ? { ...d, text: newText } : d);
    await updateDiary(updatedDiaries.find(d => d.id === id));
    setDiaries(updatedDiaries);
  };

  const handleDelete = async (id) => {
    await deleteDiary(id);
    const updated = await getAllDiaries();
    setDiaries(updated);
  };

  return (
    <div style={{
      backgroundColor: '#fff8f2',
      minHeight: '100vh',
      padding: '2rem 1rem',
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem' }}>🏫 신항초 3학년 Ai마음일기</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button
            onClick={() => setView('diary')}
            style={{
              backgroundColor: view === 'diary' ? '#FFD966' : '#EDEDED',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '10px'
            }}
          >
            ✍️ 일기
          </button>
          <button
            onClick={() => setView('stats')}
            style={{
              backgroundColor: view === 'stats' ? '#FFD966' : '#EDEDED',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '10px'
            }}
          >
            📊 통계
          </button>
        </div>
      </header>

      {view === 'diary' && (
        <>
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <DiaryForm onAdd={handleAdd} />
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: '2rem',
            width: '100%',
            maxWidth: '1100px',
            marginTop: '2rem',
            alignItems: 'flex-start',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: '320px' }}>
              <DiaryList diaries={diaries} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
            <div style={{ minWidth: '350px' }}>
              <DiaryCalendar diaries={diaries} />
            </div>
          </div>
        </>
      )}

      {view === 'stats' && (
        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.2rem' }}>
          <EmotionStats diaries={diaries} />
        </div>
      )}
    </div>
  );
}
