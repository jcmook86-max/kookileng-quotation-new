'use client';
import React, { useState, useEffect } from 'react';

// ⚠️ 임시 관리자 비밀번호 — 원하는 값으로 바꾸세요. (코드에 들어있어서 강력한 보안은 아님 / 진짜 로그인은 Step 3)
const ADMIN_PW = 'kookil1234';

const won = (s) => (s == null ? '-' : '₩' + s);

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('new'); // new | company | rep
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
    setOpenIdx(null);
    load();
  };

  const clearAll = () => {
    if (!window.confirm('저장된 견적을 전부 삭제할까요? (되돌릴 수 없음)')) return;
    localStorage.setItem('quotations', JSON.stringify([]));
    load();
  };

  // 로그인 화면
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

  // 원본 인덱스 보존 → 필터/정렬
  let rows = quotes.map((q, i) => ({ ...q, _i: i }));
  if (search.trim()) {
    const s = search.trim().toLowerCase();
    rows = rows.filter(q =>
      (q.customerInfo?.company || '').toLowerCase().includes(s) ||
      (q.rep?.name || '').toLowerCase().includes(s) ||
      (q.model || '').toLowerCase().includes(s)
    );
  }
  if (sort === 'new') rows = rows.reverse();
  else if (sort === 'company') rows.sort((a, b) => (a.customerInfo?.company || '').localeCompare(b.customerInfo?.company || ''));
  else if (sort === 'rep') rows.sort((a, b) => (a.rep?.name || '').localeCompare(b.rep?.name || ''));

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>📋 견적 관리자</h1>
        <p>저장된 견적 {quotes.length}건 · 날짜 / 업체명 / 담당자별 조회</p>
      </header>

      <div style={styles.notice}>
        ※ 이 목록은 <b>이 브라우저에 저장된 견적</b>만 보여줍니다. 다른 기기에서 저장한 건 보이지 않아요. (전사 통합 조회는 DB 연동 후 가능)
      </div>

      <div style={styles.controls}>
        <input type="text" value={search} placeholder="업체명 · 담당자 · 모델 검색"
          onChange={e => setSearch(e.target.value)} style={styles.searchInput} />
        <select value={sort} onChange={e => setSort(e.target.value)} style={styles.select}>
          <option value="new">최신순</option>
          <option value="company">업체명순</option>
          <option value="rep">담당자순</option>
        </select>
        <button style={styles.refreshBtn} onClick={load}>↻ 새로고침</button>
        <button style={styles.clearBtn} onClick={clearAll}>전체 삭제</button>
      </div>

      {rows.length === 0 ? (
        <div style={styles.empty}>저장된 견적이 없습니다. (견적 페이지에서 "견적서 저장"을 하면 여기 쌓여요)</div>
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
                <tr style={styles.row} onClick={() => setOpenIdx(openIdx === q._i ? null : q._i)}>
                  <td style={styles.td}>{q.createdAt || '-'}</td>
                  <td style={styles.td}>{q.customerInfo?.company || '-'}</td>
                  <td style={styles.td}>{q.rep?.name || '-'}{q.rep?.phone ? ` (${q.rep.phone})` : ''}</td>
                  <td style={styles.td}>{q.model} {q.spec}</td>
                  <td style={styles.tdR}>{won(q.total)}</td>
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
                        <div><b>제품 단가</b> : {won(q.unitPrice)}</div>
                        <div><b>수량</b> : {q.quantity}대</div>
                        <div><b>옵션</b> : {(q.options && q.options.length) ? q.options.join(', ') : '없음'}</div>
                        <div><b>총 견적가</b> : {won(q.total)}</div>
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
  controls: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px', alignItems: 'center' },
  searchInput: { flex: 1, minWidth: '200px', padding: '10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' },
  select: { padding: '10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' },
  refreshBtn: { padding: '10px 14px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer' },
  clearBtn: { padding: '10px 14px', fontSize: '14px', border: 'none', borderRadius: '4px', backgroundColor: '#dc3545', color: 'white', cursor: 'pointer' },
  empty: { padding: '40px', textAlign: 'center', color: '#999', backgroundColor: 'white', borderRadius: '8px' },
  tableWrap: { overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  th: { borderBottom: '2px solid #e0e0e0', padding: '12px 10px', textAlign: 'left', backgroundColor: '#f4f6f8', fontWeight: 'bold', whiteSpace: 'nowrap' },
  thR: { borderBottom: '2px solid #e0e0e0', padding: '12px 10px', textAlign: 'right', backgroundColor: '#f4f6f8', fontWeight: 'bold', whiteSpace: 'nowrap' },
  row: { cursor: 'pointer', borderBottom: '1px solid #eee' },
  td: { padding: '12px 10px', textAlign: 'left' },
  tdR: { padding: '12px 10px', textAlign: 'right', fontWeight: 'bold', whiteSpace: 'nowrap' },
  tdC: { padding: '12px 10px', textAlign: 'center', color: '#999' },
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
