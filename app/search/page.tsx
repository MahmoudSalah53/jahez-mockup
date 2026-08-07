import { redirect } from "next/navigation";
import { searchCatalog } from "@/data/meals";
import { getRestaurantById } from "@/data/restaurants";
import { RestaurantCard } from "@/components/RestaurantCard";
import { MealCard } from "@/components/MealCard";
import { SearchForm } from "@/components/SearchForm";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const trimmed = q.trim();

  // No query → home (search only runs after pressing بحث with text)
  if (!trimmed) {
    redirect("/");
  }

  const { restaurants: matchedRestaurants, meals: matchedMeals } =
    searchCatalog(trimmed);

  const noResults =
    matchedRestaurants.length === 0 && matchedMeals.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">البحث</h1>
      <div className="mt-4 max-w-xl">
        <SearchForm initialQuery={trimmed} />
      </div>

      {noResults ? (
        <p className="mt-8 text-muted">لا توجد نتائج لـ «{trimmed}»</p>
      ) : (
        <div className="mt-8 space-y-10">
          {matchedRestaurants.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-bold">المطاعم</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {matchedRestaurants.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            </section>
          )}
          {matchedMeals.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-bold">الوجبات</h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {matchedMeals.map((m) => (
                  <MealCard
                    key={m.id}
                    meal={m}
                    restaurantName={getRestaurantById(m.restaurantId)?.name}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
