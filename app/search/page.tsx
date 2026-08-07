import { redirect } from "next/navigation";
import { searchCatalog } from "@/data/meals";
import { getRestaurantById } from "@/data/restaurants";
import { RestaurantListItem } from "@/components/RestaurantListItem";
import { RestaurantCard } from "@/components/RestaurantCard";
import { MealListItem } from "@/components/MealListItem";
import { MealCard } from "@/components/MealCard";
import { SearchForm } from "@/components/SearchForm";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const trimmed = q.trim();

  if (!trimmed) {
    redirect("/");
  }

  const { restaurants: matchedRestaurants, meals: matchedMeals } =
    searchCatalog(trimmed);

  const noResults =
    matchedRestaurants.length === 0 && matchedMeals.length === 0;

  return (
    <div className="mx-auto max-w-lg md:max-w-6xl">
      <div className="px-4 py-4 sm:px-6 md:py-8">
        <h1 className="text-xl font-bold md:text-3xl">البحث</h1>
        <div className="mt-3 max-w-xl">
          <SearchForm initialQuery={trimmed} />
        </div>
      </div>

      {noResults ? (
        <p className="px-4 py-8 text-center text-muted sm:px-6">
          لا توجد نتائج لـ «{trimmed}»
        </p>
      ) : (
        <div className="space-y-8 pb-10">
          {matchedRestaurants.length > 0 && (
            <section>
              <h2 className="px-4 pb-2 text-sm font-bold text-muted sm:px-6 md:text-base">
                المطاعم ({matchedRestaurants.length})
              </h2>
              <div className="border-y border-border md:hidden">
                {matchedRestaurants.map((r) => (
                  <RestaurantListItem key={r.id} restaurant={r} />
                ))}
              </div>
              <div className="hidden gap-5 px-6 md:grid md:grid-cols-2 lg:grid-cols-3">
                {matchedRestaurants.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            </section>
          )}
          {matchedMeals.length > 0 && (
            <section>
              <h2 className="px-4 pb-2 text-sm font-bold text-muted sm:px-6 md:text-base">
                الوجبات ({matchedMeals.length})
              </h2>
              <div className="border-y border-border md:hidden">
                {matchedMeals.map((m) => (
                  <MealListItem
                    key={m.id}
                    meal={m}
                    href={`/meals/${m.id}?from=search`}
                    restaurantName={getRestaurantById(m.restaurantId)?.name}
                  />
                ))}
              </div>
              <div className="hidden gap-5 px-6 md:grid md:grid-cols-3 lg:grid-cols-4">
                {matchedMeals.map((m) => (
                  <MealCard
                    key={m.id}
                    meal={m}
                    href={`/meals/${m.id}?from=search`}
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
