import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import fs from "fs";
import path from "path";

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

const knownIds = [
  "fintech-restructuring",
  "supply-chain-audit",
  "retail-expansion",
  "digital-transformation",
  "leadership-culture",
  "corporate-strategy"
];

async function cleanup() {
  const snapshot = await getDocs(collection(db, "portfolios"));
  for (const docSnap of snapshot.docs) {
    if (!knownIds.includes(docSnap.id)) {
      console.log(`Deleting manual incomplete document: ${docSnap.id}`);
      await deleteDoc(doc(db, "portfolios", docSnap.id));
    }
  }
  console.log("Cleanup complete!");
  process.exit(0);
}

cleanup().catch(err => {
  console.error("Cleanup error:", err);
  process.exit(1);
});
