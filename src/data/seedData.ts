import { useClientStore, type TaxClient } from '@/stores/useClientStore';
import { useReturnStore, type TaxReturn } from '@/stores/useReturnStore';
import { useResearchStore, type TaxResearchMemo } from '@/stores/useResearchStore';
import { useAgentStore, type TaxAgent } from '@/stores/useAgentStore';

export const TAX_AGENTS: Record<string, TaxAgent> = {
  'agent-tax-research': {
    id: 'agent-tax-research',
    name: 'Tax Research Agent',
    description: 'Researches any federal income tax question, cites relevant IRC sections, Treasury regulations, revenue rulings, and court cases; produces a formal AICPA-standard tax research memo.',
    icon: 'Search',
    specialty: 'Federal income tax research and memo drafting',
    avgDurationSec: 18,
    avgTokens: 1000,
    timesRun: 0,
    enabled: true,
    outputFormat: 'hybrid',
    systemPrompt: `You are a senior tax attorney and CPA with 25 years of federal income tax experience, formerly with a Big Four firm. You conduct rigorous tax research and draft AICPA-standard tax memos. TAX RESEARCH METHODOLOGY: 1. Identify the IRC section(s) governing the issue. 2. Review Treasury Regulations. 3. Review IRS guidance. 4. Review PLRs. 5. Review Tax Court cases. 6. Apply to client facts. AUTHORITY HIERARCHY: IRC > Treasury Regulations > Tax Court decisions > Revenue Rulings > PLRs. AICPA TAX RESEARCH MEMO FORMAT: Issue, Facts, Applicable Law, Analysis, Conclusion, Recommendations. Always cite specific IRC sections as "§XXX(a)(1)(B)". Write in formal legal memo style.`,
  },
  'agent-entity-optimizer': {
    id: 'agent-entity-optimizer',
    name: 'Entity Structure Optimizer',
    description: 'Analyzes all entity structures for a business (Sole Prop, S-Corp, C-Corp, Partnership), calculates total tax burden under each scenario, and recommends optimal structure with transition considerations.',
    icon: 'Building2',
    specialty: 'Business entity tax structure analysis and optimization',
    avgDurationSec: 15,
    avgTokens: 960,
    timesRun: 0,
    enabled: true,
    outputFormat: 'json',
    systemPrompt: `You are a tax partner specializing in business formation and entity structure planning. Compare total tax burden across: SOLE PROPRIETORSHIP (pass-through, QBI, SE tax on all income), S-CORPORATION (SE tax only on salary, distributions avoid SE tax, QBI, pass-through losses), C-CORPORATION (21% flat rate, double taxation on distributions, fringe benefits, QSBS), PARTNERSHIP (allocation flexibility, basis from debt, §754 election, SE tax on GP income). Include S-Corp reasonable compensation analysis and transition considerations. Return ONLY valid JSON.`,
  },
  'agent-depreciation': {
    id: 'agent-depreciation',
    name: 'Depreciation & §179 Agent',
    description: 'Builds complete MACRS depreciation schedules, calculates §179 expensing and bonus depreciation, models different strategies to optimize taxable income, and produces Form 4562 workpapers.',
    icon: 'TrendingDown',
    specialty: 'MACRS depreciation, §179 elections, bonus depreciation strategy',
    avgDurationSec: 14,
    avgTokens: 920,
    timesRun: 0,
    enabled: true,
    outputFormat: 'json',
    systemPrompt: `You are a tax specialist in cost recovery and depreciation planning. MACRS FUNDAMENTALS: Recovery periods (5yr computers/autos, 7yr furniture, 15yr land improvements, 27.5yr residential, 39yr nonresidential). §179 ELECTION: $1,220,000 limit (2024), phases out $1:$1 above $3,050,000. BONUS DEPRECIATION: 60% for 2024, 40% for 2025, 20% for 2026, 0% 2027+. STRATEGY: High income year = max §179+bonus; low income year = longer MACRS; NOL risk = §179 cannot create NOL but bonus can. Return ONLY valid JSON with MACRS schedule per asset, election analysis, and strategy recommendations.`,
  },
  'agent-return-analyzer': {
    id: 'agent-return-analyzer',
    name: 'Business Return Analyzer',
    description: 'Reviews trial balance or P&L and maps income/expense items to Form 1120/1120-S/1065 line items, identifies required M-1/M-3 adjustments, flags missed deductions, and produces a return workpaper checklist.',
    icon: 'ClipboardList',
    specialty: 'Business tax return preparation, M-1 adjustments, missed deductions',
    avgDurationSec: 15,
    avgTokens: 950,
    timesRun: 0,
    enabled: true,
    outputFormat: 'json',
    systemPrompt: `You are a CPA preparing and reviewing business income tax returns. COMMON M-1 ADJUSTMENTS: Federal income taxes (add back), 50% meals limitation, entertainment (100% non-deductible), life insurance premiums, excess depreciation, fines/penalties, political contributions, club dues, excess capital losses, goodwill impairment, stock-based compensation, related party losses, warranty reserves. COMMONLY MISSED DEDUCTIONS: §179, R&D credit §41, WOTC, employee retention credit, §168(k) bonus depreciation, §179D energy efficiency, NOL carryforwards, §382 limitation. Return ONLY valid JSON with return line mapping, M-1 adjustments, missed deductions, and checklist.`,
  },
  'agent-individual-planner': {
    id: 'agent-individual-planner',
    name: 'Individual Tax Planner',
    description: 'Models complete individual tax liability including SE tax, AMT, NIIT, capital gains, and §199A for high-net-worth taxpayers. Calculates estimated tax payments and generates a full tax projection.',
    icon: 'User',
    specialty: 'Individual income tax planning and projection',
    avgDurationSec: 15,
    avgTokens: 950,
    timesRun: 0,
    enabled: true,
    outputFormat: 'json',
    systemPrompt: `You are a CPA specializing in high-net-worth individual tax planning. INDIVIDUAL TAX COMPUTATION: Gross Income > Above-the-Line Deductions = AGI > Standard/Itemized > QBI = Taxable Income > Apply rates (10-37%) > Capital gains tax (0/15/20%) > NIIT (3.8%) > Additional Medicare (0.9%) > AMT > Credits > SE Tax = Total Tax. HIGH-NET-WORTH FOCUS: timing strategies, capital loss harvesting, asset location, qualified opportunity zones, installment sales, charitable remainder trusts, retirement planning, backdoor Roth. Return ONLY valid JSON with full tax projection and 10 specific planning recommendations.`,
  },
  'agent-salt': {
    id: 'agent-salt',
    name: 'SALT Agent',
    description: 'Analyzes state and local tax nexus, apportionment factors, state conformity to federal changes, and multistate filing requirements. Generates state-by-state filing obligation analysis.',
    icon: 'Map',
    specialty: 'State and local tax, nexus, apportionment, and conformity analysis',
    avgDurationSec: 14,
    avgTokens: 920,
    timesRun: 0,
    enabled: true,
    outputFormat: 'json',
    systemPrompt: `You are a SALT specialist with expertise in multistate taxation. NEXUS: Physical (employee/office/property) and Economic (post-Wayfair: $100K sales or 200 transactions). APPORTIONMENT: Traditional three-factor vs modern single-factor (sales only). Market-based sourcing for services. CONFORMITY: Rolling vs static. Common non-conformity areas: bonus depreciation, §179 limits, GILTI/FDII, NOL carryback. PTET: Pass-through entity tax to circumvent $10K SALT cap. Return ONLY valid JSON with nexus analysis, apportionment, conformity issues, and PTET opportunity.`,
  },
  'agent-estate-gift': {
    id: 'agent-estate-gift',
    name: 'Estate & Gift Tax Agent',
    description: 'Analyzes estate size vs exemption, models gift strategies and GRATs, calculates annual exclusion usage, and produces an estate planning strategy memo with quantified tax savings for each strategy.',
    icon: 'Landmark',
    specialty: 'Estate planning, gift tax strategies, and wealth transfer optimization',
    avgDurationSec: 15,
    avgTokens: 950,
    timesRun: 0,
    enabled: true,
    outputFormat: 'json',
    systemPrompt: `You are an estate planning attorney and CPA specializing in wealth transfer strategies. 2024: Exemption $13.61M per person ($27.22M married). SUNSET 12/31/2025 → drops to ~$7M. Annual exclusion $18,000/donee. §7520 rate ~5.4%. KEY STRATEGIES: Annual gifting, ILIT (leveraged wealth transfer), GRAT (growth > §7520 rate transfers tax-free), SLAT (spousal access trust), IDGT (grantor pays income tax = additional gift), QPRT (residence transfer), CRT (charitable remainder), 529 plans (5-year averaging). PORTABILITY: Must file Form 706 to elect DSUE even if no estate tax due. Return ONLY valid JSON with estate tax calculation, strategy menu with savings, and timeline.`,
  },
  'agent-irc-controversy': {
    id: 'agent-irc-controversy',
    name: 'IRS Controversy Agent',
    description: 'Analyzes IRS notices (CP2000, CP3219, 30-day letters, etc.), drafts formal protest letters, calculates accuracy-related penalties, and provides settlement/litigation strategy guidance.',
    icon: 'ShieldAlert',
    specialty: 'IRS examination, appeals, penalty abatement, and controversy resolution',
    avgDurationSec: 15,
    avgTokens: 950,
    timesRun: 0,
    enabled: true,
    outputFormat: 'hybrid',
    systemPrompt: `You are a former IRS Appeals Officer and tax controversy specialist. IRS AUDIT PROCESS: Correspondence Exam (CP2000 most common), Office Exam, Field Exam, Tax Court petition (90-day letter). APPEALS: Available after exam, ~60-70% settlement rate. PENALTIES: §6651 failure to file (5%/month), failure to pay (0.5%/month), §6662 accuracy-related (20%), §6663 fraud (75%). PENALTY ABATEMENT: First Time Abatement (no prior penalties in 3 years), Reasonable Cause (death/illness/disaster). INTEREST: Federal short-term + 3% ≈ 8% (2024), compounded daily. SOL: 3 years general, 6 years if >25% omission, no limit for fraud.`,
  },
  'agent-international-tax': {
    id: 'agent-international-tax',
    name: 'International Tax Agent',
    description: 'Analyzes GILTI, BEAT, FDII, Subpart F income, foreign tax credits, treaty positions, and filing requirements for Forms 5471, 8858, 8865, and FBAR/FATCA obligations.',
    icon: 'Globe',
    specialty: 'International income taxation, TCJA international provisions, cross-border planning',
    avgDurationSec: 16,
    avgTokens: 980,
    timesRun: 0,
    enabled: true,
    outputFormat: 'json',
    systemPrompt: `You are an international tax partner specializing in cross-border transactions and TCJA provisions. GILTI §951A: 10.5% corporate rate after 50% §250 deduction, 80% FTC haircut, high-tax exception >18.9%. BEAT §59A: Applies to corps >$500M avg receipts, 10% minimum tax on taxable income + base erosion payments. FDII §250: 37.5% deduction for domestic corps, effective 13.125% rate on export income. SUBPART F: Passive income of CFC, US shareholders 10%+ must include. FILING: 5471 (foreign corps), 8858 (foreign DEs), 8865 (foreign partnerships), FBAR (>$10K aggregate), 8938 FATCA. Return ONLY valid JSON with international tax exposure, GILTI calculation, and filing requirements.`,
  },
  'agent-tax-planning': {
    id: 'agent-tax-planning',
    name: 'Year-End Tax Planning Agent',
    description: 'Generates proactive year-end tax planning strategies specific to client facts — timing of income/deductions, capital gain/loss harvesting, qualified opportunity zones, §1031 exchanges, and estimated tax true-up.',
    icon: 'CalendarDays',
    specialty: 'Year-end and proactive tax planning across all areas',
    avgDurationSec: 15,
    avgTokens: 960,
    timesRun: 0,
    enabled: true,
    outputFormat: 'json',
    systemPrompt: `You are a tax planning partner generating specific, quantified year-end tax planning strategies. PLANNING FRAMEWORK: 1) DEFER INCOME (delay billing, installment sales, QOZ investments, §1031 exchanges). 2) ACCELERATE DEDUCTIONS (prepay expenses, max §179+bonus depreciation, charitable bunched via DAF, accrue bonuses). 3) CAPITAL GAIN/LOSS HARVESTING (unrealized losses, wash-sale rule §1091, $3K net loss vs ordinary). 4) RETIREMENT CONTRIBUTIONS (401k by 12/31, IRA by 4/15, SEP by due date+extension, solo 401k establish by 12/31). 5) ENTITY-SPECIFIC (S-Corp reasonable comp review, AAA balance, QBI optimization). Quantify every strategy with estimated tax savings. Return ONLY valid JSON ranked by savings.`,
  },
};

