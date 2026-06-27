export const ENTITY_TYPES = {
  C_CORP:      { label: 'C-Corporation',    form: '1120',   color: '#8B5CF6',   deadline: 'Mar 15' },
  S_CORP:      { label: 'S-Corporation',    form: '1120-S', color: '#3B82F6',   deadline: 'Mar 15' },
  PARTNERSHIP: { label: 'Partnership',      form: '1065',   color: '#10B981',   deadline: 'Mar 15' },
  LLC_SINGLE:  { label: 'LLC (Single)',      form: '1040 Sch C', color: '#F59E0B',  deadline: 'Apr 15' },
  LLC_MULTI:   { label: 'LLC (Multi)',       form: '1065',   color: '#10B981',   deadline: 'Mar 15' },
  INDIVIDUAL:  { label: 'Individual',        form: '1040',   color: '#F59E0B',    deadline: 'Apr 15' },
  TRUST_ESTATE:{ label: 'Trust / Estate',   form: '1041',   color: '#EC4899',   deadline: 'Apr 15' },
  NONPROFIT:   { label: 'Tax-Exempt Org',   form: '990',    color: '#6B7280',   deadline: 'May 15' },
} as const;

export type EntityType = keyof typeof ENTITY_TYPES;

export const RETURN_STATUSES = {
  NOT_STARTED: { label: 'Not Started',    color: '#374151' },
  IN_PROGRESS: { label: 'In Progress',    color: '#F59E0B' },
  REVIEW:      { label: 'Partner Review', color: '#8B5CF6' },
  FILED:       { label: 'Filed',          color: '#10B981' },
  EXTENSION:   { label: 'Extension',      color: '#3B82F6' },
  OVERDUE:     { label: 'Overdue',        color: '#EF4444' },
  AMENDED:     { label: 'Amended',        color: '#F59E0B' },
} as const;

export type ReturnStatus = keyof typeof RETURN_STATUSES;

export const RESEARCH_QUESTION_TYPES = {
  DEDUCTIBILITY:  'Deductibility of expense',
  INCOME:         'Income recognition / exclusion',
  BASIS:          'Basis calculation',
  ENTITY:         'Entity structure / formation',
  DEPRECIATION:   'Depreciation / cost recovery',
  CREDITS:        'Tax credits',
  INTERNATIONAL:  'International / cross-border',
  ESTATE_GIFT:    'Estate / gift / trust',
  RETIREMENT:     'Retirement plans',
  PENALTY:        'Penalty / interest / controversy',
  SALT:           'State and local tax',
  OTHER:          'Other',
} as const;

export type FilingStatus = 'SINGLE' | 'MFJ' | 'MFS' | 'HOH' | 'QSS';

export const TAX_DEADLINES_2025 = [
  { date: '2025-01-15', description: 'Q4 2024 estimated tax payment due (individuals)', form: '1040-ES' },
  { date: '2025-01-31', description: 'W-2 and 1099-NEC due to recipients and IRS', form: 'W-2 / 1099-NEC' },
  { date: '2025-02-18', description: '1099-B, 1099-S, 1099-MISC (with backup withholding) due', form: '1099-B/S/MISC' },
  { date: '2025-02-28', description: 'Paper information returns due to IRS', form: 'Various 1099s' },
  { date: '2025-03-15', description: 'S-Corp (1120-S) and Partnership (1065) returns due', form: '1120-S / 1065' },
  { date: '2025-03-17', description: 'S-Corp and Partnership extension deadline (Form 7004)', form: '7004' },
  { date: '2025-04-01', description: 'Electronic information returns due to IRS', form: '1099 (e-file)' },
  { date: '2025-04-15', description: 'Individual (1040) and C-Corp (1120) returns due', form: '1040 / 1120' },
  { date: '2025-04-15', description: 'Q1 2025 estimated tax payment due', form: '1040-ES' },
  { date: '2025-04-15', description: 'FBAR deadline (FinCEN 114) — auto-extension to Oct 15', form: 'FinCEN 114' },
  { date: '2025-04-15', description: 'Gift tax return due (Form 709) — with 1040 extension', form: '709' },
  { date: '2025-05-15', description: 'Exempt organization returns due (Form 990)', form: '990' },
  { date: '2025-06-16', description: 'Q2 2025 estimated tax payment due', form: '1040-ES' },
  { date: '2025-09-15', description: 'Extended S-Corp / Partnership returns due', form: '1120-S / 1065' },
  { date: '2025-09-15', description: 'Q3 2025 estimated tax payment due', form: '1040-ES' },
  { date: '2025-10-15', description: 'Extended individual (1040) returns due', form: '1040' },
  { date: '2025-10-15', description: 'Extended C-Corp (1120) returns due', form: '1120' },
  { date: '2025-11-17', description: 'Extended exempt organization returns due', form: '990' },
  { date: '2025-12-31', description: 'Year-end — last day for 2025 tax planning moves', form: 'N/A' },
];

