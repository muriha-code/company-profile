import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";

// Read .env.local variables
const envPath = path.resolve(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars = {};

envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const firebaseConfig = {
  apiKey: envVars.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: envVars.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: envVars.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: envVars.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envVars.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: envVars.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const servicesData = [
  {
    id: "business-strategy",
    iconName: "faChartLine",
    title: "Business Strategy",
    subtitle: "Perencanaan & Penetrasian Pasar",
    description: "Perencanaan strategis terarah berbasis analisis pasar komprehensif untuk mendorong pertumbuhan jangka panjang dan keunggulan kompetitif.",
    features: [
      "Market Expansion & Penetrasi Pasar",
      "Strategic Roadmap & Milestone",
      "Competitive Analysis & Benchmarking",
      "Digital Business Model Transformation"
    ],
    badgeText: "Strategi Utama",
    colorScheme: {
      iconBg: "bg-blue-50 group-hover:bg-blue-600",
      iconColor: "text-blue-600 group-hover:text-white",
      borderHover: "hover:border-blue-500/50 hover:shadow-blue-500/10",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
      badgeText: "text-blue-700",
      bulletColor: "text-blue-600 bg-blue-100",
      glowBg: "from-blue-500/10 to-indigo-500/5"
    },
    order: 1
  },
  {
    id: "financial-optimization",
    iconName: "faCoins",
    title: "Financial Optimization",
    subtitle: "Manajemen Arus Kas & Profitabilitas",
    description: "Restrukturisasi dan optimalisasi arus kas untuk meminimalkan risiko keuangan serta memaksimalkan margin keuntungan bisnis Anda.",
    features: [
      "Cash Flow Management & Liquidity",
      "Cost Reduction & Operational Budgeting",
      "Financial Forecasting & Risk Audit",
      "Capital Structure Optimization"
    ],
    badgeText: "Keuangan & Efisiensi",
    colorScheme: {
      iconBg: "bg-emerald-50 group-hover:bg-emerald-600",
      iconColor: "text-emerald-600 group-hover:text-white",
      borderHover: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      badgeText: "text-emerald-700",
      bulletColor: "text-emerald-600 bg-emerald-100",
      glowBg: "from-emerald-500/10 to-teal-500/5"
    },
    order: 2
  },
  {
    id: "operational-excellence",
    iconName: "faGears",
    title: "Operational Excellence",
    subtitle: "Otomatisasi & Efisiensi Alur Kerja",
    description: "Peningkatan efisiensi operasional dan otomatisasi alur kerja guna memangkas redundansi serta meningkatkan produktivitas tim.",
    features: [
      "Process Automation & Workflow Re-engineering",
      "Supply Chain Audit & Logistics Optimization",
      "KPI & Balanced Scorecard Framework",
      "Quality Assurance & Standard Operating Procedures (SOP)"
    ],
    badgeText: "Sistem & Operasional",
    colorScheme: {
      iconBg: "bg-amber-50 group-hover:bg-amber-600",
      iconColor: "text-amber-600 group-hover:text-white",
      borderHover: "hover:border-amber-500/50 hover:shadow-amber-500/10",
      badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
      badgeText: "text-amber-800",
      bulletColor: "text-amber-600 bg-amber-100",
      glowBg: "from-amber-500/10 to-orange-500/5"
    },
    order: 3
  },
  {
    id: "leadership-team",
    iconName: "faUserGroup",
    title: "Leadership & Team",
    subtitle: "Pengembangan SDM & Kepemimpinan",
    description: "Pengembangan kapabilitas kepemimpinan dan budaya kerja performa tinggi untuk mempercepat eksekusi rencana strategis.",
    features: [
      "Talent Alignment & Organizational Structure",
      "Executive Coaching & Leadership Mentorship",
      "Performance Review & Culture Building",
      "Change Management & Employee Engagement"
    ],
    badgeText: "SDM & Budaya Kerja",
    colorScheme: {
      iconBg: "bg-purple-50 group-hover:bg-purple-600",
      iconColor: "text-purple-600 group-hover:text-white",
      borderHover: "hover:border-purple-500/50 hover:shadow-purple-500/10",
      badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
      badgeText: "text-purple-700",
      bulletColor: "text-purple-600 bg-purple-100",
      glowBg: "from-purple-500/10 to-pink-500/5"
    },
    order: 4
  }
];

async function seed() {
  console.log("Seeding 4 services items to Cloud Firestore...");
  for (const item of servicesData) {
    const { id, ...data } = item;
    await setDoc(doc(db, "services", id), data);
    console.log(`✓ Uploaded service: ${id}`);
  }
  console.log("🎉 All 4 services successfully uploaded to Firestore!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Services seed failed:", err);
  process.exit(1);
});