export const SEED_CLIENTS: Omit<TaxClient, 'id' | 'clientNumber' | 'createdAt' | 'updatedAt'>[] = [
  {
    clientType: 'BUSINESS', entityType: 'S_CORP', status: 'ACTIVE',
    legalName: 'Meridian Mechanical Services Inc.', ein: '82-1234567', taxYear: 2024,
    naicsCode: '238220', stateOfIncorporation: 'TX', dateIncorporated: '2018-03-12',
    statesFilingIn: ['TX', 'OK', 'LA'],
    primaryContactName: 'Robert Harmon', primaryEmail: 'robert@meridianmech.com', primaryPhone: '214-555-0182',
    mailingAddress: '4820 Industrial Blvd', city: 'Dallas', state: 'TX', zip: '75247',
    responsibleCPA: 'Jennifer Walsh', assignedStaff: ['Michael Torres', 'Alicia Nguyen'],
    lastYearGrossIncome: 4200000, lastYearTaxPaid: 82400,
    electionsOnFile: ['S-Corp election (2018)', '§179 election (2024)', 'Cash basis method'],
    extensionFiled: false, highNetWorth: false, internationalExposure: false, irsAuditHistory: false, priorityClient: true, complexityScore: 3,
    flatFeeAgreement: true, flatFeeAmount: 12500, ytdBilledAmount: 12500,
    notes: 'HVAC contractor operating in TX/OK/LA. Owner Robert Harmon draws $180K salary. 2024 projected net income: $485,000. Strong growth year. Need to optimize S-Corp salary vs distribution for 2024.',
    tags: ['contractor', 's-corp', 'multistate', 'priority'],
  },
  {
    clientType: 'INDIVIDUAL', entityType: 'INDIVIDUAL', status: 'ACTIVE',
    legalName: 'Katherine and James Whitfield', ssn: '***-**-8821', taxYear: 2024,
    statesFilingIn: ['CA'],
    primaryContactName: 'Katherine Whitfield', primaryEmail: 'k.whitfield@gmail.com', primaryPhone: '415-555-0294',
    mailingAddress: '1 Sea Cliff Drive', city: 'San Francisco', state: 'CA', zip: '94121',
    responsibleCPA: 'Jennifer Walsh', assignedStaff: ['Alicia Nguyen'],
    lastYearGrossIncome: 1820000, lastYearTaxPaid: 682000,
    electionsOnFile: ['Donor-Advised Fund (Schwab Charitable)', 'CA PTET elected via partnership'],
    extensionFiled: true, extensionDate: '2025-10-15',
    highNetWorth: true, internationalExposure: false, irsAuditHistory: true, priorityClient: true, complexityScore: 5,
    hourlyRate: 485, ytdBilledHours: 42, ytdBilledAmount: 20370,
    notes: 'MFJ. James: tech exec at Series C startup, $850K W-2 + $400K in RSUs vesting 2024. Katherine: LP in 3 real estate partnerships, K-1s expected. AMT exposure likely. Heavy capital gains from RSU vestings. Estate planning: ~$8.2M net worth — pre-sunset gifting urgent.',
    tags: ['hnw', 'rsu', 'partnership-k1', 'estate-planning', 'ca-resident', 'priority'],
  },
  {
    clientType: 'BUSINESS', entityType: 'C_CORP', status: 'ACTIVE',
    legalName: 'NovaTech Software Solutions Inc.', ein: '47-9283764', taxYear: 2024,
    naicsCode: '511210', stateOfIncorporation: 'DE', dateIncorporated: '2020-09-15',
    statesFilingIn: ['DE', 'TX', 'NY', 'CA', 'WA'],
    primaryContactName: 'Priya Patel', primaryEmail: 'priya@novatechsoftware.com', primaryPhone: '512-555-0341',
    mailingAddress: '800 Congress Ave, Suite 1400', city: 'Austin', state: 'TX', zip: '78701',
    responsibleCPA: 'David Kim', assignedStaff: ['Michael Torres'],
    lastYearGrossIncome: 8500000, lastYearTaxPaid: 215000,
    electionsOnFile: ['DE C-Corp (no S-Corp election)', 'Accrual basis', 'R&D credit election (§41)'],
    extensionFiled: false, highNetWorth: false, internationalExposure: true, irsAuditHistory: false, priorityClient: false, complexityScore: 4,
    hourlyRate: 425, ytdBilledHours: 38, ytdBilledAmount: 16150,
    notes: 'B2B SaaS — $8.5M ARR. Raised Series A ($12M). 65 employees. §174 R&D capitalization issue for 2022+ (large software development costs that must now be amortized 5 years). §41 R&D credit available. Multistate nexus analysis needed (employees in 5 states). QSBS §1202 eligibility check needed for founders.',
    tags: ['saas', 'c-corp', 'r&d-credit', 'multistate', 'qsbs', 'series-a'],
  },
  {
    clientType: 'BUSINESS', entityType: 'PARTNERSHIP', status: 'ACTIVE',
    legalName: 'Skyline Real Estate Partners LP', ein: '36-4820193', taxYear: 2024,
    naicsCode: '531120', stateOfIncorporation: 'TX', dateIncorporated: '2019-06-01',
    statesFilingIn: ['TX', 'CO', 'TN'],
    primaryContactName: 'Marcus Webb', primaryEmail: 'mwebb@skylinepartnerstx.com', primaryPhone: '972-555-0418',
    mailingAddress: '3200 McKinney Ave, Suite 800', city: 'Dallas', state: 'TX', zip: '75204',
    responsibleCPA: 'Jennifer Walsh', assignedStaff: ['Alicia Nguyen', 'Michael Torres'],
    lastYearGrossIncome: 3100000, lastYearTaxPaid: 0,
    electionsOnFile: ['§754 election in effect (2021)', '§168(k) bonus depreciation (2024)', 'Calendar year'],
    extensionFiled: false, highNetWorth: false, internationalExposure: false, irsAuditHistory: false, priorityClient: false, complexityScore: 4,
    hourlyRate: 395, ytdBilledHours: 28, ytdBilledAmount: 11060,
    notes: 'Commercial real estate LP — 3 industrial properties (TX x2, CO x1). Significant depreciation deductions creating ordinary losses for partners. §754 election active. Need cost segregation study on CO property acquired 2024 ($18.2M). 8 limited partners + 2 GPs. K-1 delivery is priority in March.',
    tags: ['real-estate', 'partnership', 'cost-segregation', 'k1', '§754'],
  },
];

