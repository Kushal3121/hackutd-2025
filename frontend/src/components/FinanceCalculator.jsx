import { useEffect, useMemo, useRef, useState } from 'react';
import { calcFinance } from '../services/api';
import Select from 'react-select';

const DEFAULT_TERMS = [36, 48, 60, 72];
const DEFAULT_TAX_RATES = [
  { code: 'US-AVG', name: 'US Avg', rate: 0.075 },
  { code: 'CA-AVG', name: 'Canada Avg', rate: 0.13 },
  { code: 'EU-AVG', name: 'EU Avg', rate: 0.20 },
];

export default function FinanceCalculator({ car, onComputed, accentColor }) {
  const msrp = Number(car?.msrp || 0);
  const currency = car?.currency || 'USD';
  const onComputedRef = useRef(onComputed);
  useEffect(() => {
    onComputedRef.current = onComputed;
  }, [onComputed]);

  const [downPayment, setDownPayment] = useState(0);
  const [tradeIn, setTradeIn] = useState(0);
  const [apr, setApr] = useState(Number(car?.finance?.apr || 3.5));
  const [term, setTerm] = useState(
    DEFAULT_TERMS.includes(car?.finance?.termMonths?.[0])
      ? car.finance.termMonths[0]
      : 60
  );
  const [taxCode, setTaxCode] = useState(DEFAULT_TAX_RATES[0].code);
  const [docFee, setDocFee] = useState(200);
  const [incentives, setIncentives] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const taxRate = useMemo(
    () => DEFAULT_TAX_RATES.find((t) => t.code === taxCode)?.rate || 0,
    [taxCode]
  );

  useEffect(() => {
    const payload = {
      msrp,
      downPayment,
      tradeIn,
      apr,
      termMonths: term,
      taxRate,
      docFee,
      incentives,
    };
    let ignore = false;
    setLoading(true);
    calcFinance(payload)
      .then((data) => {
        if (!ignore) {
          setResult(data?.breakdown || null);
          if (onComputedRef.current) onComputedRef.current(data);
        }
      })
      .catch(() => {
        // Fallback: simple local calc
        const principalBeforeTax = Math.max(0, msrp - downPayment - tradeIn - incentives + docFee);
        const taxAmount = principalBeforeTax * taxRate;
        const principal = principalBeforeTax + taxAmount;
        const r = apr > 0 ? apr / 12 / 100 : 0;
        const n = term;
        let monthlyPayment = 0;
        if (r === 0) monthlyPayment = principal / n;
        else {
          const f = Math.pow(1 + r, n);
          monthlyPayment = (principal * r * f) / (f - 1);
        }
        const totalPaid = monthlyPayment * n;
        const totalInterest = Math.max(0, totalPaid - principal);
        const breakdown = {
          principalBeforeTax,
          taxAmount,
          principal,
          monthlyPayment: Math.round(monthlyPayment * 100) / 100,
          totalPaid: Math.round(totalPaid * 100) / 100,
          totalInterest: Math.round(totalInterest * 100) / 100,
        };
        setResult(breakdown);
        if (onComputedRef.current) onComputedRef.current({ inputs: payload, breakdown });
      })
      .finally(() => setLoading(false));
    return () => {
      ignore = true;
    };
  }, [msrp, downPayment, tradeIn, apr, term, taxRate, docFee, incentives]);

  const fmt = (v) => `${currency} ${Number(v || 0).toLocaleString()}`;
  const selectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: '0.5rem',
      borderColor: '#d1d5db',
      boxShadow: 'none',
    }),
  };

  return (
    <div className='max-w-5xl mx-auto px-6'>
      <div className='grid md:grid-cols-2 gap-6'>
        <div className='bg-white rounded-xl border border-gray-200 p-4 space-y-4'>
          <div>
            <label className='block text-sm text-gray-600 mb-1'>MSRP</label>
            <input disabled value={fmt(msrp)} className='w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-700' />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm text-gray-600 mb-1'>Down Payment</label>
              <input type='number' min='0' value={downPayment} onChange={(e)=>setDownPayment(Number(e.target.value)||0)} className='w-full border border-gray-300 rounded-md px-3 py-2' />
            </div>
            <div>
              <label className='block text-sm text-gray-600 mb-1'>Trade-in</label>
              <input type='number' min='0' value={tradeIn} onChange={(e)=>setTradeIn(Number(e.target.value)||0)} className='w-full border border-gray-300 rounded-md px-3 py-2' />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm text-gray-600 mb-1'>APR (%)</label>
              <input type='number' min='0' step='0.1' value={apr} onChange={(e)=>setApr(Number(e.target.value)||0)} className='w-full border border-gray-300 rounded-md px-3 py-2' />
            </div>
            <div>
              <label className='block text-sm text-gray-600 mb-1'>Term (months)</label>
              <Select
                options={DEFAULT_TERMS.map((t)=> ({ value: t, label: `${t}` }))}
                value={{ value: term, label: `${term}` }}
                onChange={(opt)=>setTerm(Number(opt?.value)||60)}
                isSearchable={false}
                styles={selectStyles}
              />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm text-gray-600 mb-1'>Tax Region</label>
              <Select
                options={DEFAULT_TAX_RATES.map((r)=> ({ value: r.code, label: `${r.name} (${(r.rate*100).toFixed(1)}%)` }))}
                value={{ value: taxCode, label: `${DEFAULT_TAX_RATES.find(r=>r.code===taxCode)?.name} (${(taxRate*100).toFixed(1)}%)` }}
                onChange={(opt)=>setTaxCode(opt?.value || DEFAULT_TAX_RATES[0].code)}
                isSearchable={false}
                styles={selectStyles}
              />
            </div>
            <div>
              <label className='block text-sm text-gray-600 mb-1'>Doc/Fees</label>
              <input type='number' min='0' value={docFee} onChange={(e)=>setDocFee(Number(e.target.value)||0)} className='w-full border border-gray-300 rounded-md px-3 py-2' />
            </div>
          </div>
          <div>
            <label className='block text-sm text-gray-600 mb-1'>Incentives/Rebates</label>
            <input type='number' min='0' value={incentives} onChange={(e)=>setIncentives(Number(e.target.value)||0)} className='w-full border border-gray-300 rounded-md px-3 py-2' />
          </div>
        </div>
        <div className='bg-white rounded-xl border border-gray-200 p-4'>
          {loading ? (
            <div className='text-gray-500'>Calculating…</div>
          ) : (
            <div className='space-y-2'>
              <div className='text-lg font-semibold text-gray-900'>Estimated Monthly</div>
              <div className='text-4xl font-extrabold' style={{ color: accentColor }}>
                {fmt(result?.monthlyPayment || 0)}
              </div>
              <hr className='my-3'/>
              <div className='flex justify-between text-sm text-gray-700'><span>Principal (pre-tax)</span><span>{fmt(result?.principalBeforeTax || 0)}</span></div>
              <div className='flex justify-between text-sm text-gray-700'><span>Tax</span><span>{fmt(result?.taxAmount || 0)}</span></div>
              <div className='flex justify-between text-sm text-gray-700'><span>Total Principal</span><span>{fmt(result?.principal || 0)}</span></div>
              <div className='flex justify-between text-sm text-gray-700'><span>Total Interest</span><span>{fmt(result?.totalInterest || 0)}</span></div>
              <div className='flex justify-between text-sm text-gray-700'><span>Total Paid</span><span>{fmt(result?.totalPaid || 0)}</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


