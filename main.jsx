import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { MapPin, Footprints, Trophy, RotateCcw, CheckCircle2, Sparkles, ScrollText } from "lucide-react";
import { motion } from "framer-motion";
import "./style.css";

const ROUTE_POINTS = [
  { id: "motokaji", title: "元加治駅", subtitle: "出発の一礼", description: "今日のゆる巡礼を始めます。体重ではなく、まず一歩を記録します。", points: 10, stepHint: "0歩" },
  { id: "enshoji", title: "円照寺", subtitle: "御朱印・七福神ポイント", description: "札所めぐり感を高める最初の目的地。静かに深呼吸してから進みます。", points: 30, stepHint: "約700〜1000歩" },
  { id: "irumagawa", title: "入間川沿い", subtitle: "水辺のクールダウン", description: "川沿いを歩きながら、呼吸と歩幅を整えます。", points: 25, stepHint: "約2000歩" },
  { id: "asupark", title: "阿須運動公園", subtitle: "歩数を稼ぐ区間", description: "ここで少し遠回りすると8000歩に近づきます。無理なくリズムよく。", points: 35, stepHint: "約3500歩" },
  { id: "akebono", title: "あけぼの子どもの森公園", subtitle: "森の坂道ポイント", description: "少し坂道。息が上がりすぎない速さで、ダイエット向けの山場です。", points: 45, stepHint: "約5000歩" },
  { id: "hill", title: "加治丘陵ミニ坂道", subtitle: "脂肪燃焼チャレンジ", description: "坂道はゆっくりでOK。歩き切ったことに価値があります。", points: 50, stepHint: "約6200歩" },
  { id: "kasumigawa", title: "霞川方面", subtitle: "静かな道で振り返り", description: "今日の気づきを一つだけメモします。研究メモでも、身体メモでもOK。", points: 30, stepHint: "約7200歩" },
  { id: "goal", title: "元加治駅へ戻る", subtitle: "8000歩達成チェック", description: "ゴールです。歩いた自分に小さく拍手。次回につながる記録を残します。", points: 60, stepHint: "約8000〜10000歩" },
];

const BADGES = [
  { threshold: 50, label: "巡礼はじめ" },
  { threshold: 100, label: "水辺の歩き人" },
  { threshold: 180, label: "坂道チャレンジャー" },
  { threshold: 250, label: "元加治ゆる巡礼マスター" },
];

