import {
  type FilingStatus,
  type MACRSRecoveryPeriod,
  type MacrsConvention,
  type MacrsMethod,
  TAX_BRACKETS_2024,
  LTCG_BRACKETS_2024,
  SE_WAGE_BASE_2024,
  MACRS_GDS_HY_RATES,
  SEC179_LIMITS_2024,
  ESTATE_GIFT_PARAMS_2024,
  AMT_PARAMS_2024,
  STANDARD_DEDUCTION_2024,
} from './constants';

export type { MACRSRecoveryPeriod, MacrsConvention, MacrsMethod };

// ── INDIVIDUAL INCOME TAX ────────────────────────────────────────────────────

export interface IncomeTaxResult {
  taxableIncome: number;
  regularTax: number;
  marginalRate: number;
  effectiveRate: number;
  bracketBreakdown: { rate: number; incomeInBracket: number; taxInBracket: number }[];
}

export const calculateIncomeTax = (
  taxableIncome: number,
  filingStatus: FilingStatus
): IncomeTaxResult => {
  const brackets = TAX_BRACKETS_2024[filingStatus];
  if (taxableIncome <= 0) return { taxableIncome: 0, regularTax: 0, marginalRate: 0, effectiveRate: 0, bracketBreakdown: [] };

  let totalTax = 0;
  let marginalRate = brackets[0].rate;
  const bracketBreakdown: { rate: number; incomeInBracket: number; taxInBracket: number }[] = [];

  for (const bracket of brackets) {
    if (taxableIncome <= bracket.min) break;
    const incomeInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
    const taxInBracket = incomeInBracket * bracket.rate;
    totalTax += taxInBracket;
    marginalRate = bracket.rate;
    if (incomeInBracket > 0) {
      bracketBreakdown.push({ rate: bracket.rate, incomeInBracket: Math.round(incomeInBracket), taxInBracket: Math.round(taxInBracket * 100) / 100 });
    }
    if (taxableIncome <= bracket.max) break;
  }

  return {
    taxableIncome,
    regularTax: Math.round(totalTax * 100) / 100,
    marginalRate,
    effectiveRate: taxableIncome > 0 ? totalTax / taxableIncome : 0,
    bracketBreakdown,
  };
};

// ── CAPITAL GAINS TAX ────────────────────────────────────────────────────────

export interface CapGainsResult {
  shortTermGains: number;
  longTermGains: number;
  at0pct: number;
  at15pct: number;
  at20pct: number;
  unrecaptured1250Gain: number;
  collectiblesGain: number;
  niitAmount: number;
  totalCapGainsTax: number;
  effectiveLTCGRate: number;
}

export const calculateCapGainsTax = (
  ordinaryTaxableIncome: number,
  shortTermGains: number,
  longTermGains: number,
  unrecaptured1250: number,
  collectiblesGain: number,
  filingStatus: FilingStatus,
  magi: number
): CapGainsResult => {
  const bracket = LTCG_BRACKETS_2024[filingStatus] ?? LTCG_BRACKETS_2024['SINGLE'];
  const at0pct = Math.max(0, Math.min(longTermGains, bracket.max0pct - ordinaryTaxableIncome));
  const at15pct = Math.max(0, Math.min(
    longTermGains - at0pct,
    bracket.max15pct - Math.max(ordinaryTaxableIncome, bracket.max0pct)
  ));
  const at20pct = Math.max(0, longTermGains - at0pct - at15pct - unrecaptured1250 - collectiblesGain);

  const ltcgTax = at15pct * 0.15 + at20pct * 0.20 + unrecaptured1250 * 0.25 + collectiblesGain * 0.28;

  const niitThreshold = filingStatus === 'MFJ' || filingStatus === 'QSS' ? 250000 : 200000;
  const niitBase = Math.min(longTermGains + shortTermGains, Math.max(0, magi - niitThreshold));
  const niitAmount = niitBase * 0.038;

  const totalCapGainsTax = ltcgTax + niitAmount;

  return {
    shortTermGains,
    longTermGains,
    at0pct,
    at15pct,
    at20pct,
    unrecaptured1250Gain: unrecaptured1250,
    collectiblesGain,
    niitAmount,
    totalCapGainsTax,
    effectiveLTCGRate: longTermGains > 0 ? totalCapGainsTax / (longTermGains + unrecaptured1250 + collectiblesGain) : 0,
  };
};

