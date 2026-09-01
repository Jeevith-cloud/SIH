export interface Scheme {
  id: string;
  name: string;
  category: "Crop Loan" | "Investment" | "Machinery" | "Subsidy" | "Quick Credit";
  provider: string;
  baseInterestRate: number; // e.g. 7.0 for 7%
  effectiveInterestRate: number; // e.g. 4.0 for 4% after subsidy
  maxAmount: number; // in Rupees
  maxTenureMonths: number;
  subsidyPercentage?: number; // Government subsidy on asset cost if applicable
  interestSubvention?: number; // interest reduction for timely repayment
  collateralRequired: boolean;
  collateralThreshold?: number; // amount above which collateral is required (e.g. 160000 for KCC)
  description: string;
  eligibilityDescription: string;
  whyThisSchemeRules: {
    minLandAcres?: number;
    maxLandAcres?: number;
    preferredCrops?: string[];
    preferredStates?: string[];
    preferredPurpose?: string[];
  };
  keyBenefits: string[];
  requiredDocuments: {
    id: string;
    name: string;
    description: string;
    isRequired: boolean;
  }[];
  detailedDescription: string;
  confidence?: number; // Backend ML confidence score (0.0 to 1.0)
  reasons?: string[]; // Backend eligibility reasons
  backendEmi?: number; // Backend calculated EMI
}

