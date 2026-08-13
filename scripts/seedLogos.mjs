import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env.local");
if (!fs.existsSync(envPath)) {
  console.error(".env.local file not found.");
  process.exit(1);
}

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

const logoData = [
  {
    id: "bri",
    name: "Bank BRI",
    src: "logo-bank-bri_f1l1hj",
    alt: "Bank BRI Logo",
    width: 180,
    height: 60,
    cloudinary: true,
    active: true,
    order: 1,
  },
  {
    id: "bsi",
    name: "Bank BSI",
    src: "logo-bank-bsi_ijlkis",
    alt: "Bank BSI Logo",
    width: 180,
    height: 60,
    cloudinary: true,
    active: true,
    order: 2,
  },
  {
    id: "garuda",
    name: "Garuda Indonesia",
    src: "logo-garuda-indonesia_e3hxu2",
    alt: "Garuda Indonesia Logo",
    width: 200,
    height: 60,
    cloudinary: true,
    active: true,
    order: 3,
  },
  {
    id: "indomaret",
    name: "Indomaret",
    src: "logo-indomaret_xtpzia",
    alt: "Indomaret Logo",
    width: 170,
    height: 60,
    cloudinary: true,
    active: true,
    order: 4,
  },
  {
    id: "telkom",
    name: "Telkom Indonesia",
    src: "telkom_rp81p4",
    alt: "Telkom Indonesia Logo",
    width: 170,
    height: 60,
    cloudinary: true,
    active: true,
    order: 5,
  },
  {
    id: "unilever",
    name: "Unilever Indonesia",
    src: "unilever-indonesia_g9vubu",
    alt: "Unilever Indonesia Logo",
    width: 170,
    height: 60,
    cloudinary: true,
    active: true,
    order: 6,
  },
  {
    id: "posindo",
    name: "Pos Indonesia",
    src: "posindo_bq88n2",
    alt: "Pos Indonesia Logo",
    width: 170,
    height: 60,
    cloudinary: true,
    active: true,
    order: 7,
  },
  {
    id: "shopee",
    name: "Shopee",
    src: "shopeee_tnp5tx",
    alt: "Shopee Logo",
    width: 160,
    height: 60,
    cloudinary: true,
    active: true,
    order: 8,
  },
  {
    id: "lega-hero",
    name: "Lega Hero",
    src: "lega_hero_tklonp",
    alt: "Lega Hero Logo",
    width: 170,
    height: 60,
    cloudinary: true,
    active: true,
    order: 9,
  },
];

async function seedLogos() {
  console.log("Seeding client logos to Firestore 'logos' collection...");

  for (const item of logoData) {
    try {
      const docRef = doc(db, "logos", item.id);
      await setDoc(docRef, item);
      console.log(`✅ Uploaded logo: ${item.name} (${item.id})`);
    } catch (err) {
      console.error(`❌ Failed to seed logo ${item.id}:`, err);
    }
  }

  console.log("🎉 Seeding client logos completed!");
  process.exit(0);
}

seedLogos();
