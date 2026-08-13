import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { PortfolioItem } from "@/app/components/PortfolioSection";

const COLLECTION_NAME = "portfolios";

/**
 * Fetch all portfolio items from Firestore 'portfolios' collection.
 */
export async function getPortfoliosFromFirestore(): Promise<PortfolioItem[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    const items: PortfolioItem[] = [];
    querySnapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as PortfolioItem);
    });

    return items;
  } catch (error) {
    console.error("Firestore portfolio fetch error:", error);
    return [];
  }
}

export const getPortfolios = getPortfoliosFromFirestore;

/**
 * Fetch a single portfolio item by document ID.
 */
export async function getPortfolio(id: string): Promise<PortfolioItem | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return { id: docSnap.id, ...docSnap.data() } as PortfolioItem;
  } catch (error) {
    console.error(`Error fetching portfolio ${id}:`, error);
    return null;
  }
}

/**
 * Create a new portfolio item in Firestore.
 */
export async function createPortfolio(
  data: Omit<PortfolioItem, "id"> & { id?: string }
): Promise<string> {
  const payload = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (data.id) {
    const docRef = doc(db, COLLECTION_NAME, data.id);
    await setDoc(docRef, payload);
    return data.id;
  } else {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
    return docRef.id;
  }
}

/**
 * Update an existing portfolio item in Firestore.
 */
export async function updatePortfolio(
  id: string,
  data: Partial<PortfolioItem>
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const payload = {
    ...data,
    updatedAt: serverTimestamp(),
  };
  await updateDoc(docRef, payload);
}

/**
 * Delete a portfolio item from Firestore by document ID.
 */
export async function deletePortfolio(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
