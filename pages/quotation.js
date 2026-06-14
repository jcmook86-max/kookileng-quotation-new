'use client';
import React, { useState } from 'react';

/*
  국일엠티에스 레이저 견적서
  - 한 페이지에 모든 선택 항목 표시 (종류/사양 1개면 자동 선택)
  - 추가옵션 4종: 집진기, 스크류 컴프레셔(22KW 16K), LANTEK CAM(평판), 솔리드웍스 CAM(파이프)
  - 기본 포함: 설치/시운전/교육 · 2년 무상AS · 1년 부품무상 · CAM 기본(평판 RESTING/파이프 TUBEST) · 산소/질소 비례밸브(SMC) · AVR
*/

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='140'%3E%3Crect width='240' height='140' fill='%23f0f0f0'/%3E%3Ctext x='120' y='75' font-size='14' fill='%23999' text-anchor='middle' font-family='Arial'%3ENo Image%3C/text%3E%3C/svg%3E";

const IMG = {
  flat: '/images/products/flat.jpg', fullcover: '/images/products/fullcover.jpg',
  combo: '/images/products/combo.jpg', pipe: '/images/products/pipe.jpg', gantry: '/images/products/gantry.jpg',
};

const COMPANY = {
  name: '㈜국일엠티에스', bizNo: '875-87-03436', tel: '031-366-5315', fax: '031-366-5316', homepage: 'www.kookilmts.co.kr', address: '경기도 화성시 우정읍 버들로 787 (본사)',
  offices: [
    '본사 : 경기도 화성시 우정읍 버들로 787',
    '시흥사무소 : 경기도 시흥시 오이도로 21, SB동 205호',
    '남부AS센터 : 경상남도 함안군 칠원읍 운무로 217-46 (Tel. 055-586-0315)',
  ],
};

const INCLUDED = [
  '설치 · 시운전 · 교육',
  '2년 무상 A/S · 1년 부품 무상공급',
  'CAM 기본 — 평판전용(RESTING) / 파이프전용(TUBEST)',
  '산소 · 질소 비례밸브 (SMC)',
  'AVR',
];

