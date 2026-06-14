'use client';
import React, { useState } from 'react';

/*
  국일엠티에스 도장·방수 공사 견적 계산기 (/paint)
  - 카테고리: 재도장 / 우레탄 / 복합시트 / 에폭시 / 주차라인 / 특화도장 / 금속기와
  - 각 카테고리 = 자재비 + 인건비
  - 자재비 = 수량 × 소요량 × 재료단가  (재료단가 입력, 아는 값은 기본값으로 채움)
  - 인건비 = 수량 × 단가              (단가 고정, 범위 있는 건 수정 가능)
*/

// material: { id, name, unit, rate(소요량), priceUnit, price?(아는 재료단가), note? }
// labor:    { id, name, unit, price(원), editable?(범위), note? }
const DATA = [
  {
    id: 'repaint', name: '재도장 공사',
    material: [
      { id: 're-m1', name: '외부 수성 (계단식)', unit: '세대', rate: 0.5, priceUnit: '원/말', note: '타워 0.7' },
      { id: 're-m2', name: '외부 수성 (복도식)', unit: '세대', rate: 0.35, priceUnit: '원/말' },
      { id: 're-m3', name: '내부 수성 (계단식)', unit: '층', rate: 0.3, priceUnit: '원/말', note: '타워 0.5 / 세대 0.15' },
      { id: 're-m4', name: '내부 수성 (복도식)', unit: '세대', rate: 0.2, priceUnit: '원/말' },
      { id: 're-m5', name: '무늬코트 (계단식·E/L홀)', unit: '층', rate: 0.24, priceUnit: '원/말', note: '세대 0.12' },
      { id: 're-m6', name: '무늬코트 상도', unit: '층', rate: 0.12, priceUnit: '원/말', note: '무늬코트의 1/2' },
      { id: 're-m7', name: '걸레받이', unit: '세대', rate: 0.03, priceUnit: '원/말', note: '층수 45층에 1말' },
      { id: 're-m8', name: '에나멜', unit: '세대', rate: 0.02, priceUnit: '원/말', note: '문짝 40문짝에 1말' },
      { id: 're-m9', name: '오일스테인', unit: '정자(개)', rate: 0.08, priceUnit: '원/말' },
      { id: 're-m10', name: '수성퍼티', unit: '세대', rate: 0.065, priceUnit: '원/말', note: '0.05~0.08말' },
      { id: 're-m11', name: '탄성퍼티', unit: '세대', rate: 0.04, priceUnit: '원/말', note: '0.03~0.05말' },
      { id: 're-m12', name: '바인더 (올바인더)', unit: '말(수성물량)', rate: 0.05, priceUnit: '원/말', note: '수성 물량의 5% — 수성 총 말수를 수량에 입력' },
    ],
    labor: [
      { id: 're-l1', name: '외부인건비 (수성1급)', unit: '관리평수', price: 4100, note: '바인더 +400원' },
      { id: 're-l2', name: '외부인건비 (수성2급)', unit: '관리평수', price: 4300 },
      { id: 're-l3', name: '내부 계단실', unit: '층', price: 180000, note: '세대당 최대 9.5만원' },
      { id: 're-l4', name: '내부 복도식', unit: '세대', price: 50000, editable: true, note: '세대당 5만~8.5만원' },
      { id: 're-l5', name: '외벽그래픽', unit: '동', price: 400000, editable: true, note: '35~45만원 / 기존라인 유지' },
      { id: 're-l6', name: '고압물청소', unit: '관리평수', price: 450, note: '고층 +50원' },
      { id: 're-l7', name: '유리창물청소', unit: '관리평수', price: 350 },
      { id: 're-l8', name: '부대시설', unit: '관리평수', price: 375, editable: true, note: '350~400원' },
      { id: 're-l9', name: '담장', unit: '식', price: 1500000, editable: true, note: '150만원 내외 / 1km 미만' },
      { id: 're-l10', name: '공용창코킹 (라인당)', unit: '라인', price: 250000, note: '15층 기준' },
      { id: 're-l11', name: '공용창코킹 (M당)', unit: 'M', price: 2000 },
      { id: 're-l12', name: '주차장 램프', unit: '개소', price: 1500000, note: '20m 내외' },
      { id: 're-l13', name: '주차장 벽체·기둥', unit: '대', price: 50000 },
      { id: 're-l14', name: '스카이장비', unit: '대', price: 700000, note: '4.5ton(45m)' },
    ],
  },
  {
    id: 'urethane', name: '우레탄 공사',
    material: [
      { id: 'ur-m1', name: '프라이머(하도) 바닥', unit: 'm²', rate: 0.2, priceUnit: '원/kg', note: '생바닥 최소 3배' },
      { id: 'ur-m2', name: '중도 바닥 (3mm)', unit: 'm²', rate: 3.6, priceUnit: '원/kg' },
      { id: 'ur-m3', name: '상도 바닥', unit: 'm²', rate: 0.18, priceUnit: '원/LT' },
      { id: 'ur-m4', name: '프라이머(하도) 벽체', unit: 'm²', rate: 0.15, priceUnit: '원/kg' },
      { id: 'ur-m5', name: '중도 벽체 (0.5mm)', unit: 'm²', rate: 0.6, priceUnit: '원/kg' },
      { id: 'ur-m6', name: '상도 벽체', unit: 'm²', rate: 0.15, priceUnit: '원/LT' },
      { id: 'ur-m7', name: '우레탄 신나', unit: 'LT(중상도)', rate: 0.1, priceUnit: '원/LT', note: '중상도 물량의 10%' },
      { id: 'ur-m8', name: '퍼티', unit: 'm²', rate: 0.05, priceUnit: '원/kg' },
    ],
    labor: [
      { id: 'ur-l1', name: '우레탄 시공 (3mm)', unit: 'm²', price: 9000, note: '박공 동당 250' },
      { id: 'ur-l2', name: '바닥면 처리 (전면철거)', unit: 'm²', price: 2500 },
      { id: 'ur-l3', name: '바닥면 처리 (부분철거)', unit: 'm²', price: 4000 },
      { id: 'ur-l4', name: '세대 공사 (3mm)', unit: '세대', price: 700000 },
    ],
  },
  {
    id: 'sheet', name: '복합시트(리가)',
    material: [
      { id: 'sh-m1', name: '하도 (16kg)', unit: 'm²', rate: 0.08, priceUnit: '원/kg', price: 4375 },
      { id: 'sh-m2', name: '중도 (20kg)', unit: 'm²', rate: 1.40, priceUnit: '원/kg', price: 4700 },
      { id: 'sh-m3', name: '상도 (18L)', unit: 'm²', rate: 0.18, priceUnit: '원/LT', price: 6666 },
      { id: 'sh-m4', name: '시트 (1롤 90m²)', unit: 'm²', rate: 1, priceUnit: '원/m²', price: 1500 },
    ],
    labor: [
      { id: 'sh-l1', name: '아스팔트싱글 (배수로·옥탑 포함)', unit: 'm²', price: 28000, note: '싱글수리 별도' },
      { id: 'sh-l2', name: '평슬라브 (옥탑포함)', unit: 'm²', price: 28000, note: '바탕정리 별도' },
      { id: 'sh-l3', name: '금속기와 (배수로·옥탑 포함)', unit: 'm²', price: 37000, note: '윗글수리 별도' },
      { id: 'sh-l4', name: '옥상 외부 파라펫', unit: 'm²', price: 35000, note: '윗글수리 별도' },
      { id: 'sh-l5', name: '배수로만 시공 (박공형)', unit: 'm²', price: 28000, note: '바탕정리 별도' },
      { id: 'sh-l6', name: '현관 캐노피', unit: 'm²', price: 28000 },
      { id: 'sh-l7', name: '옥탑', unit: 'm²', price: 30000 },
    ],
  },
  {
    id: 'epoxy', name: '에폭시 공사',
    material: [
      { id: 'ep-m1', name: '프라이머(하도)', unit: 'm²', rate: 0.15, priceUnit: '원/LT', note: '생바닥 최소 2배' },
      { id: 'ep-m2', name: '중상도 (라이닝 1mm)', unit: 'm²', rate: 1.2, priceUnit: '원/kg' },
      { id: 'ep-m3', name: '상도 2회 (코팅)', unit: 'm²', rate: 0.3, priceUnit: '원/LT' },
      { id: 'ep-m4', name: '엠보', unit: 'm²', rate: 0.6, priceUnit: '원/kg' },
      { id: 'ep-m5', name: '논슬립', unit: '100m²', rate: 0.6, priceUnit: '원/kg', note: '100m²당 1포(600g) / 1BOX 10개입' },
      { id: 'ep-m6', name: '에폭시 신나', unit: 'LT(중상도)', rate: 0.1, priceUnit: '원/LT', note: '중상도 물량의 10%' },
      { id: 'ep-m7', name: '퍼티', unit: 'm²', rate: 0.04, priceUnit: '원/kg' },
    ],
    labor: [
      { id: 'ep-l1', name: '에폭시 라이닝 (2mm)', unit: 'm²', price: 3500, editable: true, note: '수도권 최대 4,500원 / 지방경비 별도' },
      { id: 'ep-l2', name: '에폭시 라이닝 (1mm)', unit: 'm²', price: 2700 },
      { id: 'ep-l3', name: '에폭시 코팅 (0.5mm)', unit: 'm²', price: 1000 },
      { id: 'ep-l4', name: '에폭시 코팅 (코팅 2회)', unit: 'm²', price: 1700 },
    ],
  },
  {
    id: 'parkline', name: '주차라인',
    material: [],
    labor: [
      { id: 'pk-l1', name: '차선도장 (상온식)', unit: '대', price: 8000 },
      { id: 'pk-l2', name: '차선도장 (융착식)', unit: '대', price: 14000, note: '융착식' },
      { id: 'pk-l3', name: '소방차', unit: 'EA', price: 200000, note: '융착식' },
      { id: 'pk-l4', name: '노견선', unit: 'M', price: 13000, note: '융착식' },
      { id: 'pk-l5', name: '방지턱', unit: '개(30m² 기준)', price: 430000, note: '융착식' },
      { id: 'pk-l6', name: '방향지시선', unit: 'EA', price: 25000, note: '융착식' },
    ],
  },
  {
    id: 'special', name: '특화도장',
    material: [],
    labor: [
      { id: 'sp-l1', name: '노블스톤 (중상도)', unit: 'm²', price: 18500, editable: true, note: '17,000~20,000원' },
      { id: 'sp-l2', name: '폴리우레아 (중상도)', unit: 'm²', price: 38000 },
    ],
  },
  {
    id: 'metaltile', name: '금속기와',
    material: [
      { id: 'mt-m1', name: '자재비 (다루끼 제외)', unit: 'm²', rate: 1, priceUnit: '원/m²', price: 18000, note: '420mm×1,340mm / 2026년 기준' },
    ],
    labor: [
      { id: 'mt-l1', name: '노무비 (다루끼 제외)', unit: 'm²', price: 15000 },
    ],
  },
];