function loadState() {
  try {
    const raw = localStorage.getItem("motokajiPilgrimageState");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function App() {
  const saved = loadState();
  const [checked, setChecked] = useState(saved?.checked ?? {});
  const [memo, setMemo] = useState(saved?.memo ?? "");
  const [walkDate, setWalkDate] = useState(saved?.walkDate ?? new Date().toISOString().slice(0, 10));

  const totalPoints = useMemo(
    () => ROUTE_POINTS.reduce((sum, item) => sum + (checked[item.id] ? item.points : 0), 0),
    [checked]
  );

  const completedCount = useMemo(
    () => ROUTE_POINTS.filter((item) => checked[item.id]).length,
    [checked]
  );

  const progress = Math.round((completedCount / ROUTE_POINTS.length) * 100);
  const earnedBadges = BADGES.filter((badge) => totalPoints >= badge.threshold);

  useEffect(() => {
    localStorage.setItem("motokajiPilgrimageState", JSON.stringify({ checked, memo, walkDate }));
  }, [checked, memo, walkDate]);

  const togglePoint = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  const resetAll = () => {
    setChecked({});
    setMemo("");
    setWalkDate(new Date().toISOString().slice(0, 10));
  };

  return (
    <div style={{ minHeight: "100vh", padding: 16, color: "#292524" }}>
      <div style={{ maxWidth: 1050, margin: "0 auto" }}>
        <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 20, borderRadius: 28, background: "rgba(255,255,255,.88)", padding: 22, boxShadow: "0 12px 30px rgba(0,0,0,.08)" }}>
          <div style={{ display: "flex", gap: 18, justifyContent: "space-between", flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, background: "#ffe4e6", padding: "6px 12px", fontWeight: 700, color: "#be123c" }}>
                <Sparkles size={16} /> 元加治ゆる巡礼
              </div>
              <h1 style={{ fontSize: 34, margin: "12px 0 8px" }}>8000歩ポイント巡礼アプリ</h1>
              <p style={{ margin: 0, lineHeight: 1.7, color: "#57534e" }}>
                元加治駅から、円照寺・入間川・阿須運動公園・あけぼの子どもの森公園をめぐる記録アプリです。
              </p>
            </div>
            <div style={{ borderRadius: 22, background: "#1c1917", color: "white", padding: 18, minWidth: 160 }}>
              <div style={{ opacity: .8, fontSize: 14 }}>現在のポイント</div>
              <div style={{ fontSize: 44, fontWeight: 900 }}>{totalPoints}<span style={{ fontSize: 16 }}> pt</span></div>
            </div>
          </div>
        </motion.header>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 18 }}>
          <div style={cardStyle}>
            <div style={smallTitle}><Footprints size={18} /> 達成率</div>
            <div style={{ marginTop: 12, height: 16, background: "#e7e5e4", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "#292524", borderRadius: 999 }} />
            </div>
            <p style={{ fontSize: 24, fontWeight: 800, margin: "10px 0 0" }}>{progress}%</p>
          </div>

          <div style={cardStyle}>
            <div style={smallTitle}><MapPin size={18} /> チェック地点</div>
            <p style={{ fontSize: 34, fontWeight: 900, margin: "14px 0 0" }}>{completedCount}/{ROUTE_POINTS.length}</p>
          </div>

          <div style={cardStyle}>
            <label style={{ fontSize: 14, fontWeight: 700, color: "#78716c" }}>歩いた日</label>
            <input type="date" value={walkDate} onChange={(e) => setWalkDate(e.target.value)}
              style={{ marginTop: 10, width: "100%", borderRadius: 18, border: "1px solid #ddd6d0", padding: 12 }} />
          </div>
        </section>

        <main style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(280px, .65fr)", gap: 18 }} className="mainGrid">
          <section style={{ display: "grid", gap: 12 }}>
            {ROUTE_POINTS.map((item, index) => {
              const done = !!checked[item.id];
              return (
                <motion.button key={item.id} onClick={() => togglePoint(item.id)}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.035 }}
                  style={{ width: "100%", borderRadius: 26, border: done ? "1px solid #86efac" : "1px solid white", padding: 16, textAlign: "left", boxShadow: "0 8px 20px rgba(0,0,0,.07)", background: done ? "#ecfdf5" : "rgba(255,255,255,.92)", cursor: "pointer" }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 46, height: 46, borderRadius: 18, display: "grid", placeItems: "center", fontWeight: 900, flexShrink: 0, background: done ? "#059669" : "#ffe4e6", color: done ? "white" : "#be123c" }}>
                      {done ? <CheckCircle2 size={24} /> : index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                        <div>
                          <h2 style={{ margin: 0, fontSize: 19 }}>{item.title}</h2>
                          <p style={{ margin: "4px 0 0", fontWeight: 700, color: "#be123c" }}>{item.subtitle}</p>
                        </div>
                        <div style={{ borderRadius: 999, background: "#1c1917", color: "white", padding: "6px 12px", fontWeight: 800 }}>+{item.points}pt</div>
                      </div>
                      <p style={{ lineHeight: 1.7, color: "#57534e", margin: "8px 0" }}>{item.description}</p>
                      <span style={{ borderRadius: 999, background: "#f5f5f4", padding: "5px 10px", fontSize: 13, fontWeight: 700, color: "#57534e" }}>{item.stepHint}</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </section>

          <aside style={{ display: "grid", gap: 14, alignSelf: "start" }}>
            <section style={cardStyle}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 20, fontWeight: 800 }}><Trophy size={22} /> 獲得バッジ</div>
              {earnedBadges.length === 0 ? (
                <p style={{ lineHeight: 1.7, color: "#57534e" }}>50ptで最初のバッジが開きます。まず円照寺まで歩くと近いです。</p>
              ) : (
                <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
                  {earnedBadges.map((badge) => <div key={badge.label} style={{ borderRadius: 16, background: "#fef3c7", color: "#78350f", padding: 12, fontWeight: 800 }}>{badge.label}</div>)}
                </div>
              )}
            </section>

            <section style={cardStyle}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 20, fontWeight: 800 }}><ScrollText size={22} /> 今日のひとことメモ</div>
              <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="例：坂道で息が上がった。でも帰りは気持ちよかった。"
                style={{ marginTop: 12, minHeight: 150, width: "100%", borderRadius: 18, border: "1px solid #ddd6d0", padding: 12, lineHeight: 1.7 }} />
            </section>

            <section style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>安全メモ</h2>
              <p style={{ lineHeight: 1.7, color: "#57534e" }}>実際に歩くときは、Googleマップなどで現在地と安全な歩道を確認してください。体調が悪い日は、阿須運動公園で折り返しても十分です。</p>
            </section>

            <button onClick={resetAll} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", borderRadius: 26, background: "#1c1917", color: "white", padding: 16, fontWeight: 800, border: 0, cursor: "pointer" }}>
              <RotateCcw size={20} /> 記録をリセット
            </button>
          </aside>
        </main>
      </div>
      <style>{`@media (max-width: 850px){ .mainGrid{ grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

const cardStyle = {
  borderRadius: 26,
  background: "rgba(255,255,255,.9)",
  padding: 18,
  boxShadow: "0 8px 20px rgba(0,0,0,.07)",
};

const smallTitle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 14,
  fontWeight: 800,
  color: "#78716c",
};

createRoot(document.getElementById("root")).render(<App />);