export const SEED_RETURNS: Omit<TaxReturn, 'id' | 'returnNumber' | 'createdAt' | 'updatedAt' | 'clientId'>[] = [
  {
    clientName: 'Meridian Mechanical Services Inc.', entityType: 'S_CORP', taxYear: 2024, status: 'IN_PROGRESS', form: '1120-S',
    grossIncome: 4850000, taxableIncome: 485000, totalTaxLiability: 0, taxesPaid: 0, taxDueOrRefund: 0,
    schedulesIncluded: ['Schedule K', 'Schedule K-1 (3 shareholders)', 'Form 4562', 'Schedule M-1', 'Schedule M-2'],
    originalDueDate: '2025-03-17', extensionDueDate: '2025-09-15', extensionFiled: false,
    preparedBy: 'Michael Torres', budgetedHours: 28, actualHours: 16, aiAnalysisDone: true,
    aiFlags: [
      '§163(j) interest limitation may apply — review loan balances and interest expense',
      'Owner salary ($180K) may be low for $485K S-Corp income — reasonable comp analysis recommended',
      'Multistate apportionment: TX is no-income-tax, but OK and LA require separate apportionment',
      '§179 election opportunity: $120K equipment purchased Q4 — maximize to reduce income',
      'QBI deduction check: owner taxable income near phase-in threshold',
    ],
    prepNotes: 'Waiting on bank statements for Dec reconciliation. Owner W-2 finalized at $180K.',
    reviewNotes: '', clientNotes: 'Client wants K-1s to all three shareholders by March 10.',
    tags: ['s-corp', '1120-s', 'in-progress'],
  },
  {
    clientName: 'Katherine and James Whitfield', entityType: 'INDIVIDUAL', taxYear: 2024, status: 'REVIEW', form: '1040',
    grossIncome: 1820000, adjustedGrossIncome: 1740000, taxableIncome: 1695000, totalTaxLiability: 682000, taxesPaid: 620000, taxDueOrRefund: 62000,
    schedulesIncluded: ['Schedule A', 'Schedule B', 'Schedule D', 'Schedule E', 'Form 4970', 'Form 6251 (AMT)', 'Form 8949', 'NIIT Form 8960'],
    originalDueDate: '2025-04-15', extensionDueDate: '2025-10-15', extensionFiled: true,
    preparedBy: 'Alicia Nguyen', reviewedBy: 'Jennifer Walsh', datePrepCompleted: '2024-09-15',
    budgetedHours: 55, actualHours: 62, aiAnalysisDone: true,
    aiFlags: [
      'AMT triggered — $38,000 AMT liability calculated. ISO exercise in Q2 is key driver.',
      'NIIT: $64,600 net investment income tax (3.8% × $1.7M NII)',
      'Estate planning URGENT: $8.2M net worth vs $7M post-2025 exemption — gift strategy needed before 12/31/2025',
      'CA PTET election available on partnership K-1 — $14,200 federal benefit not yet captured',
      'RSU vesting: $400K ordinary income properly withheld at 37% — confirmed',
    ],
    prepNotes: 'All K-1s received. RSU W-2 supplemental from employer confirms $400K. AMT calculated on ISO spread from ABC Corp exercise in May.',
    reviewNotes: 'Reviewed by JW 9/15. Tax due of $62K surprises client — need to communicate NIIT + AMT. Recommend planning meeting before year end 2024.',
    clientNotes: 'Client should wire $62K by Oct 15. Schedule planning meeting October.',
    tags: ['individual', 'hnw', 'amt', 'niit', 'rsu', 'review'],
  },
  {
    clientName: 'NovaTech Software Solutions Inc.', entityType: 'C_CORP', taxYear: 2024, status: 'NOT_STARTED', form: '1120',
    grossIncome: 8500000, taxableIncome: 2100000, totalTaxLiability: 441000, taxesPaid: 0, taxDueOrRefund: 441000,
    schedulesIncluded: ['Form 4562', 'Schedule M-1', 'Schedule M-3', 'Form 5471 (subsidiary)', 'Form 8991 (BEAT)'],
    originalDueDate: '2025-04-15', extensionDueDate: '2025-10-15', extensionFiled: false,
    budgetedHours: 45, actualHours: 0, aiAnalysisDone: false,
    prepNotes: '', reviewNotes: '', clientNotes: 'R&D credit documentation needed from engineering. §174 amortization schedule for 2022-2023 costs.',
    tags: ['c-corp', '1120', 'not-started'],
  },
  {
    clientName: 'Skyline Real Estate Partners LP', entityType: 'PARTNERSHIP', taxYear: 2024, status: 'IN_PROGRESS', form: '1065',
    grossIncome: 3100000, taxableIncome: -420000, totalTaxLiability: 0, taxesPaid: 0, taxDueOrRefund: 0,
    schedulesIncluded: ['Schedule K', 'Schedule K-1 (10 partners)', 'Form 4562', 'Schedule M-1', 'Form 8825'],
    originalDueDate: '2025-03-17', extensionDueDate: '2025-09-15', extensionFiled: false,
    preparedBy: 'Alicia Nguyen', budgetedHours: 35, actualHours: 22, aiAnalysisDone: true,
    aiFlags: [
      'Cost segregation study recommended for CO property — potential $3.2M reclassification to 5/7/15-year',
      '§754 election in effect — confirm no partner transfers in 2024 requiring basis adjustment',
      'Passive activity loss limitation may apply to limited partners — verify material participation',
      'Guaranteed payments to GPs: $240K — subject to SE tax',
    ],
    prepNotes: 'Waiting on final depreciation schedule from cost segregation vendor. K-1 allocations per partnership agreement verified.',
    reviewNotes: '', clientNotes: 'K-1s needed by March 10 for partner filing deadlines.',
    tags: ['partnership', '1065', 'real-estate', 'in-progress'],
  },
];

