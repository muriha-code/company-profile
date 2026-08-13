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
import { ServiceItem } from "@/app/components/ServicesSection";
import {
  faChartLine,
  faCoins,
  faGears,
  faUserGroup,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const COLLECTION_NAME = "services";

export const ICON_MAP: Record<string, IconDefinition> = {
  faChartLine,
  faCoins,
  faGears,
  faUserGroup,
  faLightbulb,
};

export interface ServiceInputData {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  badgeText: string;
  iconName: string;
  image?: string;
  imagePublicId?: string;
  slug?: string;
  folder?: string;
  order?: number;
  colorScheme?: {
    iconBg: string;
    iconColor: string;
    borderHover: string;
    badgeBg: string;
    badgeText: string;
    bulletColor: string;
    glowBg: string;
  };
}

/**
 * Fetch services from Firestore 'services' collection.
 */
export async function getServicesFromFirestore(): Promise<ServiceItem[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    const items: ServiceItem[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const iconKey = data.iconName || "faChartLine";
      const icon = ICON_MAP[iconKey] || faChartLine;

      items.push({
        id: docSnap.id,
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        features: data.features || [],
        badgeText: data.badgeText,
        iconName: iconKey,
        image: data.image || "",
        imagePublicId: data.imagePublicId || "",
        slug: data.slug || "",
        folder: data.folder || "growthline/services",
        colorScheme: data.colorScheme || {
          iconBg: "bg-blue-50 group-hover:bg-blue-600",
          iconColor: "text-blue-600 group-hover:text-white",
          borderHover: "hover:border-blue-500/50 hover:shadow-blue-500/10",
          badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
          badgeText: "text-blue-700",
          bulletColor: "text-blue-600 bg-blue-100",
          glowBg: "from-blue-500/10 to-indigo-500/5",
        },
        icon,
      } as ServiceItem & { iconName?: string });
    });

    return items;
  } catch (error) {
    console.error("Firestore services fetch error:", error);
    return [];
  }
}

export const getServices = getServicesFromFirestore;

/**
 * Fetch single service by ID
 */
export async function getService(id: string): Promise<ServiceItem | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    const iconKey = data.iconName || "faChartLine";
    const icon = ICON_MAP[iconKey] || faChartLine;

    return {
      id: docSnap.id,
      ...data,
      icon,
    } as ServiceItem;
  } catch (error) {
    console.error(`Error fetching service ${id}:`, error);
    return null;
  }
}

/**
 * Create service in Firestore
 */
export async function createService(
  data: ServiceInputData & { id?: string }
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
 * Update service in Firestore
 */
export async function updateService(
  id: string,
  data: Partial<ServiceInputData>
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const payload = {
    ...data,
    updatedAt: serverTimestamp(),
  };
  await updateDoc(docRef, payload);
}

/**
 * Delete service from Firestore
 */
export async function deleteService(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
