export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  email?: string;
  phone?: string;
  address?: string;
  status: string;
  lastVisit: string;
  nextAppointment?: string;
  conditions?: string[];
  allergies?: string[];
  medications?: Medication[];
  vitalSigns?: VitalSigns;
  medicalHistory?: MedicalHistory;
  consultations?: Consultation[];
  insuranceInfo?: InsuranceInfo;
  emergencyContact?: EmergencyContact;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  notes?: string;
}

export interface VitalSigns {
  height?: string;
  weight?: string;
  bmi?: number;
  bloodPressure?: string;
  heartRate?: number;
  respiratoryRate?: number;
  temperature?: string;
  oxygenSaturation?: number;
  recordedDate: string;
}

export interface MedicalHistory {
  pastIllnesses?: string[];
  surgeries?: Surgery[];
  familyHistory?: string[];
  lifestyle?: Lifestyle;
}

export interface Surgery {
  procedure: string;
  date: string;
  hospital?: string;
  surgeon?: string;
  notes?: string;
}

export interface Lifestyle {
  smoking?: string;
  alcohol?: string;
  exercise?: string;
  diet?: string;
  occupation?: string;
}

export interface Consultation {
  id: string;
  date: string;
  doctorName?: string;
  symptoms: string[];
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  aiAgents?: string[];
  recommendations?: string[];
  followUp?: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  expirationDate?: string;
  coverageType?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
}