export default function Quotation() {
  const COMPRESSOR_PRICE = 8500000;
  const LANTEK_PRICE = 8500000;
  const SOLIDWORKS_PRICE = 8500000;
  const BEVEL_PRICE = 40000000;

  const products = [
    { model: 'KI-3015C', image: IMG.flat, area: '3,000 × 1,500 mm', variants: [
        { type: '싱글 평판', specs: [{ kw: 3, price: 52000000, dust: 12000000 }] },
        { type: '더블 평판', specs: [{ kw: 3, price: 65000000, dust: 12000000 }] },
    ] },
    { model: 'KI-4020C', image: IMG.flat, area: '4,000 × 2,000 mm', variants: [
        { type: '싱글 평판', specs: [
          { kw: 3, price: 65000000, dust: 15000000 }, { kw: 6, price: 80000000, dust: 15000000 },
        ] },
        { type: '더블 평판', specs: [{ kw: 3, price: 85000000, dust: 15000000 }] },
    ] },
    { model: 'KI-6020C', image: IMG.flat, area: '6,000 × 2,000 mm', variants: [
        { type: '더블 평판', specs: [{ kw: 3, price: 100000000, dust: 15000000 }] },
    ] },
    { model: 'KI-6025C', image: IMG.flat, area: '6,000 × 2,500 mm', variants: [
        { type: '더블 평판', specs: [{ kw: 6, price: 120000000, dust: 15000000 }] },
    ] },
    { model: 'KI-3015G', image: IMG.fullcover, area: '3,000 × 1,500 mm', variants: [
        { type: '더블 풀카버 평판', specs: [
          { kw: 3, price: 100000000, dust: 15000000 }, { kw: 6, price: 120000000, dust: 15000000 }, { kw: 12, price: 160000000, dust: 15000000 },
        ] },
    ] },
    { model: 'KI-4020G', image: IMG.fullcover, area: '4,000 × 2,000 mm', variants: [
        { type: '더블 풀카버 평판', specs: [
          { kw: 6, price: 140000000, dust: 15000000 }, { kw: 12, price: 170000000, dust: 15000000 }, { kw: 20, price: 200000000, dust: 15000000 },
        ] },
    ] },
    { model: 'KI-6020G', image: IMG.fullcover, area: '6,000 × 2,000 mm', variants: [
        { type: '더블 풀카버 평판', specs: [
          { kw: 6, price: 160000000, dust: 18000000 }, { kw: 12, price: 190000000, dust: 18000000 }, { kw: 20, price: 220000000, dust: 18000000 },
        ] },
    ] },
    { model: 'KI-6025G', image: IMG.fullcover, area: '6,000 × 2,500 mm', variants: [
        { type: '더블 풀카버 평판', specs: [
          { kw: 6, price: 180000000, dust: 30000000 }, { kw: 12, price: 210000000, dust: 30000000 }, { kw: 20, price: 240000000, dust: 30000000 }, { kw: 30, price: 280000000, dust: 30000000 },
        ] },
    ] },
    { model: 'KI-6030G', image: IMG.fullcover, area: '6,000 × 3,000 mm', variants: [
        { type: '더블 풀카버 평판', specs: [
          { kw: 6, price: 200000000, dust: 30000000 }, { kw: 12, price: 230000000, dust: 30000000 }, { kw: 20, price: 260000000, dust: 30000000 }, { kw: 30, price: 300000000, dust: 30000000 },
        ] },
    ] },
    { model: 'KI-3015CR', image: IMG.combo, area: '평판 3,000 × 1,500 mm / 파이프 6,000 × Ø230 mm', variants: [
        { type: '더블평판 복합기', specs: [{ kw: 3, price: 105000000, dust: 15000000 }, { kw: 6, price: 120000000, dust: 15000000 }] },
        { type: '더블평판 복합기 풀카버', specs: [{ kw: 3, price: 125000000, dust: 15000000 }, { kw: 6, price: 140000000, dust: 15000000 }] },
    ] },
    { model: 'KI-4020CR', image: IMG.combo, area: '평판 4,000 × 2,000 mm / 파이프 겸용', variants: [
        { type: '더블평판 복합기', specs: [{ kw: 3, price: 125000000, dust: 15000000 }, { kw: 6, price: 140000000, dust: 15000000 }] },
        { type: '더블평판 복합기 풀카버', specs: [{ kw: 3, price: 145000000, dust: 15000000 }, { kw: 6, price: 160000000, dust: 15000000 }] },
    ] },
    { model: 'KI-60230R', image: IMG.pipe, area: '6,000 mm × Ø230 mm', variants: [
        { type: '파이프 레이저', specs: [{ kw: 3, price: 130000000, dust: 10000000 }, { kw: 6, price: 145000000, dust: 10000000 }] },
    ] },
    { model: 'KI-60230RA', image: IMG.pipe, area: '6,000 mm × Ø230 mm', variants: [
        { type: '파이프 (로딩·언로딩 포함)', specs: [{ kw: 3, price: 165000000, dust: 10000000 }, { kw: 6, price: 180000000, dust: 10000000 }] },
        { type: '파이프 3척', specs: [{ kw: 6, price: 230000000, dust: 10000000 }] },
    ] },
    { model: 'KI-80230RA', image: IMG.pipe, area: '8,000 mm × Ø230 mm', variants: [
        { type: '파이프 3척', specs: [{ kw: 6, price: 260000000, dust: 10000000 }] },
    ] },
    { model: 'KI-10230RA', image: IMG.pipe, area: '10,000 mm × Ø230 mm', variants: [
        { type: '파이프 3척', specs: [{ kw: 6, price: 290000000, dust: 10000000 }] },
    ] },
    { model: 'KI-60120RA', image: IMG.pipe, area: '6,000 mm × Ø120 mm', variants: [
        { type: '파이프 레이저', specs: [{ kw: 3, price: 115000000, dust: 10000000 }] },
    ] },
    { model: 'KI-60160RA', image: IMG.pipe, area: '6,000 mm × Ø160 mm', variants: [
        { type: '파이프 레이저', specs: [{ kw: 3, price: 125000000, dust: 10000000 }] },
    ] },
    { model: 'KI-409A', image: IMG.pipe, area: '파이프 고속절단 (상세 별도 문의)', variants: [
        { type: '고속 파이프 절단기', specs: [{ kw: 3, price: 115000000, dust: 10000000 }] },
    ] },
    { model: 'KI-509A', image: IMG.pipe, area: '파이프 고속절단 (상세 별도 문의)', variants: [
        { type: '고속 파이프 절단기', specs: [{ kw: 3, price: 140000000, dust: 10000000 }] },
    ] },
    { model: 'KI-8025C', image: IMG.gantry, area: '8,000 × 2,500 mm', variants: [
        { type: '겐트리 레이저', specs: [{ kw: 12, price: 165000000, dust: 15000000 }, { kw: 20, price: 195000000, dust: 15000000 }] },
    ] },
    { model: 'KI-8032C', image: IMG.gantry, area: '8,000 × 3,200 mm', variants: [
        { type: '겐트리 레이저', specs: [{ kw: 12, price: 185000000, dust: 15000000 }, { kw: 20, price: 215000000, dust: 15000000 }, { kw: 30, price: 255000000, dust: 15000000 }] },
    ] },
    { model: 'KI-14032LM', image: IMG.gantry, area: '14,000 × 3,200 mm', variants: [
        { type: '겐트리 대형', specs: [
          { kw: 12, price: 210000000, dust: 0 }, { kw: 20, price: 240000000, dust: 0 }, { kw: 30, price: 280000000, dust: 0 },
          { kw: 40, price: 320000000, dust: 0 }, { kw: 50, price: 350000000, dust: 0 }, { kw: 60, price: 380000000, dust: 0 },
        ] },
    ] },
    { model: 'KI-25035LM', image: IMG.gantry, area: '25,000 × 3,500 mm', variants: [
        { type: '겐트리 대형', specs: [
          { kw: 12, price: 280000000, dust: 0 }, { kw: 20, price: 310000000, dust: 0 }, { kw: 30, price: 340000000, dust: 0 },
          { kw: 40, price: 380000000, dust: 0 }, { kw: 50, price: 420000000, dust: 0 }, { kw: 60, price: 460000000, dust: 0 },
        ] },
    ] },
  ];

  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedKw, setSelectedKw] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [options, setOptions] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({ name: '', company: '', email: '', phone: '' });
  const [rep, setRep] = useState({ name: '', phone: '' });
  const [ocrStatus, setOcrStatus] = useState('idle');
  const [ocrText, setOcrText] = useState('');
  const [mailStatus, setMailStatus] = useState('idle');

  const productObj = products.find(p => p.model === selectedModel) || null;
  const variants = productObj ? productObj.variants : [];
  const variantObj = variants.find(v => v.type === selectedType) || null;
  const specs = variantObj ? variantObj.specs : [];
  const specInfo = specs.find(s => s.kw === selectedKw) || null;

  const unitPrice = specInfo ? specInfo.price : 0;
  const optionDefs = [
    { id: 'dust', name: '집진기', price: specInfo ? specInfo.dust : 0 },
    { id: 'comp', name: '스크류 컴프레셔 (22KW 16K)', price: COMPRESSOR_PRICE },
    { id: 'lantek', name: 'LANTEK CAM (평판 전용)', price: LANTEK_PRICE },
    { id: 'solidworks', name: '솔리드웍스 CAM (파이프 전용)', price: SOLIDWORKS_PRICE },
    { id: 'bevel', name: '베벨헤드 3D', price: BEVEL_PRICE },
  ];
  const selectedOptionObjs = options.map(id => optionDefs.find(o => o.id === id)).filter(Boolean);
  const optionsTotal = selectedOptionObjs.reduce((s, o) => s + o.price, 0);
  const total = unitPrice ? (unitPrice + optionsTotal) * quantity : 0;
  const today = new Date().toLocaleDateString('ko-KR');

  // 종류/사양 1개면 자동 선택 → 불필요한 클릭 제거
  const pickModel = (m) => {
    const p = products.find(x => x.model === m);
    setSelectedModel(m); setOptions([]); setQuantity(1);
    if (p && p.variants.length === 1) {
      const v = p.variants[0];
      setSelectedType(v.type);
      setSelectedKw(v.specs.length === 1 ? v.specs[0].kw : null);
    } else { setSelectedType(null); setSelectedKw(null); }
  };
  const pickType = (t) => {
    const v = variants.find(x => x.type === t);
    setSelectedType(t);
    setSelectedKw(v && v.specs.length === 1 ? v.specs[0].kw : null);
  };
  const pickKw = (k) => setSelectedKw(k);
  const toggleOption = (id) => setOptions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };
  const handleRepChange = (e) => {
    const { name, value } = e.target;
    setRep(prev => ({ ...prev, [name]: value }));
  };

  // 명함 OCR (Tesseract.js, CDN 로드 — 브라우저에서 무료 동작)
  const loadTesseract = () => new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.Tesseract) return resolve(window.Tesseract);
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    s.onload = () => resolve(window.Tesseract);
    s.onerror = () => reject(new Error('Tesseract 로드 실패'));
    document.body.appendChild(s);
  });
  const parseCard = (text) => {
    const r = {};
    const email = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
    if (email) r.email = email[0];
    const mobile = text.match(/01[016789][-.\s]?\d{3,4}[-.\s]?\d{4}/);
    const anyPhone = text.match(/0\d{1,2}[-.\s]?\d{3,4}[-.\s]?\d{4}/);
    if (mobile) r.phone = mobile[0].replace(/\s/g, '');
    else if (anyPhone) r.phone = anyPhone[0].replace(/\s/g, '');
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const comp = lines.find(l => /(주식회사|㈜|\(주\)|유한회사|co\.?\s*,?\s*ltd|corp|inc|company|기업|산업|건설|엔지니어링|테크|중공업)/i.test(l));
    if (comp) r.company = comp;
    const name = lines.find(l => /^[가-힣]{2,4}$/.test(l.replace(/\s/g, '')));
    if (name) r.name = name.replace(/\s/g, '');
    return r;
  };
  const handleCardUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    setOcrStatus('loading'); setOcrText('');
    try {
      const T = await loadTesseract();
      const { data: { text } } = await T.recognize(file, 'kor+eng');
      setOcrText(text);
      const parsed = parseCard(text);
      setCustomerInfo(prev => ({ ...prev, ...parsed }));
      setOcrStatus(Object.keys(parsed).length ? 'done' : 'error');
    } catch (err) {
      console.error(err);
      setOcrStatus('error');
    }
  };
  const printQuotation = () => window.print();
  const resetForm = () => {
    setSelectedModel(null); setSelectedType(null); setSelectedKw(null);
    setQuantity(1); setOptions([]); setCustomerInfo({ name: '', company: '', email: '', phone: '' }); setRep({ name: '', phone: '' }); setOcrStatus('idle'); setOcrText('');
  };
  const saveQuotation = () => {
    if (!selectedModel || !selectedType || !selectedKw) { alert('제품 / 종류 / 사양을 선택해주세요!'); return; }
    const data = {
      model: selectedModel, type: selectedType, spec: `${selectedKw}kW`, area: productObj.area,
      unitPrice: unitPrice.toLocaleString(), quantity,
      options: selectedOptionObjs.map(o => o.name), total: total.toLocaleString(),
      customerInfo, rep, createdAt: new Date().toLocaleString('ko-KR'), ts: Date.now(),
    };
    const list = JSON.parse(localStorage.getItem('quotations') || '[]');
    list.push(data); localStorage.setItem('quotations', JSON.stringify(list));
    printQuotation();
  };

  // 메일 보내기 (기본 메일앱 열기 + 내용 자동 채움)
  // 외부 스크립트 동적 로드 (CDN)
  const loadScript = (url) => new Promise((resolve, reject) => {
    if ([...document.scripts].some(s => s.src === url)) return resolve();
    const el = document.createElement('script');
    el.src = url; el.onload = () => resolve(); el.onerror = () => reject(new Error('스크립트 로드 실패'));
    document.body.appendChild(el);
  });

  // 견적서(.print-area)를 PDF File 로 생성
  const generatePdfFile = async () => {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    const el = document.querySelector('.print-area');
    if (!el) throw new Error('견적서 영역을 찾을 수 없습니다');
    const canvas = await window.html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageW = 210, pageH = 297;
    const imgH = canvas.height * pageW / canvas.width;
    if (imgH <= pageH) {
      pdf.addImage(imgData, 'JPEG', 0, 0, pageW, imgH);          // 1페이지에 그대로
    } else {
      const w = canvas.width * pageH / canvas.height;            // 넘치면 1페이지에 맞춰 축소
      pdf.addImage(imgData, 'JPEG', (pageW - w) / 2, 0, w, pageH);
    }
    const blob = pdf.output('blob');
    return new File([blob], `견적서_${selectedModel}_${selectedKw}kW.pdf`, { type: 'application/pdf' });
  };

  // 메일 본문 (회사명·주소·전화·담당자 포함)
  const buildMailBody = () => {
    const lines = [
      `${COMPANY.name} 견적서`,
      `견적일 : ${today}`,
      customerInfo.company ? `업체명 : ${customerInfo.company}` : null,
      customerInfo.name ? `성명 : ${customerInfo.name}` : null,
      '',
      `제품 : ${selectedModel} (${selectedType} · ${selectedKw}kW)`,
      `작업범위 : ${productObj.area}`,
      `제품 단가 : \u20a9${unitPrice.toLocaleString()}`,
      ...selectedOptionObjs.map(o => `+ ${o.name} : ${o.price === 0 ? '별도 문의' : '\u20a9' + o.price.toLocaleString()}`),
      `수량 : ${quantity}대`,
      `총 견적가 (부가세 별도) : \u20a9${total.toLocaleString()}`,
      '',
      '────────────────',
      `${COMPANY.name}`,
      `주소 : ${COMPANY.address}`,
      `Tel. ${COMPANY.tel} / Fax. ${COMPANY.fax}`,
      `홈페이지 : ${COMPANY.homepage}`,
      (rep.name || rep.phone) ? `담당자 : ${rep.name || ''}${rep.phone ? ` (${rep.phone})` : ''}` : null,
    ].filter(l => l !== null && l !== undefined);
    return lines.join('\n');
  };

  // 메일 보내기 (PDF 생성 → 공유/첨부)
  const sendEmail = async () => {
    if (!selectedModel || !selectedType || !selectedKw) { alert('제품 / 종류 / 사양을 선택해주세요!'); return; }
    const to = customerInfo.email || '';
    const subject = `[견적서] ${COMPANY.name} ${selectedModel} ${selectedKw}kW`;
    const body = buildMailBody();
    setMailStatus('pdf');
    try {
      const pdfFile = await generatePdfFile();
      // 모바일 등 파일 공유 지원 → 메일/카톡 앱으로 PDF 첨부 공유
      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        setMailStatus('idle');
        await navigator.share({ files: [pdfFile], title: subject, text: body });
        return;
      }
      // 미지원(주로 PC) → PDF 다운로드 + 메일 본문 열기 (수동 첨부)
      const url = URL.createObjectURL(pdfFile);
      const a = document.createElement('a'); a.href = url; a.download = pdfFile.name; a.click();
      URL.revokeObjectURL(url);
      setMailStatus('idle');
      window.location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body + '\n\n※ 방금 다운로드된 PDF 견적서를 메일에 첨부해 발송해 주세요.')}`;
    } catch (err) {
      console.error(err);
      setMailStatus('idle');
      alert('PDF 생성에 실패해서 본문만 메일로 엽니다. (PDF는 "견적서 저장 및 PDF 출력"으로 만들어 첨부하세요)');
      window.location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          @page { size: A4; margin: 8mm; }
        }
      `}</style>

      {/* ===== 한 페이지 선택 UI (인쇄 안 됨) ===== */}
      <div className="no-print">
        <header style={styles.header}>
          <h1>🔧 국일엠티에스 레이저 견적서</h1>
          <p>산업용 고정밀 레이저 커팅기 견적 자동 생성 · 2026년 기준가</p>
        </header>

        {/* 1. 제품명 */}
        <section style={styles.section}>
          <h2>1️⃣ 제품명(모델)</h2>
          <div style={styles.modelGrid}>
            {products.map(p => (
              <div key={p.model}
                style={{ ...styles.modelCard,
                  border: selectedModel === p.model ? '3px solid #007bff' : '1px solid #ddd',
                  backgroundColor: selectedModel === p.model ? '#f0f8ff' : '#fff' }}
                onClick={() => pickModel(p.model)}>
                <img src={p.image} alt={p.model} style={styles.modelImage}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER; }} />
                <h3 style={styles.modelName}>{p.model}</h3>
                <p style={styles.subText}>종류 {p.variants.length}개</p>
                {selectedModel === p.model && <p style={styles.selected}>✓ 선택됨</p>}
              </div>
            ))}
          </div>
        </section>

        {/* 2. 종류 (항상 표시) */}
        <section style={styles.section}>
          <h2>2️⃣ 종류</h2>
          {!selectedModel ? (
            <p style={styles.hint}>← 먼저 제품(모델)을 선택하세요.</p>
          ) : (
            <div style={styles.optionGrid}>
              {variants.map(v => (
                <div key={v.type}
                  style={{ ...styles.optionCard,
                    border: selectedType === v.type ? '3px solid #28a745' : '1px solid #ddd',
                    backgroundColor: selectedType === v.type ? '#f0fdf4' : '#fff' }}
                  onClick={() => pickType(v.type)}>
                  <h3 style={styles.optionTitle}>{v.type}</h3>
                  <p style={styles.subText}>사양 {v.specs.length}개</p>
                  {selectedType === v.type && <p style={styles.selected}>✓ 선택됨</p>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 3. 사양 (항상 표시) */}
        <section style={styles.section}>
          <h2>3️⃣ 사양(kW)</h2>
          {!selectedType ? (
            <p style={styles.hint}>← 종류를 먼저 선택하세요.</p>
          ) : (
            <div style={styles.specGrid}>
              {specs.map(s => (
                <div key={s.kw}
                  style={{ ...styles.specCard,
                    border: selectedKw === s.kw ? '3px solid #dc3545' : '1px solid #ddd',
                    backgroundColor: selectedKw === s.kw ? '#fff5f5' : '#fff' }}
                  onClick={() => pickKw(s.kw)}>
                  <h3>{s.kw}kW</h3>
                  <p style={styles.specPrice}>₩{s.price.toLocaleString()}</p>
                  {selectedKw === s.kw && <p style={styles.selected}>✓ 선택됨</p>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 4. 수량 (항상 표시) */}
        <section style={styles.section}>
          <h2>4️⃣ 수량</h2>
          <div style={styles.quantityControl}>
            <button style={styles.button} onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
            <input type="number" value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              style={styles.quantityInput} />
            <button style={styles.button} onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
        </section>

        {/* 5. 추가 옵션 (항상 표시) */}
        <section style={styles.section}>
          <h2>5️⃣ 추가 옵션</h2>
          <p style={styles.includedNote}>
            ※ CAM 기본(평판 RESTING/파이프 TUBEST) · 산소/질소 비례밸브(SMC) · 설치/교육/2년AS 등은 기본 포함입니다.
          </p>
          {!specInfo && <p style={styles.hint}>사양 선택 후 집진기 금액이 자동 반영됩니다.</p>}
          <div style={styles.optionsGrid}>
            {optionDefs.map(o => (
              <label key={o.id} style={styles.optionLabel}>
                <input type="checkbox" checked={options.includes(o.id)}
                  onChange={() => toggleOption(o.id)}
                  disabled={o.id === 'dust' && !specInfo} />
                <span>
                  {o.name}{' '}
                  {o.id === 'dust'
                    ? (!specInfo ? '(사양 선택 시 표시)' : (o.price === 0 ? '(별도 문의)' : `(+₩${o.price.toLocaleString()})`))
                    : `(+₩${o.price.toLocaleString()})`}
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* 담당자 정보 (선택) */}
        <section style={styles.section}>
          <h2>🧑‍💼 담당자 정보 <span style={styles.optionalTag}>(선택 — 견적서에 표기됩니다)</span></h2>
          <div style={styles.formGrid}>
            <input type="text" name="name" placeholder="담당자" value={rep.name} onChange={handleRepChange} style={styles.input} />
            <input type="tel" name="phone" placeholder="담당자 휴대폰번호" value={rep.phone} onChange={handleRepChange} style={styles.input} />
          </div>
        </section>

        {/* 고객정보 (항상 표시) */}
        <section style={styles.section}>
          <h2>👤 고객정보 <span style={styles.optionalTag}>(선택 — 입력하면 견적서에 표기됩니다)</span></h2>
          <div style={styles.ocrBox}>
            <label style={styles.ocrBtn}>
              📇 고객 명함 사진으로 자동입력
              <input type="file" accept="image/*" capture="environment" onChange={handleCardUpload} style={{ display: 'none' }} />
            </label>
            {ocrStatus === 'loading' && <span style={styles.ocrStatus}>인식 중… (처음엔 수십 초 걸릴 수 있어요)</span>}
            {ocrStatus === 'done' && <span style={{ ...styles.ocrStatus, color: '#28a745' }}>✓ 인식 완료 — 아래 칸을 꼭 확인·수정하세요</span>}
            {ocrStatus === 'error' && <span style={{ ...styles.ocrStatus, color: '#dc3545' }}>인식이 잘 안 됐어요 — 직접 입력하거나 원문을 참고하세요</span>}
            {ocrText && <details style={styles.ocrDetails}><summary>인식된 원문 보기</summary><pre style={styles.ocrPre}>{ocrText}</pre></details>}
          </div>
          <div style={styles.formGrid}>
            <input type="text" name="company" placeholder="업체명" value={customerInfo.company} onChange={handleCustomerInfoChange} style={styles.input} />
            <input type="text" name="name" placeholder="성명" value={customerInfo.name} onChange={handleCustomerInfoChange} style={styles.input} />
            <input type="email" name="email" placeholder="이메일" value={customerInfo.email} onChange={handleCustomerInfoChange} style={styles.input} />
            <input type="tel" name="phone" placeholder="연락처" value={customerInfo.phone} onChange={handleCustomerInfoChange} style={styles.input} />
          </div>
        </section>
      </div>

      {/* ===== 견적서 양식 (미리보기 + 인쇄) ===== */}
      {specInfo && (
        <div className="print-area" style={styles.sheet}>
          <div style={styles.letterhead}>
            <div>
              <div style={styles.companyName}>{COMPANY.name}</div>
              <div style={styles.companyHomepage}>{COMPANY.homepage}</div>
            </div>
            <div style={styles.letterRight}>
              <div>사업자등록번호 : {COMPANY.bizNo}</div>
              <div>Tel. {COMPANY.tel} / Fax. {COMPANY.fax}</div>
              {(rep.name || rep.phone) && <div style={styles.repLine}>담당자 : {rep.name || '-'}{rep.phone ? ` (${rep.phone})` : ''}</div>}
            </div>
          </div>

          <div style={styles.quoteTitle}>견 적 서</div>

          <table style={styles.metaTable}><tbody>
            <tr>
              <th style={styles.metaTh}>견적일</th><td style={styles.metaTd}>{today}</td>
              <th style={styles.metaTh}>업체명</th><td style={styles.metaTd}>{customerInfo.company || '-'}</td>
            </tr>
            <tr>
              <th style={styles.metaTh}>성명</th><td style={styles.metaTd}>{customerInfo.name || '-'}</td>
              <th style={styles.metaTh}>연락처</th><td style={styles.metaTd}>{customerInfo.phone || '-'}</td>
            </tr>
            <tr>
              <th style={styles.metaTh}>이메일</th><td style={styles.metaTd} colSpan={3}>{customerInfo.email || '-'}</td>
            </tr>
          </tbody></table>

          <div style={styles.prodTop}>
            <img src={productObj.image} alt={selectedModel} style={styles.prodImage}
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER; }} />
            <div>
              <div style={styles.prodModel}>{selectedModel}</div>
              <div style={styles.prodSpec}>{selectedType} · {selectedKw}kW</div>
              <div style={styles.prodArea}>작업범위 : {productObj.area}</div>
            </div>
          </div>

          <table style={styles.priceTable}><tbody>
            <tr><th style={styles.pTh}>항목</th><th style={{ ...styles.pTh, textAlign: 'right' }}>금액</th></tr>
            <tr><td style={styles.pTd}>제품 단가 ({selectedModel} {selectedKw}kW)</td><td style={styles.pTdR}>₩{unitPrice.toLocaleString()}</td></tr>
            {selectedOptionObjs.map(o => (
              <tr key={o.id}><td style={styles.pTd}>+ {o.name}</td><td style={styles.pTdR}>{o.price === 0 ? '별도 문의' : `₩${o.price.toLocaleString()}`}</td></tr>
            ))}
            <tr><td style={styles.pTd}>1대 합계</td><td style={styles.pTdR}>₩{(unitPrice + optionsTotal).toLocaleString()}</td></tr>
            <tr><td style={styles.pTd}>수량</td><td style={styles.pTdR}>{quantity}대</td></tr>
            <tr><td style={styles.pTotalTd}>총 견적가 (부가세 별도)</td><td style={styles.pTotalTdR}>₩{total.toLocaleString()}</td></tr>
          </tbody></table>

          <div style={styles.incBox}>
            <div style={styles.incTitle}>✔ 기본 포함 품목</div>
            <ul style={styles.incList}>{INCLUDED.map((it, i) => <li key={i} style={styles.incItem}>{it}</li>)}</ul>
          </div>

          <p style={styles.sheetNote}>※ 부가세 별도 / 베벨헤드 노즐·렌즈 등 소모품 별도 / 집진기 '별도 문의' 항목은 협의 후 금액 확정 / 견적 유효기간 30일</p>

          <div style={styles.footer}>
            {COMPANY.offices.map((o, i) => <div key={i}>{o}</div>)}
            <div>Tel. {COMPANY.tel} / Fax. {COMPANY.fax} / {COMPANY.homepage}</div>
          </div>
        </div>
      )}

      <div className="no-print" style={styles.buttonGroup}>
        <button style={styles.saveButton} onClick={saveQuotation}>💾 견적서 저장 및 PDF 출력</button>
        <button style={styles.mailButton} onClick={sendEmail} disabled={mailStatus === 'pdf'}>
          {mailStatus === 'pdf' ? '⏳ PDF 만드는 중…' : '📧 메일 보내기 (PDF 첨부)'}
        </button>
        <button style={styles.resetButton} onClick={resetForm}>🔄 초기화</button>
      </div>
      <p className="no-print" style={styles.mailHint}>
        📱 휴대폰: PDF가 바로 메일·카톡에 첨부돼요. &nbsp;|&nbsp; 💻 PC: PDF가 다운로드되니 메일 창에 직접 첨부하세요.
      </p>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', color: '#1f2937' },
  header: { textAlign: 'center', marginBottom: '30px', padding: '30px', backgroundColor: '#007bff', color: 'white', borderRadius: '8px' },
  section: { marginBottom: '24px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  hint: { color: '#999', fontSize: '14px', marginTop: '12px', fontStyle: 'italic' },
  modelGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginTop: '15px' },
  modelCard: { padding: '12px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' },
  modelImage: { width: '100%', height: '90px', objectFit: 'contain', borderRadius: '4px', marginBottom: '8px', backgroundColor: '#fafafa' },
  modelName: { fontSize: '15px', fontWeight: 'bold', color: '#1f2937' },
  optionGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '15px' },
  optionCard: { padding: '15px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' },
  optionTitle: { fontSize: '15px', fontWeight: 'bold', color: '#1f2937' },
  specGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginTop: '15px' },
  specCard: { padding: '15px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' },
  specPrice: { color: '#dc3545', fontSize: '15px', fontWeight: 'bold', marginTop: '8px' },
  subText: { color: '#666', fontSize: '13px', marginTop: '8px' },
  selected: { color: '#28a745', fontWeight: 'bold', marginTop: '8px' },
  quantityControl: { display: 'flex', gap: '10px', alignItems: 'center', marginTop: '15px' },
  quantityInput: { width: '100px', padding: '10px', fontSize: '16px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '4px' },
  button: { padding: '10px 20px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  includedNote: { color: '#28a745', fontSize: '13px', marginTop: '10px', lineHeight: 1.6 },
  optionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginTop: '12px' },
  optionLabel: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', color: '#1f2937' },
  optionalTag: { fontSize: '13px', fontWeight: 'normal', color: '#888' },
  ocrBox: { marginBottom: '14px' },
  ocrBtn: { display: 'inline-block', padding: '10px 16px', backgroundColor: '#17a2b8', color: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  ocrStatus: { marginLeft: '12px', fontSize: '13px', color: '#555' },
  ocrDetails: { marginTop: '10px', fontSize: '12px', color: '#666' },
  ocrPre: { whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', maxHeight: '160px', overflow: 'auto' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' },
  input: { padding: '12px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '4px' },
  buttonGroup: { display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px', marginBottom: '40px', flexWrap: 'wrap' },
  saveButton: { padding: '15px 30px', fontSize: '16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  mailButton: { padding: '15px 30px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  mailHint: { textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '-26px', marginBottom: '40px' },
  resetButton: { padding: '15px 30px', fontSize: '16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  sheet: { maxWidth: '820px', margin: '30px auto', backgroundColor: 'white', padding: '24px 30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', color: '#222', fontSize: '13px' },
  letterhead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #c0392b', paddingBottom: '8px' },
  companyName: { fontSize: '19px', fontWeight: 'bold', color: '#111' },
  companyHomepage: { fontSize: '12px', color: '#777', marginTop: '4px' },
  letterRight: { textAlign: 'right', fontSize: '12px', color: '#555', lineHeight: 1.7 },
  repLine: { marginTop: '4px', fontWeight: 'bold', color: '#333' },
  quoteTitle: { textAlign: 'center', fontSize: '22px', fontWeight: 'bold', letterSpacing: '8px', margin: '12px 0 10px', color: '#111' },
  metaTable: { width: '100%', borderCollapse: 'collapse', marginBottom: '10px' },
  metaTh: { border: '1px solid #d8dde2', backgroundColor: '#f4f6f8', padding: '4px 8px', textAlign: 'left', width: '72px', fontWeight: 'bold', fontSize: '11.5px', color: '#555' },
  metaTd: { border: '1px solid #d8dde2', padding: '4px 8px', fontSize: '11.5px' },
  prodTop: { display: 'flex', gap: '20px', alignItems: 'center', margin: '4px 0 12px', flexWrap: 'wrap' },
  prodImage: { width: '330px', maxWidth: '100%', height: 'auto', objectFit: 'contain', border: '1px solid #eee', borderRadius: '6px', backgroundColor: '#fafafa', flexShrink: 0 },
  prodModel: { fontSize: '23px', fontWeight: 'bold' },
  prodSpec: { fontSize: '14px', color: '#666', marginTop: '4px' },
  prodArea: { fontSize: '13px', color: '#333', marginTop: '6px', fontWeight: 'bold' },
  priceTable: { width: '100%', borderCollapse: 'collapse' },
  pTh: { border: '1px solid #ccc', backgroundColor: '#34495e', color: 'white', padding: '7px 10px', textAlign: 'left', fontSize: '13px' },
  pTd: { border: '1px solid #ccc', padding: '7px 10px', fontSize: '13px' },
  pTdR: { border: '1px solid #ccc', padding: '7px 10px', fontSize: '13px', textAlign: 'right' },
  pTotalTd: { border: '1px solid #ccc', padding: '9px 10px', fontSize: '15px', fontWeight: 'bold', backgroundColor: '#eaf2fb' },
  pTotalTdR: { border: '1px solid #ccc', padding: '9px 10px', fontSize: '16px', fontWeight: 'bold', textAlign: 'right', backgroundColor: '#eaf2fb', color: '#c0392b' },
  incBox: { marginTop: '12px', padding: '10px 14px', backgroundColor: '#f4f9f4', border: '1px solid #cfe8cf', borderRadius: '6px' },
  incTitle: { fontWeight: 'bold', color: '#1e7e34', marginBottom: '5px', fontSize: '13px' },
  incList: { margin: 0, paddingLeft: '18px' },
  incItem: { fontSize: '12px', color: '#333', lineHeight: 1.45 },
  sheetNote: { fontSize: '10px', color: '#888', marginTop: '8px', lineHeight: 1.5 },
  footer: { marginTop: '12px', borderTop: '1px solid #ddd', paddingTop: '8px', fontSize: '10px', color: '#666', lineHeight: 1.55 },
};
