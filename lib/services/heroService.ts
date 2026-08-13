import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const COLLECTION_NAME = "hero";
const HERO_DOC_ID = "main";

export interface HeroData {
  src: string;
  publicId?: string;
  slug?: string;
  folder?: string;
  cloudinary?: boolean;
  updatedAt?: any;
}

/**
 * Fetch Hero background image data from Firestore 'hero' collection.
 */
export async function getHeroFromFirestore(): Promise<HeroData | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, HERO_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return docSnap.data() as HeroData;
  } catch (error) {
    console.error("Firestore Hero fetch error:", error);
    return null;
  }
}

export const getHero = getHeroFromFirestore;

/**
 * Update or set Hero background image in Firestore.
 */
export async function updateHeroInFirestore(data: HeroData): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, HERO_DOC_ID);
  const payload = {
    ...data,
    cloudinary: data.cloudinary !== undefined ? data.cloudinary : true,
    updatedAt: serverTimestamp(),
  };
  await setDoc(docRef, payload, { merge: true });
}
