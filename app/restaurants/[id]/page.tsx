import { notFound } from "next/navigation";
import { getRestaurantById } from "@/data/restaurants";
import { getMealsByRestaurant } from "@/data/meals";
import { RestaurantMenu } from "@/components/restaurant/RestaurantMenu";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RestaurantPage({ params }: Props) {
  const { id } = await params;
  const restaurant = getRestaurantById(id);
  if (!restaurant) notFound();

  const restaurantMeals = getMealsByRestaurant(id);

  return (
    <RestaurantMenu restaurant={restaurant} meals={restaurantMeals} />
  );
}