// ── SELF-EMPLOYMENT TAX ──────────────────────────────────────────────────────

export interface SEtaxResult {
  netSEIncome: number;
  seIncomeForTax: number;
  ssTaxable: number;
  medicareTaxable: number;
  ssTax: number;
  medicareTax: number;
  additionalMedicare: number;
  totalSETax: number;
  deductiblePortionOfSE: number;
}

export const calculateSETax = (
  netSEIncome: number,
  totalWagesFromEmployment: number = 0,
  filingStatus: FilingStatus = 'SINGLE',
  totalMAGI: number = 0
): SEtaxResult => {
  const seIncomeForTax = netSEIncome * 0.9235;
  const remainingSsBase = Math.max(0, SE_WAGE_BASE_2024 - totalWagesFromEmployment);
  const ssTaxable = Math.min(seIncomeForTax, remainingSsBase);
  const ssTax = ssTaxable * 0.124;
  const medicareTax = seIncomeForTax * 0.029;
  const addlMedThreshold = filingStatus === 'MFJ' || filingStatus === 'QSS' ? 250000 : 200000;
  const addlMedBase = Math.max(0, totalMAGI - addlMedThreshold);
  const additionalMedicare = Math.min(seIncomeForTax, addlMedBase) * 0.009;
  const totalSETax = ssTax + medicareTax + additionalMedicare;

  return {
    netSEIncome,
    seIncomeForTax,
    ssTaxable,
    medicareTaxable: seIncomeForTax,
    ssTax,
    medicareTax,
    additionalMedicare,
    totalSETax,
    deductiblePortionOfSE: (ssTax + medicareTax) / 2,
  };
};

// ── MACRS DEPRECIATION ENGINE ────────────────────────────────────────────────

export interface DepreciableAsset {
  id: string;
  description: string;
  dateInService: string;
  originalCost: number;
  recoveryPeriod: MACRSRecoveryPeriod;
  convention: MacrsConvention;
  method: MacrsMethod;
  businessUsePct: number;
  sec179Election: number;
  bonusDepreciationPct: number;
  listedProperty: boolean;
  vehicleLuxuryCap?: number;
}

export interface TaxBracket { min: number; max: number; rate: number; baseTax: number; }

export interface AssetDepreciationSchedule {
  asset: DepreciableAsset;
  depreciableBasis: number;
  bonusDepreciation: number;
  remainingBasisAfterBonus: number;
  schedule: { year: number; rate: number; deduction: number; yearEndBasis: number }[];
  totalDepreciation: number;
  sec179Taken: number;
  firstYearTotal: number;
}