export const schemes: Scheme[] = [
  {
    id: "kisan-credit-card",
    name: "Kisan Credit Card (KCC)",
    category: "Crop Loan",
    provider: "Ministry of Agriculture & Govt of India",
    baseInterestRate: 7.0,
    effectiveInterestRate: 4.0,
    maxAmount: 300000,
    maxTenureMonths: 60,
    interestSubvention: 3.0, // 3% prompt repayment subvention
    collateralRequired: false,
    collateralThreshold: 160000,
    description: "Short-term credit for cultivation, post-harvest expenses, and farm maintenance at highly subsidized interest rates.",
    eligibilityDescription: "All farmers (owner-cultivators, tenant farmers, sharecroppers, self-help groups). No collateral up to ₹1.6 Lakhs.",
    whyThisSchemeRules: {
      preferredPurpose: ["Seed & Fertilizer Purchase", "General Crop Cultivation", "Daily Farm Expenses"]
    },
    keyBenefits: [
      "Extremely low interest rate of 4% p.a. on prompt repayment",
      "Flexible repayment aligned with harvesting season",
      "No collateral check required for loans up to ₹1.6 Lakhs",
      "Includes crop insurance cover against natural calamities"
    ],
    requiredDocuments: [
      { id: "aadhaar", name: "Aadhaar Card", description: "Proof of identity and address matching the bank account.", isRequired: true },
      { id: "land-record", name: "Land Holding Proof (7/12 Extract, Patta)", description: "Certified document proving ownership or cultivation rights.", isRequired: true },
      { id: "crop-cert", name: "Crop Cultivation Certificate", description: "Self-declaration or patwari report of crops sown.", isRequired: true },
      { id: "bank-passbook", name: "Bank Passbook", description: "Copy of passbook showing last 6 months transactions.", isRequired: true }
    ],
    detailedDescription: "The Kisan Credit Card (KCC) scheme is a landmark credit delivery initiative designed to shield farmers from informal high-interest money lenders. The Government of India provides a 2% interest subvention to banks, reducing the rate from 9% to 7%. An additional 3% subvention is offered to farmers who repay their dues on time, bringing the interest rate down to an unmatched 4% per annum."
  },
  {
    id: "pm-kusum-solar-pump",
    name: "PM-KUSUM Solar Pump Subsidy",
    category: "Subsidy",
    provider: "Ministry of New & Renewable Energy (MNRE)",
    baseInterestRate: 9.5,
    effectiveInterestRate: 5.5,
    maxAmount: 500000,
    maxTenureMonths: 84,
    subsidyPercentage: 60.0, // 60% total subsidy (30% central + 30% state)
    collateralRequired: true,
    description: "Huge 60% government subsidy to install grid-connected or standalone solar pumps, cutting diesel fuel costs.",
    eligibilityDescription: "Individual farmers, cooperative societies, and water user associations with secure water source access.",
    whyThisSchemeRules: {
      preferredPurpose: ["Borewell & Irrigation", "Solar Pump Installation"]
    },
    keyBenefits: [
      "60% direct government subsidy (Farmer pays only 10%, remaining 30% is bank loan)",
      "Zero electricity bills for irrigation",
      "Sell excess solar energy back to the grid for extra seasonal income",
      "Reduces dependency on diesel generator pumps"
    ],
    requiredDocuments: [
      { id: "aadhaar", name: "Aadhaar Card", description: "Identity proof of land owner.", isRequired: true },
      { id: "land-record", name: "Land Registry Documents", description: "Clear title deed indicating ownership.", isRequired: true },
      { id: "borewell-proof", name: "Borewell/Water Source Certificate", description: "Proof of functional well, borewell or canal access.", isRequired: true },
      { id: "electricity-bill", name: "NOC from Electricity Board", description: "No objection certificate from state DISCOM for grid ties.", isRequired: false }
    ],
    detailedDescription: "PM-KUSUM (Component B & C) provides massive financial assistance to solarize agriculture. The scheme provides up to 60% subsidy on solar agricultural pumps. The farmer is required to contribute only 10% of the cost upfront, and banks offer low-interest financing for the remaining 30%, which is repaid from the energy savings and grid sales."
  },
  {
    id: "nabard-acabc-scheme",
    name: "Agri-Clinics & Agri-Business Centers",
    category: "Investment",
    provider: "NABARD & Ministry of Agriculture",
    baseInterestRate: 11.5,
    effectiveInterestRate: 7.2,
    maxAmount: 2000000,
    maxTenureMonths: 120,
    subsidyPercentage: 36.0, // 36% subsidy for general category, 44% for women/SC/ST
    collateralRequired: true,
    description: "Startup loan for setting up agriculture clinics, seed dealerships, custom hiring centers, and soil testing labs.",
    eligibilityDescription: "Graduates, diplomaholders, or high-school certificate holders in agriculture and allied subjects.",
    whyThisSchemeRules: {
      minLandAcres: 0, // open to landless graduates
      preferredPurpose: ["Agri-Business Startup", "Farm Mechanization & Machinery"]
    },
    keyBenefits: [
      "36% capital subsidy for General Category (44% for Women, SC/ST, and Hill States)",
      "Long repayment tenure up to 10 years with up to 2 years moratorium",
      "Refinanced by NABARD through commercial and rural banks",
      "Free 45-day residential entrepreneurship training program before loan dispatch"
    ],
    requiredDocuments: [
      { id: "aadhaar", name: "Aadhaar Card", description: "Applicant's identification document.", isRequired: true },
      { id: "agri-degree", name: "Agri-Degree/Diploma Certificate", description: "Proof of eligibility qualification in agriculture/allied field.", isRequired: true },
      { id: "dpr", name: "Detailed Project Report (DPR)", description: "Feasibility and business plan details for the proposed venture.", isRequired: true },
      { id: "training-cert", name: "MANAGE Training Certificate", description: "Completion certificate from national training partner.", isRequired: true }
    ],
    detailedDescription: "The ACABC scheme aims to tap into the potential of educated agricultural youth to provide extension services directly to farmers. The venture can include soil testing laboratories, agricultural clinic consultation desks, maintenance workshops, crop input shops, or custom cold-storage links. NABARD provides capital subsidy directly back to the loan account."
  },
  {
    id: "agri-gold-loan",
    name: "Agricultural Gold Loan",
    category: "Quick Credit",
    provider: "Leading Commercial & Public Sector Banks",
    baseInterestRate: 7.0,
    effectiveInterestRate: 7.0,
    maxAmount: 2500000,
    maxTenureMonths: 12,
    collateralRequired: true, // gold is collateral
    description: "Instant crop and general farming credit against gold ornaments with minimal documentation and immediate disbursal.",
    eligibilityDescription: "Any farmer with gold jewelry. No complex land title searches required. Instant approval.",
    whyThisSchemeRules: {
      preferredPurpose: ["Seed & Fertilizer Purchase", "General Crop Cultivation", "Daily Farm Expenses"]
    },
    keyBenefits: [
      "Same-day processing and cash disbursal (usually under 2 hours)",
      "Zero processing fees in public sector banks up to ₹2 Lakhs",
      "Bullet repayment option (repay principal + interest at the end of the year)",
      "Lower interest rate compared to personal gold loans"
    ],
    requiredDocuments: [
      { id: "aadhaar", name: "Aadhaar Card / Voter ID", description: "Identity proof.", isRequired: true },
      { id: "gold-eval", name: "Gold Weight & Purity Certificate", description: "Evaluated on the spot by the bank appraiser.", isRequired: true },
      { id: "land-possession", name: "Proof of Cultivation/Land Holding", description: "Simple declaration, land record copy, or tenant contract.", isRequired: true }
    ],
    detailedDescription: "Agricultural Gold Loans offer the fastest turnaround times in rural banking. By pledging gold jewelry as security, farmers bypass the extensive land valuation, hypothecation, and legal title verification processes. This makes it ideal for emergency requirements during sowing cycles or when quick cash is needed for input supplies."
  },
  {
    id: "tractor-mechanization-loan",
    name: "Tractor & Farm Equipment Loan",
    category: "Machinery",
    provider: "Public Sector & Private Banks",
    baseInterestRate: 11.0,
    effectiveInterestRate: 9.5,
    maxAmount: 1000000,
    maxTenureMonths: 84,
    collateralRequired: true, // tractor is hypothecated
    description: "Finance for purchasing new or used tractors, harvesters, power tillers, and major crop processing implements.",
    eligibilityDescription: "Farmers owning at least 2 to 3 acres of perennial irrigated land. Monthly/seasonal income stream.",
    whyThisSchemeRules: {
      minLandAcres: 2.0,
      preferredPurpose: ["Farm Mechanization & Machinery"]
    },
    keyBenefits: [
      "Up to 90% funding of the tractor ex-showroom price",
      "Flexible repayment options matching harvest crop seasons (quarterly or half-yearly)",
      "Hypothecation of the tractor itself serves as primary security",
      "Quick verification and fast delivery within 3-5 working days"
    ],
    requiredDocuments: [
      { id: "aadhaar", name: "Aadhaar Card", description: "Primary ID verification.", isRequired: true },
      { id: "land-ownership", name: "RoR / Jamabandi / 7-12 Extract", description: "Proving land holding size for validation of tractor utility.", isRequired: true },
      { id: "quotation", name: "Proforma Invoice & Dealer Quotation", description: "Quotation from the authorized tractor dealer.", isRequired: true },
      { id: "bank-stmt", name: "12-Month Bank Statement", description: "Showing income transactions and repayment capability.", isRequired: true }
    ],
    detailedDescription: "Tractor and Farm Mechanization loans enable modern cultivation practices. These loans cover a wide array of tools: tractors, power-tillers, combine harvesters, rotavators, and laser land-levelers. Repayments are structured around cropping cycles (Kharif and Rabi seasons) rather than strict monthly schedules."
  }
];
