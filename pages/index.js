import React, { useState, useEffect } from "react";
import DiaryForm from '../components/DiaryForm';
import DiaryList from '../components/DiaryList';
import DiaryCalendar from '../components/DiaryCalendar';
import { getAllDiaries, addDiary, updateDiary, deleteDiary } from '../components/idb';
import EmotionStats from '../components/EmotionStats';

// Chatbot 컴포넌트
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [usageCount, setUsageCount] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem("chatbotUsage") || "{}");
    if (stored.date === today) {
      setUsageCount(stored.count || 0);
    } else {
      localStorage.setItem("chatbotUsage", JSON.stringify({ date: today, count: 0 }));
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (usageCount >= 2) {
      alert("오늘은 신항이에게 두 번만 물어볼 수 있어요!");
      return;
    }

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);

    const response = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });
    const data = await response.json();
    setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    setInput("");

    const today = new Date().toDateString();
    const newCount = usageCount + 1;
    localStorage.setItem("chatbotUsage", JSON.stringify({ date: today, count: newCount }));
    setUsageCount(newCount);
  };

  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h2>💬 신항이</h2>
      <div style={{
        border: "1px solid #ccc", borderRadius: "8px", padding: "1rem", minHeight: "300px", marginBottom: "1rem"
      }}>
        {messages.map((msg, idx) => (
          <p key={idx} style={{ color: msg.role === "user" ? "#333" : "#0070f3", margin: "0.5rem 0" }}>
            <b>{msg.role === "user" ? "나" : "신항이"}:</b> {msg.content}
          </p>
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
          disabled={usageCount >= 2}
          style={{ flex: 1, padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <button
          onClick={sendMessage}
          disabled={usageCount >= 2}
          style={{
            padding: "0.5rem 1rem",
            background: usageCount >= 2 ? "#ccc" : "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px"
          }}
        >
          전송
        </button>
      </div>
      {usageCount >= 2 && <p style={{ color: "red", marginTop: "0.5rem" }}>오늘은 신항이에게 2번만 물어볼 수 있어요.</p>}
    </div>
  );
};

export default function Home() {
  const [diaries, setDiaries] = useState([]);
  const [view, setView] = useState('diary');
  const [editingDiary, setEditingDiary] = useState(null);  // ⭐ 수정 중인 일기 상태

  useEffect(() => {
    getAllDiaries().then(setDiaries);
  }, []);

  const handleAdd = async (diary) => {
    if (!diary.id) {
      diary.id = Date.now(); // ⭐️ 새로 작성시 id 생성
      await addDiary({ ...diary, date: new Date().toISOString() });
    } else {
      await updateDiary(diary);
    }
    const updated = await getAllDiaries();
    setDiaries(updated);
    setEditingDiary(null);
  };

  const handleEdit = (diary) => {
    setEditingDiary(diary);  // ⭐ 수정할 일기 정보를 DiaryForm에 넘김
  };

  const handleDelete = async (id) => {
    await deleteDiary(id);
    const updated = await getAllDiaries();
    setDiaries(updated);
    // ⭐ 삭제된 항목이 수정 중이었으면 초기화
    if (editingDiary && editingDiary.id === id) {
      setEditingDiary(null);
    }
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
              border: 'none', padding: '0.5rem 1rem', borderRadius: '10px'
            }}
          >
            ✍️ 일기
          </button>
          <button
            onClick={() => setView('stats')}
            style={{
              backgroundColor: view === 'stats' ? '#FFD966' : '#EDEDED',
              border: 'none', padding: '0.5rem 1rem', borderRadius: '10px'
            }}
          >
            📊 통계
          </button>
          <button
            onClick={() => setView('chatbot')}
            style={{
              backgroundColor: view === 'chatbot' ? '#FFD966' : '#EDEDED',
              border: 'none', padding: '0.5rem 1rem', borderRadius: '10px'
            }}
          >
            💬 신항이
          </button>
        </div>
      </header>

      {view === 'diary' && (
        <>
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <DiaryForm onAdd={handleAdd} editingDiary={editingDiary} />
          </div>
          <div style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '2rem',
            width: '100%', maxWidth: '1100px', marginTop: '2rem', alignItems: 'flex-start', flexWrap: 'wrap'
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

      {view === 'chatbot' && (
        <Chatbot />
      )}
    </div>
  );
}