// 2024 Federal Tax Brackets
export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  baseTax: number;
}

export const TAX_BRACKETS_2024: Record<FilingStatus, TaxBracket[]> = {
  SINGLE: [
    { min: 0,       max: 11600,   rate: 0.10, baseTax: 0       },
    { min: 11600,   max: 47150,   rate: 0.12, baseTax: 1160    },
    { min: 47150,   max: 100525,  rate: 0.22, baseTax: 5426    },
    { min: 100525,  max: 191950,  rate: 0.24, baseTax: 17168.5 },
    { min: 191950,  max: 243725,  rate: 0.32, baseTax: 39110.5 },
    { min: 243725,  max: 609350,  rate: 0.35, baseTax: 55678.5 },
    { min: 609350,  max: Infinity,rate: 0.37, baseTax: 183647.25},
  ],
  MFJ: [
    { min: 0,       max: 23200,   rate: 0.10, baseTax: 0       },
    { min: 23200,   max: 94300,   rate: 0.12, baseTax: 2320    },
    { min: 94300,   max: 201050,  rate: 0.22, baseTax: 10852   },
    { min: 201050,  max: 383900,  rate: 0.24, baseTax: 34337   },
    { min: 383900,  max: 487450,  rate: 0.32, baseTax: 78221   },
    { min: 487450,  max: 731200,  rate: 0.35, baseTax: 111357  },
    { min: 731200,  max: Infinity,rate: 0.37, baseTax: 196669.5},
  ],
  MFS: [
    { min: 0,       max: 11600,   rate: 0.10, baseTax: 0       },
    { min: 11600,   max: 47150,   rate: 0.12, baseTax: 1160    },
    { min: 47150,   max: 100525,  rate: 0.22, baseTax: 5426    },
    { min: 100525,  max: 191950,  rate: 0.24, baseTax: 17168.5 },
    { min: 191950,  max: 243725,  rate: 0.32, baseTax: 39110.5 },
    { min: 243725,  max: 365600,  rate: 0.35, baseTax: 55678.5 },
    { min: 365600,  max: Infinity,rate: 0.37, baseTax: 98334.75},
  ],
  HOH: [
    { min: 0,       max: 16550,   rate: 0.10, baseTax: 0       },
    { min: 16550,   max: 63100,   rate: 0.12, baseTax: 1655    },
    { min: 63100,   max: 100500,  rate: 0.22, baseTax: 7241    },
    { min: 100500,  max: 191950,  rate: 0.24, baseTax: 15469   },
    { min: 191950,  max: 243700,  rate: 0.32, baseTax: 37417   },
    { min: 243700,  max: 609350,  rate: 0.35, baseTax: 53977   },
    { min: 609350,  max: Infinity,rate: 0.37, baseTax: 181954.5},
  ],
  QSS: [
    { min: 0,       max: 23200,   rate: 0.10, baseTax: 0       },
    { min: 23200,   max: 94300,   rate: 0.12, baseTax: 2320    },
    { min: 94300,   max: 201050,  rate: 0.22, baseTax: 10852   },
    { min: 201050,  max: 383900,  rate: 0.24, baseTax: 34337   },
    { min: 383900,  max: 487450,  rate: 0.32, baseTax: 78221   },
    { min: 487450,  max: 731200,  rate: 0.35, baseTax: 111357  },
    { min: 731200,  max: Infinity,rate: 0.37, baseTax: 196669.5},
  ],
};

