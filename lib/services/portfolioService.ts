import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { PortfolioItem, portfolioData } from "@/app/components/PortfolioSection";

/**
 * Fetch portfolio items from Firestore 'portfolios' collection.
 * Falls back to local static portfolioData if collection is empty or credentials are not yet set.
 */
export async function getPortfoliosFromFirestore(): Promise<PortfolioItem[]> {
  try {
    const q = query(collection(db, "portfolios"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return portfolioData;
    }

    const items: PortfolioItem[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as PortfolioItem);
    });

    return items;
  } catch (error) {
    console.warn("Firestore portfolio fetch error (using fallback static data):", error);
    return portfolioData;
  }
}
