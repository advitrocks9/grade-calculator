export interface DistributionBucket {
  lower: number;
  upper: number;
  count: number;
}

export interface AssessmentDistribution {
  buckets: DistributionBucket[];
  totalCount: number;
  mean: number;
  median: number;
}

export interface DistributionsResponse {
  distributions: Record<string, AssessmentDistribution>;
  generatedAt: string;
}