export const LTCG_BRACKETS_2024: Record<FilingStatus, { max0pct: number; max15pct: number }> = {
  SINGLE: { max0pct: 47025,   max15pct: 518900  },
  MFJ:    { max0pct: 94050,   max15pct: 583750  },
  MFS:    { max0pct: 47025,   max15pct: 291850  },
  HOH:    { max0pct: 63000,   max15pct: 551350  },
  QSS:    { max0pct: 94050,   max15pct: 583750  },
};

export const SE_WAGE_BASE_2024 = 168600;

export type MACRSRecoveryPeriod = '3' | '5' | '7' | '10' | '15' | '20' | '27.5' | '39';
export type MacrsConvention = 'HY' | 'MM' | 'MQ';
export type MacrsMethod = 'GDS_200DB' | 'GDS_150DB' | 'GDS_SL' | 'ADS_SL';

export const MACRS_GDS_HY_RATES: Record<MACRSRecoveryPeriod, number[]> = {
  '3':    [0.3333, 0.4445, 0.1481, 0.0741],
  '5':    [0.2000, 0.3200, 0.1920, 0.1152, 0.1152, 0.0576],
  '7':    [0.1429, 0.2449, 0.1749, 0.1249, 0.0893, 0.0892, 0.0893, 0.0446],
  '10':   [0.1000, 0.1800, 0.1440, 0.1152, 0.0922, 0.0737, 0.0655, 0.0655, 0.0656, 0.0655, 0.0328],
  '15':   [0.0500, 0.0950, 0.0855, 0.0770, 0.0693, 0.0623, 0.0590, 0.0590, 0.0591, 0.0590, 0.0591, 0.0590, 0.0591, 0.0590, 0.0591, 0.0295],
  '20':   [0.0375, 0.0722, 0.0668, 0.0618, 0.0571, 0.0529, 0.0489, 0.0452, 0.0446, 0.0446, 0.0446, 0.0446, 0.0446, 0.0446, 0.0446, 0.0446, 0.0446, 0.0446, 0.0446, 0.0446, 0.0223],
  '27.5': [],
  '39':   [],
};

export const SEC179_LIMITS_2024 = {
  maxDeduction: 1220000,
  phaseOutStart: 3050000,
  heavySUVLimit: 30500,
};

export const ESTATE_GIFT_PARAMS_2024 = {
  annualExclusion: 18000,
  lifetimeExemption: 13610000,
  gstExemption: 13610000,
  maxRate: 0.40,
  specialUseValuation: 1390000,
  section7520Rate: 0.054,
};

export const AMT_PARAMS_2024 = {
  rate1: 0.26,
  rate2: 0.28,
  bracketBreakpoint: 232600,
  exemptions: {
    SINGLE: 88100,  MFJ: 137000,  MFS: 68500,  HOH: 88100,  QSS: 137000,
  },
  phaseoutStarts: {
    SINGLE: 618725, MFJ: 1237450, MFS: 618725, HOH: 618725, QSS: 1237450,
  },
  phaseoutRate: 0.25,
};

export const RETIREMENT_LIMITS_2024 = {
  four01k: 23000,
  four01kCatchup: 7500,
  ira: 7000,
  iraCatchup: 1000,
  sepIra: 69000,
  sepPercent: 0.25,
  simple: 16000,
  simpleCatchup: 3500,
  hsaIndividual: 4150,
  hsaFamily: 8300,
  hsaCatchup: 1000,
  definedBenefit: 275000,
};

export const STANDARD_DEDUCTION_2024: Record<FilingStatus, number> = {
  SINGLE: 14600,
  MFJ: 29200,
  MFS: 14600,
  HOH: 21900,
  QSS: 29200,
};
