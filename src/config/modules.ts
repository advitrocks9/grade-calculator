import type { Module, Assessment } from "@/lib/types";

export const MODULES: Module[] = [
  {
    code: "MATH40002",
    name: "Analysis 1",
    ects: 10,
    category: "maths",
    isPassFail: false,
    isZeroWeighted: false,
    assessments: [
      {
        id: "math40002_autumn_cw",
        name: "Autumn Coursework",
        weight: 5,
        term: "autumn",
        moduleCode: "MATH40002",
      },
      {
        id: "math40002_autumn_exam",
        name: "Autumn Exam",
        weight: 10,
        term: "autumn",
        moduleCode: "MATH40002",
      },
      {
        id: "math40002_spring_cw",
        name: "Spring Coursework",
        weight: 5,
        term: "spring",
        moduleCode: "MATH40002",
      },
      {
        id: "math40002_spring_exam",
        name: "Spring Exam",
        weight: 10,
        term: "spring",
        moduleCode: "MATH40002",
      },
      {
        id: "math40002_summer_exam",
        name: "Summer Exam",
        weight: 70,
        term: "summer",
        moduleCode: "MATH40002",
      },
    ],
  },
  {
    code: "MATH40004",
    name: "Calculus and Applications",
    ects: 10,
    category: "maths",
    isPassFail: false,
    isZeroWeighted: false,
    assessments: [
      {
        id: "math40004_autumn_test",
        name: "Autumn Term Test",
        weight: 15,
        term: "autumn",
        moduleCode: "MATH40004",
      },
      {
        id: "math40004_spring_test",
        name: "Spring Term Test",
        weight: 15,
        term: "spring",
        moduleCode: "MATH40004",
      },
      {
        id: "math40004_summer_exam",
        name: "Summer Exam",
        weight: 70,
        term: "summer",
        moduleCode: "MATH40004",
      },
    ],
  },
  {
    code: "MATH40012",
    name: "Linear Algebra and Groups",
    ects: 5,
    category: "maths",
    isPassFail: false,
    isZeroWeighted: false,
    assessments: [
      {
        id: "math40012_autumn_ps",
        name: "Autumn Problem Sheet",
        weight: 1,
        term: "autumn",
        moduleCode: "MATH40012",
      },
      {
        id: "math40012_autumn_quiz_1",
        name: "Autumn Quiz 1",
        weight: 2,
        term: "autumn",
        moduleCode: "MATH40012",
      },
      {
        id: "math40012_autumn_quiz_2",
        name: "Autumn Quiz 2",
        weight: 2,
        term: "autumn",
        moduleCode: "MATH40012",
      },
      {
        id: "math40012_autumn_cw",
        name: "Autumn Coursework",
        weight: 10,
        term: "autumn",
        moduleCode: "MATH40012",
      },
      {
        id: "math40012_spring_quiz_1",
        name: "Spring Quiz 1",
        weight: 1,
        term: "spring",
        moduleCode: "MATH40012",
      },
      {
        id: "math40012_spring_quiz_2",
        name: "Spring Quiz 2",
        weight: 2,
        term: "spring",
        moduleCode: "MATH40012",
      },
      {
        id: "math40012_spring_quiz_3",
        name: "Spring Quiz 3",
        weight: 2,
        term: "spring",
        moduleCode: "MATH40012",
      },
      {
        id: "math40012_spring_exam",
        name: "Spring Exam",
        weight: 10,
        term: "spring",
        moduleCode: "MATH40012",
      },
      {
        id: "math40012_summer_exam",
        name: "Summer Exam",
        weight: 70,
        term: "summer",
        moduleCode: "MATH40012",
      },
    ],
  },
  {
    code: "COMP40012",
    name: "Logic and Reasoning",
    ects: 5,
    category: "computing",
    isPassFail: false,
    isZeroWeighted: false,
    assessments: [
      {
        id: "comp40012_coursework_1",
        name: "Coursework 1",
        weight: 10,
        term: "autumn",
        moduleCode: "COMP40012",
      },
      {
        id: "comp40012_coursework_2",
        name: "Coursework 2",
        weight: 10,
        term: "spring",
        moduleCode: "COMP40012",
      },
      {
        id: "comp40012_summer_exam",
        name: "Summer Exam",
        weight: 80,
        term: "summer",
        moduleCode: "COMP40012",
      },
    ],
  },
  {
    code: "COMP40008",
    name: "Graphs and Algorithms",
    ects: 5,
    category: "computing",
    isPassFail: false,
    isZeroWeighted: false,
    assessments: [
      {
        id: "comp40008_coursework",
        name: "Coursework",
        weight: 20,
        term: "spring",
        moduleCode: "COMP40008",
      },
      {
        id: "comp40008_summer_exam",
        name: "Summer Exam",
        weight: 80,
        term: "summer",
        moduleCode: "COMP40008",
      },
    ],
  },
  {
    code: "COMP40009",
    name: "Computing Practical 1",
    ects: 20,
    category: "computing",
    isPassFail: false,
    isZeroWeighted: false,
    assessments: [
      {
        id: "comp40009_haskell_interim",
        name: "Haskell Interim Test",
        weight: 5,
        term: "autumn",
        moduleCode: "COMP40009",
      },
      {
        id: "comp40009_haskell_final",
        name: "Haskell Final Test",
        weight: 25,
        term: "autumn",
        moduleCode: "COMP40009",
      },
      {
        id: "comp40009_kotlin_interim",
        name: "Kotlin Interim Test",
        weight: 5,
        term: "spring",
        moduleCode: "COMP40009",
      },
      {
        id: "comp40009_kotlin_final",
        name: "Kotlin Final Test",
        weight: 35,
        term: "spring",
        moduleCode: "COMP40009",
      },
      {
        id: "comp40009_c_main_test",
        name: "C Main Test",
        weight: 12,
        term: "summer",
        moduleCode: "COMP40009",
      },
      {
        id: "comp40009_c_group_project",
        name: "C Group Project",
        weight: 8,
        term: "summer",
        moduleCode: "COMP40009",
      },
      {
        id: "comp40009_ethics_presentation",
        name: "Ethics Presentation",
        weight: 5,
        term: "autumn",
        moduleCode: "COMP40009",
      },
      {
        id: "comp40009_ethics_writeup",
        name: "Ethics Writeup",
        weight: 5,
        term: "autumn",
        moduleCode: "COMP40009",
      },
      {
        id: "comp40009_architecture_coursework",
        name: "Architecture Coursework",
        weight: 0,
        term: "summer",
        moduleCode: "COMP40009",
      },
    ],
  },
  {
    code: "MATH40009",
    name: "Introduction to University Mathematics",
    ects: 5,
    category: "maths",
    isPassFail: true,
    isZeroWeighted: true,
    assessments: [
      {
        id: "math40009_pass",
        name: "Pass/Fail",
        weight: 100,
        term: "autumn",
        moduleCode: "MATH40009",
      },
    ],
  },
];

export const ASSESSMENTS_BY_ID: Record<string, Assessment> = {};
for (const mod of MODULES) {
  for (const a of mod.assessments) {
    ASSESSMENTS_BY_ID[a.id] = a;
  }
}

export const WEIGHTED_MODULES = MODULES.filter((m) => !m.isZeroWeighted);

export const PROGRAMMING_TEST_ASSESSMENTS = MODULES.find(
  (m) => m.code === "COMP40009",
)!.assessments.filter((a) =>
  [
    "comp40009_haskell_interim",
    "comp40009_haskell_final",
    "comp40009_kotlin_interim",
    "comp40009_kotlin_final",
    "comp40009_c_main_test",
  ].includes(a.id),
);

export const PROGRAMMING_TEST_TOTAL_WEIGHT =
  PROGRAMMING_TEST_ASSESSMENTS.reduce((sum, a) => sum + a.weight, 0);

export const TOTAL_WEIGHTED_ECTS = WEIGHTED_MODULES.reduce(
  (sum, m) => sum + m.ects,
  0,
);