export const calculateMACRS = (asset: DepreciableAsset, _taxYear?: number): AssetDepreciationSchedule => {
  const inServiceYear = new Date(asset.dateInService).getFullYear();
  const businessBasis = asset.originalCost * (asset.businessUsePct / 100);
  const sec179Taken = Math.min(asset.sec179Election, businessBasis);
  let remainingBasis = businessBasis - sec179Taken;
  const bonusDepreciation = remainingBasis * (asset.bonusDepreciationPct / 100);
  remainingBasis -= bonusDepreciation;

  // Real property (27.5 or 39 year, straight-line, mid-month)
  if (['27.5', '39'].includes(asset.recoveryPeriod)) {
    const recovYears = parseFloat(asset.recoveryPeriod);
    const annualRate = 1 / recovYears;
    const monthInService = new Date(asset.dateInService).getMonth() + 1;
    const firstYearMonths = 12.5 - monthInService;
    const firstYearRate = (firstYearMonths / 12) * annualRate;
    const realPropSchedule: AssetDepreciationSchedule['schedule'] = [];
    let rpBasis = remainingBasis;

    realPropSchedule.push({ year: inServiceYear, rate: firstYearRate, deduction: Math.round(rpBasis * firstYearRate * 100) / 100, yearEndBasis: Math.round(rpBasis * (1 - firstYearRate) * 100) / 100 });
    for (let yr = 1; yr < Math.ceil(recovYears); yr++) {
      const deduction = remainingBasis * annualRate;
      rpBasis = Math.max(0, rpBasis - deduction);
      if (rpBasis <= 0.01) break;
      realPropSchedule.push({ year: inServiceYear + yr, rate: annualRate, deduction: Math.round(Math.min(deduction, rpBasis + deduction) * 100) / 100, yearEndBasis: Math.round(Math.max(0, rpBasis) * 100) / 100 });
    }

    const totalDep = realPropSchedule.reduce((s, r) => s + r.deduction, 0);
    return {
      asset,
      depreciableBasis: businessBasis,
      bonusDepreciation: 0,
      remainingBasisAfterBonus: remainingBasis,
      schedule: realPropSchedule,
      totalDepreciation: sec179Taken + totalDep,
      sec179Taken,
      firstYearTotal: sec179Taken + (realPropSchedule[0]?.deduction ?? 0),
    };
  }

  const rates = MACRS_GDS_HY_RATES[asset.recoveryPeriod];
  const schedule: AssetDepreciationSchedule['schedule'] = [];
  let runningBasis = remainingBasis;

  for (let i = 0; i < rates.length; i++) {
    let deduction = remainingBasis * rates[i];
    
    if (asset.listedProperty && asset.vehicleLuxuryCap && i === 0) {
      deduction = Math.min(deduction, asset.vehicleLuxuryCap);
    }
    
    runningBasis = Math.max(0, runningBasis - deduction);
    schedule.push({
      year: inServiceYear + i,
      rate: rates[i],
      deduction: Math.round(deduction * 100) / 100,
      yearEndBasis: Math.round(runningBasis * 100) / 100,
    });
  }

  const totalDep = schedule.reduce((s, r) => s + r.deduction, 0);
  return {
    asset,
    depreciableBasis: businessBasis,
    bonusDepreciation: Math.round(bonusDepreciation * 100) / 100,
    remainingBasisAfterBonus: Math.round(remainingBasis * 100) / 100,
    schedule,
    totalDepreciation: sec179Taken + bonusDepreciation + totalDep,
    sec179Taken,
    firstYearTotal: sec179Taken + bonusDepreciation + (schedule[0]?.deduction ?? 0),
  };
};

export const calculate179Limit = (
  totalPropertyInService: number,
  tentative179: number
): { allowed179: number; phaseOutAmount: number; carryforward: number } => {
  const phaseOut = Math.max(0, totalPropertyInService - SEC179_LIMITS_2024.phaseOutStart);
  const allowed179 = Math.max(0, Math.min(tentative179, SEC179_LIMITS_2024.maxDeduction - phaseOut));
  const carryforward = tentative179 - allowed179;
  return { allowed179, phaseOutAmount: phaseOut, carryforward };
};

// ── QBI DEDUCTION (§199A) ───────────────────────────────────────────────

export interface QBIInput {
  qbiFromEachActivity: { activity: string; qbi: number; w2Wages: number; unadjustedBasis: number; isSSTB: boolean }[];
  totalTaxableIncome: number;
  filingStatus: FilingStatus;
  capitalGainsInTaxableIncome: number;
}

export interface QBIResult {
  totalQBI: number;
  phaseInRange: { start: number; end: number };
  isFullyLimited: boolean;
  isFullyDeductible: boolean;
  phaseInPct: number;
  qbiBeforeLimitation: number;
  w2WageLimit: number;
  w2PlusPropertyLimit: number;
  applicableLimit: number;
  preliminaryDeduction: number;
  overallLimitation: number;
  finalQBIDeduction: number;
}