export const mockPatients: Patient[] = [
  {
    id: "P-10001",
    name: "John Doe",
    age: 45,
    gender: "Male",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, CA 94321",
    status: "Active",
    lastVisit: "2023-11-15",
    nextAppointment: "2024-01-10",
    conditions: ["Hypertension", "Type 2 Diabetes", "Hyperlipidemia"],
    allergies: ["Penicillin", "Peanuts"],
    medications: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        startDate: "2022-06-15",
        prescribedBy: "Dr. Smith",
      },
      {
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        startDate: "2022-03-10",
        prescribedBy: "Dr. Johnson",
      },
    ],
    vitalSigns: {
      height: "5'10\"",
      weight: "185 lbs",
      bmi: 26.5,
      bloodPressure: "138/85",
      heartRate: 72,
      respiratoryRate: 16,
      temperature: "98.6°F",
      oxygenSaturation: 98,
      recordedDate: "2023-11-15",
    },
    medicalHistory: {
      pastIllnesses: ["Pneumonia (2018)", "Appendicitis (2005)"],
      surgeries: [
        {
          procedure: "Appendectomy",
          date: "2005-07-22",
          hospital: "Memorial Hospital",
        },
      ],
      familyHistory: [
        "Father: Hypertension, Heart Disease",
        "Mother: Type 2 Diabetes",
      ],
      lifestyle: {
        smoking: "Former smoker, quit 2015",
        alcohol: "Social drinker, 2-3 drinks/week",
        exercise: "Moderate, walks 30 min/day",
        diet: "Low sodium diet",
        occupation: "Office worker",
      },
    },
    consultations: [
      {
        id: "C-20231115",
        date: "2023-11-15",
        doctorName: "Dr. Emily Chen",
        symptoms: ["Fatigue", "Increased thirst", "Blurred vision"],
        diagnosis: "Poorly controlled Type 2 Diabetes",
        treatment: "Adjusted Metformin dosage, added Glipizide 5mg daily",
        notes:
          "Patient reports increased stress at work. Recommended stress management techniques.",
        aiAgents: ["General Medicine", "Endocrinology"],
        recommendations: [
          "Increase blood glucose monitoring to twice daily",
          "Follow up in 4 weeks to assess medication efficacy",
          "Referral to nutritionist for dietary counseling",
        ],
        followUp: "2023-12-13",
      },
    ],
    insuranceInfo: {
      provider: "Blue Cross Blue Shield",
      policyNumber: "BCBS12345678",
      groupNumber: "GRP987654",
      expirationDate: "2024-12-31",
      coverageType: "PPO",
    },
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Spouse",
      phone: "(555) 987-6543",
      email: "jane.doe@example.com",
    },
  },
  {
    id: "P-10002",
    name: "Jane Smith",
    age: 38,
    gender: "Female",
    email: "jane.smith@example.com",
    phone: "(555) 234-5678",
    status: "Active",
    lastVisit: "2023-12-03",
    conditions: ["Asthma", "Seasonal Allergies"],
    allergies: ["Sulfa drugs", "Pollen"],
    medications: [
      {
        name: "Albuterol",
        dosage: "90mcg",
        frequency: "As needed",
        startDate: "2021-05-20",
      },
      {
        name: "Fluticasone",
        dosage: "50mcg",
        frequency: "Once daily",
        startDate: "2022-01-15",
      },
    ],
    consultations: [
      {
        id: "C-20231203",
        date: "2023-12-03",
        doctorName: "Dr. Michael Wong",
        symptoms: ["Wheezing", "Shortness of breath", "Coughing"],
        diagnosis: "Asthma exacerbation due to seasonal triggers",
        treatment: "Increased Fluticasone dosage, added Montelukast 10mg daily",
        aiAgents: ["Pulmonology", "Allergy & Immunology"],
      },
    ],
  },
  {
    id: "P-10003",
    name: "Robert Johnson",
    age: 62,
    gender: "Male",
    status: "Active",
    lastVisit: "2023-10-28",
    conditions: ["Coronary Artery Disease", "Osteoarthritis"],
    medications: [
      {
        name: "Atorvastatin",
        dosage: "40mg",
        frequency: "Once daily",
        startDate: "2020-11-05",
      },
      {
        name: "Aspirin",
        dosage: "81mg",
        frequency: "Once daily",
        startDate: "2020-11-05",
      },
    ],
  },
  {
    id: "P-10004",
    name: "Emily Davis",
    age: 29,
    gender: "Female",
    status: "Active",
    lastVisit: "2023-11-20",
    conditions: ["Anxiety", "Migraine"],
    medications: [
      {
        name: "Sertraline",
        dosage: "50mg",
        frequency: "Once daily",
        startDate: "2022-08-15",
      },
      {
        name: "Sumatriptan",
        dosage: "50mg",
        frequency: "As needed for migraine",
        startDate: "2022-09-10",
      },
    ],
  },
  {
    id: "P-10005",
    name: "Michael Wilson",
    age: 55,
    gender: "Male",
    status: "Inactive",
    lastVisit: "2023-06-12",
    conditions: ["GERD", "Insomnia"],
    medications: [
      {
        name: "Omeprazole",
        dosage: "20mg",
        frequency: "Once daily",
        startDate: "2021-12-05",
      },
    ],
  },
  {
    id: "P-10006",
    name: "Sarah Thompson",
    age: 42,
    gender: "Female",
    status: "Active",
    lastVisit: "2023-12-05",
    conditions: ["Hypothyroidism", "Depression"],
    medications: [
      {
        name: "Levothyroxine",
        dosage: "75mcg",
        frequency: "Once daily",
        startDate: "2020-03-15",
      },
      {
        name: "Escitalopram",
        dosage: "10mg",
        frequency: "Once daily",
        startDate: "2021-07-22",
      },
    ],
  },
  {
    id: "P-10007",
    name: "David Martinez",
    age: 33,
    gender: "Male",
    status: "Pending",
    lastVisit: "2023-12-10",
    conditions: ["Lower Back Pain", "Allergic Rhinitis"],
    medications: [
      {
        name: "Naproxen",
        dosage: "500mg",
        frequency: "Twice daily as needed",
        startDate: "2023-11-15",
      },
      {
        name: "Cetirizine",
        dosage: "10mg",
        frequency: "Once daily",
        startDate: "2023-10-01",
      },
    ],
  },
  {
    id: "P-10008",
    name: "Jennifer Lee",
    age: 51,
    gender: "Female",
    status: "Active",
    lastVisit: "2023-11-08",
    conditions: ["Rheumatoid Arthritis", "Osteoporosis"],
    medications: [
      {
        name: "Methotrexate",
        dosage: "15mg",
        frequency: "Once weekly",
        startDate: "2021-04-10",
      },
      {
        name: "Alendronate",
        dosage: "70mg",
        frequency: "Once weekly",
        startDate: "2022-01-05",
      },
    ],
  },
];
