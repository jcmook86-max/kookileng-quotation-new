'use client';
import React, { useState, useEffect } from 'react';

// ⚠️ 임시 관리자 비밀번호 — 원하는 값으로 바꾸세요. (코드에 들어있어서 강력한 보안은 아님 / 진짜 로그인은 Step 3)
const ADMIN_PW = 'kookil1234';

const wonStr = (s) => (s == null ? '-' : '₩' + s);
const fmtWon = (n) => '₩' + Math.round(n || 0).toLocaleString();

// 저장된 견적에서 날짜 추출 (ts 우선, 없으면 createdAt 문자열 파싱)
const getDate = (q) => {
  if (q.ts) return new Date(q.ts);
  const m = (q.createdAt || '').match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return null;
};
// "52,000,000" 같은 문자열 → 숫자
const parseTotal = (q) => Number(String(q.total || '').replace(/[^0-9.-]/g, '')) || 0;

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('new');
  const [yearF, setYearF] = useState('all');
  const [monthF, setMonthF] = useState('all');
  const [openIdx, setOpenIdx] = useState(null);

  const load = () => {
    try {
      const list = JSON.parse(localStorage.getItem('quotations') || '[]');
      setQuotes(Array.isArray(list) ? list : []);
    } catch { setQuotes([]); }
  };
  useEffect(() => { if (authed) load(); }, [authed]);

  const tryLogin = () => {
    if (pw === ADMIN_PW) setAuthed(true);
    else alert('비밀번호가 올바르지 않습니다.');
  };
  const removeAt = (realIdx) => {
    if (!window.confirm('이 견적을 삭제할까요?')) return;
    const list = JSON.parse(localStorage.getItem('quotations') || '[]');
    list.splice(realIdx, 1);
    localStorage.setItem('quotations', JSON.stringify(list));
    setOpenIdx(null); load();
  };
  const clearAll = () => {
    if (!window.confirm('저장된 견적을 전부 삭제할까요? (되돌릴 수 없음)')) return;
    localStorage.setItem('quotations', JSON.stringify([])); load();
  };

  if (!authed) {
    return (
      <div style={styles.loginWrap}>
        <div style={styles.loginBox}>
          <h2 style={styles.loginTitle}>🔒 견적 관리자</h2>
          <p style={styles.loginDesc}>관리자 비밀번호를 입력하세요.</p>
          <input type="password" value={pw} placeholder="비밀번호"
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') tryLogin(); }}
            style={styles.loginInput} />
          <button style={styles.loginBtn} onClick={tryLogin}>입장</button>
        </div>
      </div>
    );
  }

  // 월별 집계 (전체 기준)
  const monthMap = {};
  quotes.forEach(q => {
    const d = getDate(q);
    const key = d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` : '날짜없음';
    if (!monthMap[key]) monthMap[key] = { count: 0, sum: 0 };
    monthMap[key].count++; monthMap[key].sum += parseTotal(q);
  });
  const monthlyRows = Object.entries(monthMap).sort((a, b) => b[0].localeCompare(a[0]));
  const years = [...new Set(quotes.map(q => { const d = getDate(q); return d ? d.getFullYear() : null; }).filter(Boolean))].sort((a, b) => b - a);

  // 상세 목록 필터/정렬
  let rows = quotes.map((q, i) => ({ ...q, _i: i }));
  rows = rows.filter(q => {
    const d = getDate(q);
    if (yearF !== 'all' && (!d || d.getFullYear() !== Number(yearF))) return false;
    if (monthF !== 'all' && (!d || (d.getMonth() + 1) !== Number(monthF))) return false;
    return true;
  });
  if (search.trim()) {
    const s = search.trim().toLowerCase();
    rows = rows.filter(q =>
      (q.customerInfo?.company || '').toLowerCase().includes(s) ||
      (q.rep?.name || '').toLowerCase().includes(s) ||
      (q.model || '').toLowerCase().includes(s));
  }
  if (sort === 'new') rows = rows.reverse();
  else if (sort === 'company') rows.sort((a, b) => (a.customerInfo?.company || '').localeCompare(b.customerInfo?.company || ''));
  else if (sort === 'rep') rows.sort((a, b) => (a.rep?.name || '').localeCompare(b.rep?.name || ''));

  const resultSum = rows.reduce((s, q) => s + parseTotal(q), 0);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>📋 견적 관리자</h1>
        <p>저장된 견적 {quotes.length}건 · 날짜 / 업체명 / 담당자 · 월별·년도별 조회</p>
      </header>

      <div style={styles.notice}>
        ※ 이 목록은 <b>이 브라우저에 저장된 견적</b>만 보여줍니다. 다른 기기에서 저장한 건 보이지 않아요. (전사 통합 조회는 DB 연동 후 가능)
      </div>

      {/* 월별 집계 */}
      {monthlyRows.length > 0 && (
        <section style={styles.summaryBox}>
          <div style={styles.summaryTitle}>📅 월별 집계</div>
          <div style={styles.tableWrap}>
            <table style={styles.table}><tbody>
              <tr><th style={styles.th}>기간</th><th style={styles.thR}>건수</th><th style={styles.thR}>합계 (부가세 별도)</th></tr>
              {monthlyRows.map(([key, v]) => {
                const [y, mo] = key.split('-');
                const label = key === '날짜없음' ? '날짜 없음' : `${y}년 ${Number(mo)}월`;
                return (
                  <tr key={key} style={styles.clickRow}
                    onClick={() => { if (key !== '날짜없음') { setYearF(y); setMonthF(String(Number(mo))); } }}>
                    <td style={styles.td}>{label}</td>
                    <td style={styles.tdR}>{v.count}건</td>
                    <td style={styles.tdR}>{fmtWon(v.sum)}</td>
                  </tr>
                );
              })}
            </tbody></table>
          </div>
          <div style={styles.summaryHint}>행을 클릭하면 그 달만 아래 목록에 표시돼요.</div>
        </section>
      )}

      {/* 필터 */}
      <div style={styles.controls}>
        <input type="text" value={search} placeholder="업체명 · 담당자 · 모델 검색"
          onChange={e => setSearch(e.target.value)} style={styles.searchInput} />
        <select value={yearF} onChange={e => setYearF(e.target.value)} style={styles.select}>
          <option value="all">전체 년도</option>
          {years.map(y => <option key={y} value={y}>{y}년</option>)}
        </select>
        <select value={monthF} onChange={e => setMonthF(e.target.value)} style={styles.select}>
          <option value="all">전체 월</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}월</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} style={styles.select}>
          <option value="new">최신순</option>
          <option value="company">업체명순</option>
          <option value="rep">담당자순</option>
        </select>
        <button style={styles.refreshBtn} onClick={load}>↻</button>
        <button style={styles.clearBtn} onClick={clearAll}>전체 삭제</button>
      </div>

      <div style={styles.resultBar}>
        조회 결과 <b>{rows.length}건</b> · 합계 <b>{fmtWon(resultSum)}</b>
        {(yearF !== 'all' || monthF !== 'all' || search) &&
          <button style={styles.clearFilterBtn} onClick={() => { setYearF('all'); setMonthF('all'); setSearch(''); }}>필터 해제</button>}
      </div>

      {rows.length === 0 ? (
        <div style={styles.empty}>해당 조건의 견적이 없습니다.</div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}><tbody>
            <tr>
              <th style={styles.th}>견적일</th>
              <th style={styles.th}>업체명</th>
              <th style={styles.th}>담당자</th>
              <th style={styles.th}>제품</th>
              <th style={styles.thR}>총 견적가</th>
              <th style={styles.th}></th>
            </tr>
            {rows.map((q) => (
              <React.Fragment key={q._i}>
                <tr style={styles.clickRow} onClick={() => setOpenIdx(openIdx === q._i ? null : q._i)}>
                  <td style={styles.td}>{q.createdAt || '-'}</td>
                  <td style={styles.td}>{q.customerInfo?.company || '-'}</td>
                  <td style={styles.td}>{q.rep?.name || '-'}{q.rep?.phone ? ` (${q.rep.phone})` : ''}</td>
                  <td style={styles.td}>{q.model} {q.spec}</td>
                  <td style={styles.tdR}>{wonStr(q.total)}</td>
                  <td style={styles.tdC}>{openIdx === q._i ? '▲' : '▼'}</td>
                </tr>
                {openIdx === q._i && (
                  <tr>
                    <td style={styles.detailCell} colSpan={6}>
                      <div style={styles.detailGrid}>
                        <div><b>모델</b> : {q.model}</div>
                        <div><b>종류</b> : {q.type}</div>
                        <div><b>사양</b> : {q.spec}</div>
                        <div><b>작업범위</b> : {q.area || '-'}</div>
                        <div><b>제품 단가</b> : {wonStr(q.unitPrice)}</div>
                        <div><b>수량</b> : {q.quantity}대</div>
                        <div><b>옵션</b> : {(q.options && q.options.length) ? q.options.join(', ') : '없음'}</div>
                        <div><b>총 견적가</b> : {wonStr(q.total)}</div>
                        <div><b>고객 성명</b> : {q.customerInfo?.name || '-'}</div>
                        <div><b>고객 연락처</b> : {q.customerInfo?.phone || '-'}</div>
                        <div><b>고객 이메일</b> : {q.customerInfo?.email || '-'}</div>
                        <div><b>담당자</b> : {q.rep?.name || '-'} {q.rep?.phone ? `(${q.rep.phone})` : ''}</div>
                      </div>
                      <button style={styles.delBtn} onClick={(e) => { e.stopPropagation(); removeAt(q._i); }}>이 견적 삭제</button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody></table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' },
  header: { textAlign: 'center', marginBottom: '16px', padding: '24px', backgroundColor: '#2c3e50', color: 'white', borderRadius: '8px' },
  notice: { backgroundColor: '#fff8e1', border: '1px solid #ffe0a3', color: '#8a6d3b', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px', lineHeight: 1.6 },
  summaryBox: { backgroundColor: 'white', borderRadius: '8px', padding: '16px', marginBottom: '18px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' },
  summaryTitle: { fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' },
  summaryHint: { fontSize: '12px', color: '#999', marginTop: '8px' },
  controls: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px', alignItems: 'center' },
  searchInput: { flex: 1, minWidth: '180px', padding: '10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' },
  select: { padding: '10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff' },
  refreshBtn: { padding: '10px 14px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer' },
  clearBtn: { padding: '10px 14px', fontSize: '14px', border: 'none', borderRadius: '4px', backgroundColor: '#dc3545', color: 'white', cursor: 'pointer' },
  resultBar: { fontSize: '14px', color: '#444', margin: '6px 2px 14px', display: 'flex', alignItems: 'center', gap: '10px' },
  clearFilterBtn: { padding: '4px 10px', fontSize: '12px', border: '1px solid #ccc', borderRadius: '12px', backgroundColor: '#fff', cursor: 'pointer' },
  empty: { padding: '40px', textAlign: 'center', color: '#999', backgroundColor: 'white', borderRadius: '8px' },
  tableWrap: { overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  th: { borderBottom: '2px solid #e0e0e0', padding: '11px 10px', textAlign: 'left', backgroundColor: '#f4f6f8', fontWeight: 'bold', whiteSpace: 'nowrap' },
  thR: { borderBottom: '2px solid #e0e0e0', padding: '11px 10px', textAlign: 'right', backgroundColor: '#f4f6f8', fontWeight: 'bold', whiteSpace: 'nowrap' },
  clickRow: { cursor: 'pointer', borderBottom: '1px solid #eee' },
  td: { padding: '11px 10px', textAlign: 'left' },
  tdR: { padding: '11px 10px', textAlign: 'right', fontWeight: 'bold', whiteSpace: 'nowrap' },
  tdC: { padding: '11px 10px', textAlign: 'center', color: '#999' },
  detailCell: { backgroundColor: '#fafbfc', padding: '16px', borderBottom: '1px solid #eee' },
  detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', fontSize: '13px', color: '#333' },
  delBtn: { marginTop: '14px', padding: '8px 16px', fontSize: '13px', border: 'none', borderRadius: '4px', backgroundColor: '#dc3545', color: 'white', cursor: 'pointer' },
  loginWrap: { minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' },
  loginBox: { backgroundColor: 'white', padding: '34px', borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', width: '320px', textAlign: 'center' },
  loginTitle: { margin: '0 0 8px' },
  loginDesc: { color: '#666', fontSize: '14px', marginBottom: '18px' },
  loginInput: { width: '100%', padding: '12px', fontSize: '15px', border: '1px solid #ccc', borderRadius: '6px', marginBottom: '12px', boxSizing: 'border-box' },
  loginBtn: { width: '100%', padding: '12px', fontSize: '15px', border: 'none', borderRadius: '6px', backgroundColor: '#2c3e50', color: 'white', cursor: 'pointer', fontWeight: 'bold' },
};