export const calculateQBI = (input: QBIInput): QBIResult => {
  const thresholds = {
    SINGLE: { lower: 191950, upper: 241950 },
    MFJ:    { lower: 383900, upper: 483900 },
    MFS:    { lower: 191950, upper: 241950 },
    HOH:    { lower: 191950, upper: 241950 },
    QSS:    { lower: 383900, upper: 483900 },
  };
  const { lower, upper } = thresholds[input.filingStatus] ?? thresholds['SINGLE'];
  const totalQBI = input.qbiFromEachActivity.reduce((s, a) => s + Math.max(0, a.qbi), 0);
  const qbiBeforeLimitation = totalQBI * 0.20;
  const totalW2 = input.qbiFromEachActivity.reduce((s, a) => s + a.w2Wages, 0);
  const totalBasis = input.qbiFromEachActivity.reduce((s, a) => s + a.unadjustedBasis, 0);
  const w2WageLimit = totalW2 * 0.50;
  const w2PlusPropertyLimit = totalW2 * 0.25 + totalBasis * 0.025;
  const applicableLimit = Math.max(w2WageLimit, w2PlusPropertyLimit);
  const isFullyDeductible = input.totalTaxableIncome <= lower;
  const isFullyLimited = input.totalTaxableIncome >= upper;
  const phaseInPct = isFullyDeductible ? 0 : isFullyLimited ? 100 : ((input.totalTaxableIncome - lower) / (upper - lower)) * 100;

  let preliminaryDeduction = qbiBeforeLimitation;
  if (!isFullyDeductible) {
    const limitation = qbiBeforeLimitation - applicableLimit;
    const limitationApplied = limitation * (phaseInPct / 100);
    preliminaryDeduction = qbiBeforeLimitation - limitationApplied;
  }

  const overallLimitation = Math.max(0, (input.totalTaxableIncome - input.capitalGainsInTaxableIncome)) * 0.20;
  const finalQBIDeduction = Math.min(preliminaryDeduction, overallLimitation);

  return {
    totalQBI,
    phaseInRange: { start: lower, end: upper },
    isFullyLimited,
    isFullyDeductible,
    phaseInPct,
    qbiBeforeLimitation,
    w2WageLimit,
    w2PlusPropertyLimit,
    applicableLimit,
    preliminaryDeduction,
    overallLimitation,
    finalQBIDeduction: Math.max(0, finalQBIDeduction),
  };
};

// ── AMT ──────────────────────────────────────────────────────────────────────

export interface AMTInput {
  regularTaxableIncome: number;
  addBacks: {
    itemizedDeductionLost: number;
    iso: number;
    acceleratedDepreciation: number;
    taxExemptInterest: number;
    percentageDepletion: number;
    research: number;
  };
  filingStatus: FilingStatus;
}

export interface AMTResult {
  amti: number;
  exemption: number;
  amtBase: number;
  tentativeMinimumTax: number;
  regularTax: number;
  amtLiability: number;
  isSubjectToAMT: boolean;
}

export const calculateAMT = (input: AMTInput, regularTax: number): AMTResult => {
  const addbackTotal = Object.values(input.addBacks).reduce((s, v) => s + v, 0);
  const amti = input.regularTaxableIncome + addbackTotal;
  const fullExemption = AMT_PARAMS_2024.exemptions[input.filingStatus];
  const phaseoutStart = AMT_PARAMS_2024.phaseoutStarts[input.filingStatus];
  const phaseoutReduction = Math.max(0, (amti - phaseoutStart) * AMT_PARAMS_2024.phaseoutRate);
  const exemption = Math.max(0, fullExemption - phaseoutReduction);
  const amtBase = Math.max(0, amti - exemption);
  let tentativeMinimumTax = 0;
  if (amtBase <= AMT_PARAMS_2024.bracketBreakpoint) {
    tentativeMinimumTax = amtBase * AMT_PARAMS_2024.rate1;
  } else {
    tentativeMinimumTax = AMT_PARAMS_2024.bracketBreakpoint * AMT_PARAMS_2024.rate1
      + (amtBase - AMT_PARAMS_2024.bracketBreakpoint) * AMT_PARAMS_2024.rate2;
  }
  const amtLiability = Math.max(0, tentativeMinimumTax - regularTax);

  return { amti, exemption, amtBase, tentativeMinimumTax, regularTax, amtLiability, isSubjectToAMT: amtLiability > 0 };
};

// ── ESTATE TAX ───────────────────────────────────────────────────────────────

export interface EstateTaxResult {
  grossEstate: number;
  allowableDeductions: number;
  taxableEstate: number;
  taxBase: number;
  tentativeTax: number;
  netEstateTax: number;
  remainingExemption: number;
  effectiveEstateTaxRate: number;
}

