export type ModuleCode =
  | "MATH40002"
  | "MATH40004"
  | "MATH40012"
  | "COMP40012"
  | "COMP40008"
  | "COMP40009"
  | "MATH40009";

export type ModuleCategory = "maths" | "computing";

export type Assessment = {
  id: string;
  name: string;
  weight: number;
  term: string;
  moduleCode: ModuleCode;
};

export type Module = {
  code: ModuleCode;
  name: string;
  ects: number;
  category: ModuleCategory;
  assessments: Assessment[];
  isPassFail: boolean;
  isZeroWeighted: boolean;
};

export type GradeMap = Record<string, number | null>;

export type ModuleResult = {
  code: ModuleCode;
  currentGrade: number | null;
  minPossible: number;
  maxPossible: number;
  enteredWeight: number;
  totalWeight: number;
};

export type Classification = "First" | "2:1" | "2:2" | "Third" | "Fail";

export type YearResult = {
  average: number | null;
  minPossible: number;
  maxPossible: number;
  classification: Classification | null;
};

export type ProgressionStatus = "green" | "amber" | "red";

export type ProgressionRequirement = {
  id: string;
  label: string;
  status: ProgressionStatus;
  detail: string;
  moduleCode?: ModuleCode;
};
