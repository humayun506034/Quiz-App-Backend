export interface Question {
  id: string;
  question: string;
  options: string[];
  domain: string;
  weight: number;
  isInverted: boolean;
  isFollowUp: boolean;
  dashboardDomain: string;
  dashboardDomainMaxPossibleScore: number;
  dashboardDomainWeight: number;
}