export const calculateEstateTax = (
  grossEstate: number,
  allowableDeductions: number,
  cumulativeGiftsPriorYears: number = 0,
  _priorGiftTaxPaid: number = 0,
  remainingExemptionUsed: number = 0
): EstateTaxResult => {
  const taxableEstate = Math.max(0, grossEstate - allowableDeductions);
  const adjTaxableGifts = cumulativeGiftsPriorYears;
  const taxBase = taxableEstate + adjTaxableGifts;
  const tentativeTax = taxBase * 0.40;
  const unifiedCredit = ESTATE_GIFT_PARAMS_2024.lifetimeExemption * 0.40;
  const grossEstateTax = Math.max(0, tentativeTax - unifiedCredit);
  const remainingExemption = Math.max(0, ESTATE_GIFT_PARAMS_2024.lifetimeExemption - remainingExemptionUsed - taxableEstate);

  return {
    grossEstate,
    allowableDeductions,
    taxableEstate,
    taxBase,
    tentativeTax,
    netEstateTax: grossEstateTax,
    remainingExemption,
    effectiveEstateTaxRate: grossEstate > 0 ? grossEstateTax / grossEstate : 0,
  };
};

// ── ESTIMATED TAX PAYMENT SCHEDULE ───────────────────────────────────────────

export interface EstimatedTaxSchedule {
  taxYear: number;
  filingStatus: FilingStatus;
  priorYearTax: number;
  currentYearProjectedTax: number;
  currentYearWithholding: number;
  safeHarborMethod: 'PRIOR_YEAR_100' | 'PRIOR_YEAR_110' | 'CURRENT_YEAR_90';
  safeHarborAmount: number;
  requiredPayments: { quarter: string; dueDate: string; amount: number; cumulativeRequired: number }[];
  totalRequired: number;
  alreadyWithheld: number;
  netRequiredPayments: number;
  underpaymentRisk: boolean;
}

export const calculateEstimatedTaxes = (
  taxYear: number,
  filingStatus: FilingStatus,
  priorYearTax: number,
  currentYearProjectedTax: number,
  currentYearWithholding: number,
  _currentYearProjectedAGI: number = 0
): EstimatedTaxSchedule => {
  const shPct = priorYearTax > 50000 ? 1.10 : 1.00;
  const priorYearSafeHarbor = priorYearTax * shPct;
  const currentYear90 = currentYearProjectedTax * 0.90;
  const safeHarborAmount = Math.min(priorYearSafeHarbor, currentYear90);
  const safeHarborMethod: EstimatedTaxSchedule['safeHarborMethod'] =
    priorYearSafeHarbor <= currentYear90
      ? (shPct === 1.10 ? 'PRIOR_YEAR_110' : 'PRIOR_YEAR_100')
      : 'CURRENT_YEAR_90';
  const netRequired = Math.max(0, safeHarborAmount - currentYearWithholding);
  const quarterlyAmount = netRequired / 4;
  const dueDates = [
    { q: 'Q1', due: `${taxYear}-04-15` },
    { q: 'Q2', due: `${taxYear}-06-17` },
    { q: 'Q3', due: `${taxYear}-09-15` },
    { q: 'Q4', due: `${taxYear + 1}-01-15` },
  ];

  return {
    taxYear,
    filingStatus,
    priorYearTax,
    currentYearProjectedTax,
    currentYearWithholding,
    safeHarborMethod,
    safeHarborAmount,
    requiredPayments: dueDates.map((d, i) => ({
      quarter: d.q,
      dueDate: d.due,
      amount: Math.round(quarterlyAmount),
      cumulativeRequired: Math.round(quarterlyAmount * (i + 1)),
    })),
    totalRequired: safeHarborAmount,
    alreadyWithheld: currentYearWithholding,
    netRequiredPayments: netRequired,
    underpaymentRisk: currentYearWithholding < safeHarborAmount * 0.75,
  };
};

// ── ENTITY COMPARISON ────────────────────────────────────────────────────────

export interface EntityComparisonInput {
  businessNetIncome: number;
  ownerW2Salary?: number;
  stateIncomeTaxRate: number;
  ownerFilingStatus: FilingStatus;
  ownerOtherIncome: number;
  retainedInCorp?: number;
  qualifiesForQBI?: boolean;
  w2WagesInBusiness?: number;
  unadjustedBasisQualProp?: number;
}

export interface EntityComparisonResult {
  entityType: string;
  totalBusinessTax: number;
  ownerTax: number;
  totalTax: number;
  effectiveTotalRate: number;
  qbiDeduction?: number;
  selfEmploymentTax?: number;
  ficaTax?: number;
  advantages: string[];
  disadvantages: string[];
  estimatedAnnualTaxSavingsVs?: Record<string, number>;
}

