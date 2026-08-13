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
import { ClientLogo } from "@/app/components/ClientMarquee";

const COLLECTION_NAME = "logos";

export interface ClientLogoInput {
  name: string;
  alt: string;
  src: string;
  publicId?: string;
  slug?: string;
  folder?: string;
  width?: number;
  height?: number;
  cloudinary?: boolean;
  active?: boolean;
  order?: number;
}

export const DEFAULT_CLIENT_LOGOS: ClientLogo[] = [
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

/**
 * Fetch all client logos from Firestore 'logos' collection.
 * Falls back to DEFAULT_CLIENT_LOGOS if collection is empty.
 */
export async function getClientLogosFromFirestore(): Promise<ClientLogo[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return DEFAULT_CLIENT_LOGOS;
    }

    const items: ClientLogo[] = [];
    querySnapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as ClientLogo);
    });

    return items;
  } catch (error) {
    console.error("Firestore logo fetch error (using fallback defaults):", error);
    return DEFAULT_CLIENT_LOGOS;
  }
}

export const getClientLogos = getClientLogosFromFirestore;

/**
 * Create a new client logo in Firestore.
 */
export async function createClientLogo(
  data: ClientLogoInput & { id?: string }
): Promise<string> {
  const payload = {
    ...data,
    active: data.active !== undefined ? data.active : true,
    cloudinary: data.cloudinary !== undefined ? data.cloudinary : true,
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
 * Update an existing client logo in Firestore.
 */
export async function updateClientLogo(
  id: string,
  data: Partial<ClientLogoInput>
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const payload = {
    ...data,
    updatedAt: serverTimestamp(),
  };
  await updateDoc(docRef, payload);
}

/**
 * Delete a client logo from Firestore.
 */
export async function deleteClientLogo(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