const won = (n) => '₩' + Math.round(n || 0).toLocaleString();

export default function Paint() {
  const [catId, setCatId] = useState('repaint');
  const [qty, setQty] = useState({});      // { itemId: number }
  const [price, setPrice] = useState({});  // 재료단가 / 수정가능 단가 { itemId: number }

  const cat = DATA.find(c => c.id === catId);

  const setQtyFor = (id, v) => setQty(p => ({ ...p, [id]: v === '' ? '' : Math.max(0, parseFloat(v) || 0) }));
  const setPriceFor = (id, v) => setPrice(p => ({ ...p, [id]: v === '' ? '' : Math.max(0, parseFloat(v) || 0) }));

  // 자재비 항목 금액 = 수량 × 소요량 × 재료단가
  const matCost = (it) => {
    const q = parseFloat(qty[it.id]) || 0;
    const p = price[it.id] !== undefined && price[it.id] !== '' ? parseFloat(price[it.id]) : (it.price || 0);
    return q * it.rate * p;
  };
  // 인건비 항목 금액 = 수량 × 단가
  const laborCost = (it) => {
    const q = parseFloat(qty[it.id]) || 0;
    const p = it.editable && price[it.id] !== undefined && price[it.id] !== '' ? parseFloat(price[it.id]) : it.price;
    return q * p;
  };

  const matTotal = cat.material.reduce((s, it) => s + matCost(it), 0);
  const laborTotal = cat.labor.reduce((s, it) => s + laborCost(it), 0);
  const grand = matTotal + laborTotal;

  const reset = () => { setQty({}); setPrice({}); };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🎨 국일엠티에스 도장·방수 공사 견적</h1>
        <p>카테고리 선택 → 자재비·인건비 수량 입력 → 금액 자동 계산</p>
      </header>

      {/* 카테고리 */}
      <div style={styles.tabs}>
        {DATA.map(c => (
          <button key={c.id} onClick={() => setCatId(c.id)}
            style={{ ...styles.tab, ...(catId === c.id ? styles.tabActive : {}) }}>
            {c.name}
          </button>
        ))}
      </div>

      {/* 자재비 */}
      {cat.material.length > 0 && (
        <section style={styles.section}>
          <div style={styles.sectionHead}>📦 자재비 <span style={styles.formulaTag}>금액 = 수량 × 소요량 × 재료단가</span></div>
          <div style={styles.tableWrap}>
            <table style={styles.table}><tbody>
              <tr>
                <th style={styles.thL}>품목</th>
                <th style={styles.th}>단위</th>
                <th style={styles.th}>소요량</th>
                <th style={styles.th}>수량</th>
                <th style={styles.th}>재료단가</th>
                <th style={styles.thR}>금액</th>
              </tr>
              {cat.material.map(it => (
                <tr key={it.id}>
                  <td style={styles.tdL}>
                    {it.name}
                    {it.note && <div style={styles.note}>{it.note}</div>}
                  </td>
                  <td style={styles.td}>{it.unit}</td>
                  <td style={styles.td}>{it.rate}</td>
                  <td style={styles.td}>
                    <input type="number" value={qty[it.id] ?? ''} placeholder="0"
                      onChange={e => setQtyFor(it.id, e.target.value)} style={styles.qtyInput} />
                  </td>
                  <td style={styles.td}>
                    <input type="number" value={price[it.id] ?? (it.price ?? '')} placeholder="0"
                      onChange={e => setPriceFor(it.id, e.target.value)} style={styles.priceInput} />
                    <div style={styles.unitHint}>{it.priceUnit}</div>
                  </td>
                  <td style={styles.tdR}>{won(matCost(it))}</td>
                </tr>
              ))}
              <tr>
                <td style={styles.subTotalTd} colSpan={5}>자재비 소계</td>
                <td style={styles.subTotalTdR}>{won(matTotal)}</td>
              </tr>
            </tbody></table>
          </div>
        </section>
      )}

      {/* 인건비 */}
      {cat.labor.length > 0 && (
        <section style={styles.section}>
          <div style={styles.sectionHead}>👷 인건비 <span style={styles.formulaTag}>금액 = 수량 × 단가</span></div>
          <div style={styles.tableWrap}>
            <table style={styles.table}><tbody>
              <tr>
                <th style={styles.thL}>공정명</th>
                <th style={styles.th}>단위</th>
                <th style={styles.th}>수량</th>
                <th style={styles.th}>단가</th>
                <th style={styles.thR}>금액</th>
              </tr>
              {cat.labor.map(it => (
                <tr key={it.id}>
                  <td style={styles.tdL}>
                    {it.name}
                    {it.note && <div style={styles.note}>{it.note}</div>}
                  </td>
                  <td style={styles.td}>{it.unit}</td>
                  <td style={styles.td}>
                    <input type="number" value={qty[it.id] ?? ''} placeholder="0"
                      onChange={e => setQtyFor(it.id, e.target.value)} style={styles.qtyInput} />
                  </td>
                  <td style={styles.td}>
                    {it.editable ? (
                      <input type="number" value={price[it.id] ?? it.price} placeholder="0"
                        onChange={e => setPriceFor(it.id, e.target.value)} style={styles.priceInput} />
                    ) : (
                      <span>{won(it.price)}</span>
                    )}
                  </td>
                  <td style={styles.tdR}>{won(laborCost(it))}</td>
                </tr>
              ))}
              <tr>
                <td style={styles.subTotalTd} colSpan={4}>인건비 소계</td>
                <td style={styles.subTotalTdR}>{won(laborTotal)}</td>
              </tr>
            </tbody></table>
          </div>
        </section>
      )}

      {/* 총합 */}
      <div style={styles.grandBox}>
        <div style={styles.grandRow}><span>자재비 소계</span><span>{won(matTotal)}</span></div>
        <div style={styles.grandRow}><span>인건비 소계</span><span>{won(laborTotal)}</span></div>
        <div style={styles.grandTotal}><strong>{cat.name} 합계 (부가세 별도)</strong><strong>{won(grand)}</strong></div>
      </div>

      <div style={styles.btnRow}>
        <button style={styles.resetBtn} onClick={reset}>🔄 입력 초기화</button>
      </div>
      <p style={styles.footNote}>※ 자재비의 재료단가는 현재 자재 시세를 입력하세요. 소요량은 표 기준값이며 현장 상황에 따라 달라질 수 있습니다. / 부가세 별도.</p>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', color: '#1f2937' },
  header: { textAlign: 'center', marginBottom: '20px', padding: '26px', backgroundColor: '#2c3e50', color: 'white', borderRadius: '8px' },
  tabs: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' },
  tab: { padding: '10px 16px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '20px', backgroundColor: '#fff', cursor: 'pointer', fontWeight: 'bold', color: '#555' },
  tabActive: { backgroundColor: '#2c3e50', color: '#fff', borderColor: '#2c3e50' },
  section: { marginBottom: '20px', padding: '16px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' },
  sectionHead: { fontSize: '17px', fontWeight: 'bold', marginBottom: '10px' },
  formulaTag: { fontSize: '12px', fontWeight: 'normal', color: '#888', marginLeft: '8px' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: { border: '1px solid #ddd', backgroundColor: '#f4f6f8', padding: '8px', textAlign: 'center', fontWeight: 'bold', whiteSpace: 'nowrap' },
  thL: { border: '1px solid #ddd', backgroundColor: '#f4f6f8', padding: '8px', textAlign: 'left', fontWeight: 'bold' },
  thR: { border: '1px solid #ddd', backgroundColor: '#f4f6f8', padding: '8px', textAlign: 'right', fontWeight: 'bold' },
  td: { border: '1px solid #eee', padding: '6px 8px', textAlign: 'center', verticalAlign: 'top' },
  tdL: { border: '1px solid #eee', padding: '6px 8px', textAlign: 'left' },
  tdR: { border: '1px solid #eee', padding: '6px 8px', textAlign: 'right', fontWeight: 'bold', whiteSpace: 'nowrap' },
  note: { fontSize: '11px', color: '#999', marginTop: '2px' },
  qtyInput: { width: '70px', padding: '6px', fontSize: '13px', textAlign: 'right', border: '1px solid #ccc', borderRadius: '4px' },
  priceInput: { width: '90px', padding: '6px', fontSize: '13px', textAlign: 'right', border: '1px solid #ccc', borderRadius: '4px' },
  unitHint: { fontSize: '10px', color: '#aaa', marginTop: '2px' },
  subTotalTd: { border: '1px solid #ddd', padding: '8px', textAlign: 'right', fontWeight: 'bold', backgroundColor: '#fafafa' },
  subTotalTdR: { border: '1px solid #ddd', padding: '8px', textAlign: 'right', fontWeight: 'bold', backgroundColor: '#fafafa', whiteSpace: 'nowrap' },
  grandBox: { backgroundColor: 'white', borderRadius: '8px', padding: '18px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' },
  grandRow: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px', color: '#555' },
  grandTotal: { display: 'flex', justifyContent: 'space-between', padding: '14px', marginTop: '8px', backgroundColor: '#2c3e50', color: 'white', borderRadius: '6px', fontSize: '18px' },
  btnRow: { display: 'flex', justifyContent: 'center', marginTop: '16px' },
  resetBtn: { padding: '12px 26px', fontSize: '15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  footNote: { fontSize: '12px', color: '#999', marginTop: '14px', textAlign: 'center', lineHeight: 1.6 },
};
