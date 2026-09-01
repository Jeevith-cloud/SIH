import { Scheme, schemes as fallbackSchemes } from "../data/schemes";
import { IntakeData } from "../components/IntakeForm";

export interface BackendRecommendationItem {
  scheme: string;
  scheme_id?: string;
  confidence: number;
  reasons: string[];
  emi: number;
  documents: { document: string; status: boolean }[] | string[];
  category?: "Crop Loan" | "Investment" | "Machinery" | "Subsidy" | "Quick Credit";
  provider?: string;
  base_interest_rate?: number;
  effective_interest_rate?: number;
  max_amount?: number;
  max_tenure_months?: number;
  subsidy_percentage?: number;
  interest_subvention?: number;
  collateral_required?: boolean;
  collateral_threshold?: number;
  description?: string;
  eligibility_description?: string;
  key_benefits?: string[];
  detailed_description?: string;
}

export interface BackendRecommendationResponse {
  results: BackendRecommendationItem[];
}

export interface RecommendationResult {
  schemes: Scheme[];
  isLive: boolean;
  error?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function fetchSchemeRecommendations(intakeData: IntakeData): Promise<RecommendationResult> {
  const sector =
    intakeData.purpose === "Agri-Business Startup"
      ? "Agribusiness"
      : intakeData.crop === "Agri-clinic Setup"
      ? "Agribusiness"
      : "Agriculture";

  const payload = {
    state: intakeData.state,
    sector: sector,
    loan_amount: Number(intakeData.amount),
    land_size: Number(intakeData.landAcres),
    category: "General",
    district: "Rural",
    annual_income: 150000,
    farmer_name: "Farmer",
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`${API_BASE_URL}/recommend/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`API returned status ${response.status}: ${errorText || response.statusText}`);
    }

    const data: BackendRecommendationResponse = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error("No schemes recommended by backend.");
    }

    // Map backend results to frontend Scheme objects
    const mappedSchemes: Scheme[] = data.results.map((item) => {
      // Look for a matching template from fallbackSchemes by id or name
      const matchedLocal = fallbackSchemes.find(
        (s) =>
          (item.scheme_id && s.id.toLowerCase() === item.scheme_id.toLowerCase()) ||
          s.name.toLowerCase() === item.scheme.toLowerCase() ||
          s.name.toLowerCase().includes(item.scheme.toLowerCase()) ||
          item.scheme.toLowerCase().includes(s.name.toLowerCase())
      );

      if (matchedLocal) {
        return {
          ...matchedLocal,
          confidence: item.confidence,
          reasons: item.reasons,
          backendEmi: item.emi,
          baseInterestRate: item.base_interest_rate ?? matchedLocal.baseInterestRate,
          effectiveInterestRate: item.effective_interest_rate ?? matchedLocal.effectiveInterestRate,
          maxAmount: item.max_amount ?? matchedLocal.maxAmount,
          maxTenureMonths: item.max_tenure_months ?? matchedLocal.maxTenureMonths,
          subsidyPercentage: item.subsidy_percentage ?? matchedLocal.subsidyPercentage,
          interestSubvention: item.interest_subvention ?? matchedLocal.interestSubvention,
          collateralRequired: item.collateral_required ?? matchedLocal.collateralRequired,
          collateralThreshold: item.collateral_threshold ?? matchedLocal.collateralThreshold,
          description: item.description || matchedLocal.description,
          keyBenefits: item.key_benefits && item.key_benefits.length > 0 ? item.key_benefits : matchedLocal.keyBenefits,
          detailedDescription: item.detailed_description || matchedLocal.detailedDescription,
        };
      }

      // If not in local catalog, construct a full Scheme object from backend
      const schemeId = item.scheme_id || item.scheme.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return {
        id: schemeId,
        name: item.scheme,
        category: item.category || "Crop Loan",
        provider: item.provider || "Government of India / NABARD",
        baseInterestRate: item.base_interest_rate ?? 7.0,
        effectiveInterestRate: item.effective_interest_rate ?? 4.0,
        maxAmount: item.max_amount ?? intakeData.amount,
        maxTenureMonths: item.max_tenure_months ?? 36,
        subsidyPercentage: item.subsidy_percentage,
        interestSubvention: item.interest_subvention,
        collateralRequired: item.collateral_required ?? false,
        collateralThreshold: item.collateral_threshold ?? 160000,
        description: item.description || `Government scheme for ${sector} support.`,
        eligibilityDescription: item.eligibility_description || "Available to farmers meeting regional guidelines.",
        whyThisSchemeRules: {},
        keyBenefits: item.key_benefits && item.key_benefits.length > 0 ? item.key_benefits : [
          "Low subsidized interest rate",
          "Government-backed scheme with transparent terms",
          "Direct benefit support for farmers",
        ],
        requiredDocuments: (Array.isArray(item.documents) ? item.documents : []).map((doc, idx) => {
          const docName = typeof doc === "string" ? doc : doc.document || `Document ${idx + 1}`;
          return {
            id: `doc-${idx}`,
            name: docName,
            description: `Verification document for ${item.scheme}`,
            isRequired: true,
          };
        }),
        detailedDescription: item.detailed_description || item.description || `Official scheme for ${item.scheme}`,
        confidence: item.confidence,
        reasons: item.reasons,
        backendEmi: item.emi,
      };
    });

    return {
      schemes: mappedSchemes,
      isLive: true,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to connect to backend recommendation service";
    console.warn("Backend recommendation error, falling back to local schemes:", message);
    return {
      schemes: fallbackSchemes,
      isLive: false,
      error: message,
    };
  }
}
