import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { PortfolioItem } from "@/app/components/PortfolioSection";

/**
 * Fetch portfolio items from Firestore 'portfolios' collection.
 */
export async function getPortfoliosFromFirestore(): Promise<PortfolioItem[]> {
  try {
    const q = query(collection(db, "portfolios"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return [];
    }

    const items: PortfolioItem[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as PortfolioItem);
    });

    return items;
  } catch (error) {
    console.error("Firestore portfolio fetch error:", error);
    return [];
  }
}

// Alias getPortfolios for consistency
export const getPortfolios = getPortfoliosFromFirestore;
