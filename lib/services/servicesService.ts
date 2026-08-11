import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { ServiceItem, servicesData } from "@/app/components/ServicesSection";
import {
  faChartLine,
  faCoins,
  faGears,
  faUserGroup,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const ICON_MAP: Record<string, IconDefinition> = {
  faChartLine,
  faCoins,
  faGears,
  faUserGroup,
  faLightbulb,
};

/**
 * Fetch services from Firestore 'services' collection.
 * Falls back to local static servicesData if collection is empty or fails.
 */
export async function getServicesFromFirestore(): Promise<ServiceItem[]> {
  try {
    const q = query(collection(db, "services"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return servicesData;
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
      } as ServiceItem);
    });

    return items;
  } catch (error) {
    console.warn("Firestore services fetch error (using fallback static data):", error);
    return servicesData;
  }
}
