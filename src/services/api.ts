import type { SEERAPIRequest, SEERAPIResponse, SurvivalData, LikelihoodOfCure } from '@/types';

/**
 * SEER API Service
 *
 * This module provides the API contract for the SEER database integration.
 * Currently uses mock data - replace with actual SEER API calls when available.
 */

// Simulated network delay
const MOCK_DELAY = 800;

/**
 * Fetch survival data from SEER API
 * Currently returns realistic mock data based on cancer stage
 */
export async function fetchSurvivalData(
  _request: SEERAPIRequest
): Promise<SEERAPIResponse> {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  // Generate realistic mock data based on stage
  const { survivalData, likelihoodOfCure } = getBaseSurvivalByStage(_request.stage);

  return {
    survivalData,
    likelihoodOfCure,
    confidenceInterval: {
      lower: 0.85,
      upper: 0.95,
    },
  };
}

function getBaseSurvivalByStage(stage: string): { survivalData: SurvivalData; likelihoodOfCure: LikelihoodOfCure } {
  switch (stage) {
    case 'Stage 1 - Localized':
      return {
        likelihoodOfCure: 'Likely (>75%)',
        survivalData: {
          timeframes: { sixMonth: 99, oneYear: 98, twoYear: 96, fiveYear: 90 },
          distribution: { worstCase: 3, typical: 77, bestCase: 20 },
        },
      };
    case 'Stage 2 - Localized':
      return {
        likelihoodOfCure: 'Possible (25-75%)',
        survivalData: {
          timeframes: { sixMonth: 95, oneYear: 90, twoYear: 82, fiveYear: 70 },
          distribution: { worstCase: 8, typical: 72, bestCase: 20 },
        },
      };
    case 'Stage 3 - Regional':
      return {
        likelihoodOfCure: 'Unlikely (<25%)',
        survivalData: {
          timeframes: { sixMonth: 80, oneYear: 68, twoYear: 52, fiveYear: 30 },
          distribution: { worstCase: 18, typical: 62, bestCase: 20 },
        },
      };
    case 'Stage 4 - Metastatic':
      return {
        likelihoodOfCure: 'Very unlikely (<1%)',
        survivalData: {
          timeframes: { sixMonth: 50, oneYear: 30, twoYear: 15, fiveYear: 5 },
          distribution: { worstCase: 30, typical: 60, bestCase: 10 },
        },
      };
    default:
      return {
        likelihoodOfCure: 'Possible (25-75%)',
        survivalData: {
          timeframes: { sixMonth: 75, oneYear: 60, twoYear: 50, fiveYear: 35 },
          distribution: { worstCase: 20, typical: 60, bestCase: 20 },
        },
      };
  }
}

/**
 * Calculate survival statistics from raw percentages
 * Used to compute the "100 People" visualization
 */
export function calculateSurvivalDistribution(survivalRate: number) {
  return {
    survived: Math.round(survivalRate),
    didNotSurvive: 100 - Math.round(survivalRate),
  };
}