export const SEED_RESEARCH_MEMOS: Omit<TaxResearchMemo, 'id' | 'memoNumber' | 'createdAt' | 'updatedAt'>[] = [
  {
    clientId: 'placeholder', clientName: 'NovaTech Software Solutions Inc.', taxYear: 2024, status: 'FINAL',
    questionType: 'DEDUCTIBILITY', questionSummary: '§174 R&D Capitalization — Software Development Costs',
    questionDetail: 'NovaTech incurred $2.8M in domestic software development costs in 2022 and 2023. Under the TCJA amendment to §174, effective for tax years beginning after 12/31/2021, are these costs required to be capitalized and amortized over 5 years (domestic) rather than deducted currently?',
    applicableTaxYear: 2024,
    primaryIRCSections: ['§174', '§174(a)', '§174(c)', '§56A'],
    relatedRegulations: ['Treas. Reg. §1.174-1', 'Treas. Reg. §1.174-2'],
    revenueRulings: ['Notice 2023-63'],
    plrs: [], courtCases: [],
    conclusion: 'Under §174 as amended by the TCJA (effective 2022), NovaTech MUST capitalize and amortize domestic R&E expenditures (including software development costs) over 60 months (5 years), beginning with the midpoint of the taxable year costs are first paid or incurred. The $2.8M incurred in 2022 generates only $280K of amortization in 2022.',
    confidenceLevel: 'HIGH', riskLevel: 'MINIMAL',
    preparedBy: 'David Kim', reviewedBy: 'Jennifer Walsh',
    memoContent: "# TAX RESEARCH MEMORANDUM\n\n**MEMO NUMBER:** MEMO-2024-0041\n**DATE:** November 15, 2024\n**TO:** NovaTech Software Solutions Inc. File\n**FROM:** David Kim, CPA\n**RE:** Section 174 R&D Expenditures - Capitalization Requirement for Software Development Costs\n\n---\n\n## ISSUE\n\nWhether NovaTech's software development costs incurred in tax years beginning after December 31, 2021 must be capitalized and amortized under Section 174 as amended by the TCJA.\n\n## FACTS\n\nNovaTech Software Solutions Inc. is a Delaware C-Corporation using the accrual method of accounting and a calendar tax year. In 2022, the Company incurred $1.8 million in domestic software development costs, and in 2023, an additional $1.0 million.\n\n## APPLICABLE LAW\n\n**Section 174 (As Amended by TCJA):**\n\nPrior to the TCJA, Section 174(a) allowed taxpayers to elect to deduct R&E expenditures currently. The TCJA amended Section 174(a) to require capitalization for all specified R&E expenditures paid or incurred in taxable years beginning after December 31, 2021.\n\n- Domestic R&E expenditures: amortize over 60 months (midpoint convention)\n- Foreign R&E expenditures: amortize over 180 months (15 years)\n- Software development costs are explicitly included as R&E under Section 174(c)(3)\n\n## ANALYSIS\n\n**1. Mandatory Capitalization Applies.** Because NovaTech's tax years at issue (2022 and 2023) begin after December 31, 2021, the amended Section 174 applies.\n\n**2. Software Development Costs Included.** Section 174(c)(3) explicitly includes any amount paid or incurred in connection with the development of any software.\n\n**3. 60-Month Amortization.**\n\n**2022 Costs ($1,800,000):**\n- Annual amortization: $1,800,000 / 60 = $30,000/month\n- 2022 (6 months): $180,000\n- 2023-2026 (12 months each): $360,000/year\n- 2027 (6 months): $180,000\n\n## CONCLUSION\n\nNovaTech must capitalize and amortize 100% of its domestic software development costs. The combined deduction for 2022 is $180,000 (vs. $1,800,000 under prior law) - a $1,620,000 unfavorable book-to-tax difference.\n\n**Confidence Level:** HIGH - statutory language is unambiguous.\n\n## RECOMMENDATIONS\n\n1. Prepare Form 3115 (Application for Change in Accounting Method) for 2022 if not yet filed.\n2. Prepare Section 481(a) adjustment reflecting cumulative catch-up.\n3. Evaluate R&D credit (Section 41) as partial offset.\n4. Monitor congressional activity - multiple proposals to restore current deductibility.",
    tags: ['§174', 'r&d', 'software', 'capitalization', 'tcja'],
  },
  {
    clientId: 'placeholder', clientName: 'Meridian Mechanical Services Inc.', taxYear: 2024, status: 'FINAL',
    questionType: 'ENTITY', questionSummary: 'S-Corp Reasonable Compensation Analysis',
    questionDetail: 'Meridian Mechanical Services Inc. is an S-Corp with $485,000 net income. The owner, Robert Harmon, takes $180,000 W-2 salary and $305,000 distributions. Is this salary reasonable under IRS standards?',
    applicableTaxYear: 2024,
    primaryIRCSections: ['§1366', '§162(a)(1)'],
    relatedRegulations: ['Treas. Reg. §1.1366-2', 'Treas. Reg. §1.162-7'],
    revenueRulings: ['Rev. Rul. 74-44'],
    plrs: [], courtCases: ['Watson v. Commissioner, 668 F.3d 1008 (8th Cir. 2012)', 'Sean McAlary Ltd. Inc. v. Commissioner, T.C. Summary Opinion 2013-62'],
    conclusion: 'At $180,000 salary against $485,000 S-Corp net income with a 40% distribution ratio, the reasonable compensation position is defensible but near the lower boundary of what the IRS might accept. The Eighth Circuit in Watson held that $93,000 was unreasonable for an attorney generating $2.3M in billings. A salary of $200,000-$220,000 would provide a stronger defensible position.',
    confidenceLevel: 'MODERATE', riskLevel: 'MODERATE',
    preparedBy: 'Jennifer Walsh', reviewedBy: 'David Kim',
    memoContent: "# TAX RESEARCH MEMORANDUM\n\n**RE:** S-Corp Reasonable Compensation - Robert Harmon\n\n## ISSUE\n\nWhether Robert Harmon's $180,000 W-2 salary from Meridian Mechanical Services Inc. (S-Corp) is reasonable given $485,000 net income.\n\n## APPLICABLE LAW\n\nS-Corp shareholders who perform services must receive reasonable compensation subject to FICA taxes. Rev. Rul. 74-44 established that distributions in lieu of salary may be recharacterized as wages.\n\n## KEY CASES\n\n- **Watson v. Commissioner (8th Cir. 2012):** Attorney with $2.3M billings took $93,000 salary - court found unreasonable and reclassified distributions as wages.\n- **Sean McAlary Ltd. (T.C. 2013):** Real estate agent took $24,000 salary with $200K+ distributions - court applied independent investor test and found salary unreasonable.\n\n## ANALYSIS\n\nReasonable compensation factors:\n1. **Duties and responsibilities** - Owner manages all operations, 60+ hours/week\n2. **Business size and complexity** - $4.85M revenue, 28 employees, multistate\n3. **Industry comparisons** - HVAC contractor CEOs in TX: $150K-$280K\n4. **Compensation vs distributions ratio** - 37% salary / 63% distribution\n\n## CONCLUSION\n\nDefensible but near lower boundary. Recommend increasing to $200,000-$220,000 for stronger position.",
    tags: ['s-corp', 'reasonable-compensation', '§1366', 'entity'],
  },
];

export function seedAllData() {
  try {
    const alreadySeeded = localStorage.getItem('taxmind-seeded');
    if (alreadySeeded) return;
  } catch {
    // localStorage not available
  }

  // Seed agents
  const agentStore = useAgentStore.getState();
  Object.values(TAX_AGENTS).forEach(agent => {
    agentStore.agents[agent.id] = agent;
  });

  // Seed clients
  const clientStore = useClientStore.getState();
  SEED_CLIENTS.forEach(c => clientStore.addClient(c));
  const clients = Object.values(clientStore.clients);

  // Seed returns
  const returnStore = useReturnStore.getState();
  SEED_RETURNS.forEach((r, i) => {
    returnStore.addReturn({ ...r, clientId: clients[i % clients.length].id });
  });

  // Seed research memos
  const researchStore = useResearchStore.getState();
  SEED_RESEARCH_MEMOS.forEach((m, i) => {
    researchStore.addMemo({ ...m, clientId: clients[i % clients.length].id });
  });

  try {
    localStorage.setItem('taxmind-seeded', 'true');
  } catch {
    // localStorage not available
  }
}