export const compareEntityStructures = (input: EntityComparisonInput): Record<string, EntityComparisonResult> => {
  const results: Record<string, EntityComparisonResult> = {};
  const { businessNetIncome: income, stateIncomeTaxRate: stateRate, ownerFilingStatus: fs } = input;
  const stdDed = STANDARD_DEDUCTION_2024[fs];

  // Sole Prop
  const seTax = calculateSETax(income, 0, fs, income + input.ownerOtherIncome);
  const soleDeductibleSE = seTax.deductiblePortionOfSE;
  const soleAGI = income - soleDeductibleSE + input.ownerOtherIncome;
  const soleQBI = input.qualifiesForQBI !== false ? calculateQBI({
    qbiFromEachActivity: [{ activity: 'Business', qbi: income - soleDeductibleSE, w2Wages: 0, unadjustedBasis: input.unadjustedBasisQualProp ?? 0, isSSTB: false }],
    totalTaxableIncome: Math.max(0, soleAGI - stdDed),
    filingStatus: fs,
    capitalGainsInTaxableIncome: 0,
  }) : { finalQBIDeduction: 0 };
  const soleTaxableIncome = Math.max(0, soleAGI - stdDed - soleQBI.finalQBIDeduction);
  const soleFedTax = calculateIncomeTax(soleTaxableIncome, fs);
  const soleStateTax = soleAGI * stateRate;
  const soleTotal = seTax.totalSETax + soleFedTax.regularTax + soleStateTax;

  results['Sole_Proprietorship'] = {
    entityType: 'Sole Proprietor / Single-Member LLC',
    totalBusinessTax: 0,
    ownerTax: soleTotal,
    totalTax: soleTotal,
    effectiveTotalRate: income > 0 ? soleTotal / income : 0,
    qbiDeduction: soleQBI.finalQBIDeduction,
    selfEmploymentTax: seTax.totalSETax,
    advantages: ['No separate entity tax return required', 'Simplest structure — lowest compliance cost', '§199A QBI deduction available (up to 20%)', 'All losses directly deductible on owner return'],
    disadvantages: [`Self-employment tax on ALL net income (${(seTax.totalSETax / income * 100).toFixed(1)}%)`, 'No wage base planning strategy available', 'Unlimited personal liability'],
  };

  // S-Corp
  const sCorpSalary = input.ownerW2Salary ?? Math.min(income * 0.40, 120000);
  const sCorpDistribution = Math.max(0, income - sCorpSalary);
  const ficaOnSalary = Math.min(sCorpSalary, SE_WAGE_BASE_2024) * 0.153 + Math.max(0, sCorpSalary - SE_WAGE_BASE_2024) * 0.029;
  const sCorpAGI = sCorpSalary + sCorpDistribution + input.ownerOtherIncome - ficaOnSalary * 0.5;
  const sCorpQBI = input.qualifiesForQBI !== false ? calculateQBI({
    qbiFromEachActivity: [{ activity: 'S-Corp', qbi: sCorpDistribution, w2Wages: sCorpSalary, unadjustedBasis: input.unadjustedBasisQualProp ?? 0, isSSTB: false }],
    totalTaxableIncome: Math.max(0, sCorpAGI - stdDed),
    filingStatus: fs,
    capitalGainsInTaxableIncome: 0,
  }) : { finalQBIDeduction: 0 };
  const sCorpTaxableIncome = Math.max(0, sCorpAGI - stdDed - sCorpQBI.finalQBIDeduction);
  const sCorpFedTax = calculateIncomeTax(sCorpTaxableIncome, fs);
  const sCorpStateTax = sCorpAGI * stateRate;
  const sCorpTotal = ficaOnSalary + sCorpFedTax.regularTax + sCorpStateTax;

  results['S_Corporation'] = {
    entityType: 'S-Corporation',
    totalBusinessTax: ficaOnSalary,
    ownerTax: sCorpFedTax.regularTax + sCorpStateTax,
    totalTax: sCorpTotal,
    effectiveTotalRate: income > 0 ? sCorpTotal / income : 0,
    qbiDeduction: sCorpQBI.finalQBIDeduction,
    ficaTax: ficaOnSalary,
    advantages: [`FICA saved vs sole prop: ~$${Math.round(seTax.totalSETax - ficaOnSalary).toLocaleString()}/yr`, `Pass-through income avoids SE tax: distributions of $${Math.round(sCorpDistribution).toLocaleString()} exempt`, '§199A QBI on distribution amount (not salary)', 'Single level of tax on income'],
    disadvantages: ['Requires annual 1120-S filing + officer W-2', 'Reasonable compensation requirement — must pay market-rate W-2', 'Payroll tax filings (941, W-2, W-3)', 'Not available to non-resident aliens, certain trusts'],
  };

  // C-Corp
  const corpTax = income * 0.21;
  const corpStateTax = income * stateRate;
  const corpDividend = income - (input.retainedInCorp ?? 0) - corpTax - corpStateTax;
  const divTax = Math.max(0, corpDividend) * 0.20;
  const cCorpOwnerTax = calculateIncomeTax(input.ownerOtherIncome, fs).regularTax + divTax;
  const cCorpTotal = corpTax + corpStateTax + cCorpOwnerTax;

  results['C_Corporation'] = {
    entityType: 'C-Corporation',
    totalBusinessTax: corpTax + corpStateTax,
    ownerTax: cCorpOwnerTax,
    totalTax: cCorpTotal,
    effectiveTotalRate: income > 0 ? cCorpTotal / income : 0,
    advantages: ['21% flat federal corporate rate — beneficial at high income levels', 'Can retain income in corp at lower rate (deferral)', 'Fringe benefits (health insurance, life insurance) fully deductible', 'QSBS §1202 exclusion available if <$50M assets', 'No SE tax; FICA only on salary'],
    disadvantages: ['Double taxation on distributed profits (corp + individual)', '§531 accumulated earnings tax risk if excess retained', 'More complex compliance — separate return, more filings', 'No §199A QBI deduction (C-Corp income)'],
  };

  // Partnership
  const partnerSE = calculateSETax(income, 0, fs, income + input.ownerOtherIncome);
  const partnerQBI = input.qualifiesForQBI !== false ? calculateQBI({
    qbiFromEachActivity: [{ activity: 'Partnership', qbi: income, w2Wages: input.w2WagesInBusiness ?? 0, unadjustedBasis: input.unadjustedBasisQualProp ?? 0, isSSTB: false }],
    totalTaxableIncome: Math.max(0, income + input.ownerOtherIncome - stdDed - partnerSE.deductiblePortionOfSE),
    filingStatus: fs,
    capitalGainsInTaxableIncome: 0,
  }) : { finalQBIDeduction: 0 };
  const partnerTaxableInc = Math.max(0, income + input.ownerOtherIncome - stdDed - partnerSE.deductiblePortionOfSE - partnerQBI.finalQBIDeduction);
  const partnerFedTax = calculateIncomeTax(partnerTaxableInc, fs);
  const partnerStateTax = (income + input.ownerOtherIncome) * stateRate;
  const partnerTotal = partnerSE.totalSETax + partnerFedTax.regularTax + partnerStateTax;

  results['Partnership'] = {
    entityType: 'Partnership / Multi-Member LLC',
    totalBusinessTax: 0,
    ownerTax: partnerTotal,
    totalTax: partnerTotal,
    effectiveTotalRate: income > 0 ? partnerTotal / income : 0,
    qbiDeduction: partnerQBI.finalQBIDeduction,
    selfEmploymentTax: partnerSE.totalSETax,
    advantages: ['Maximum flexibility in profit/loss allocations among partners', 'Basis from debt — partners can take losses up to share of entity debt', '§754 election allows inside basis adjustment on transfers', 'Special allocations possible (§704(b))'],
    disadvantages: ['SE tax on guaranteed payments and general partner income', 'Annual 1065 filing + K-1s to each partner', 'More complex exit planning vs simpler entities'],
  };

  // Savings comparison
  Object.values(results).forEach(r => {
    r.estimatedAnnualTaxSavingsVs = {};
    Object.entries(results).forEach(([k, v]) => {
      r.estimatedAnnualTaxSavingsVs![k] = v.totalTax - r.totalTax;
    });
  });

  return results;
};

// ── FORMATTERS ───────────────────────────────────────────────────────────────

export const fmtTax = {
  dollar: (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n),
  dollarCents: (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n),
  pct: (n: number) => `${(n * 100).toFixed(1)}%`,
  pctFixed: (n: number, d = 2) => `${(n * 100).toFixed(d)}%`,
  rate: (n: number) => `${(n * 100).toFixed(2)}%`,
  number: (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n)),
};
