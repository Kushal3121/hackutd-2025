import express from 'express';

const router = express.Router();

function toNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

// POST /api/finance/calc
// Body: { msrp, downPayment, tradeIn, apr, termMonths, taxRate, docFee, incentives }
router.post('/finance/calc', async (req, res) => {
  try {
    const {
      msrp = 0,
      downPayment = 0,
      tradeIn = 0,
      apr = 0,
      termMonths = 60,
      taxRate = 0,
      docFee = 0,
      incentives = 0,
    } = req.body || {};

    const price = Math.max(0, toNumber(msrp));
    const dp = Math.max(0, toNumber(downPayment));
    const ti = Math.max(0, toNumber(tradeIn));
    const a = Math.max(0, toNumber(apr));
    const n = Math.max(1, Math.floor(toNumber(termMonths) || 60));
    const tax = Math.max(0, toNumber(taxRate)); // e.g., 0.0825 for 8.25%
    const fees = Math.max(0, toNumber(docFee));
    const inc = Math.max(0, toNumber(incentives));

    const principalBeforeTax = Math.max(0, price - dp - ti - inc + fees);
    const taxAmount = principalBeforeTax * tax;
    const principal = Math.max(0, principalBeforeTax + taxAmount);

    const monthlyRate = a > 0 ? a / 12 / 100 : 0;
    let monthlyPayment = 0;
    if (monthlyRate === 0) {
      monthlyPayment = principal / n;
    } else {
      const factor = Math.pow(1 + monthlyRate, n);
      monthlyPayment = (principal * monthlyRate * factor) / (factor - 1);
    }
    const totalPaid = monthlyPayment * n;
    const totalInterest = Math.max(0, totalPaid - principal);

    return res.json({
      inputs: { price, downPayment: dp, tradeIn: ti, apr: a, termMonths: n, taxRate: tax, docFee: fees, incentives: inc },
      breakdown: {
        principalBeforeTax,
        taxAmount,
        principal,
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalPaid: Math.round(totalPaid * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to calculate finance' });
  }
});

export default router;


