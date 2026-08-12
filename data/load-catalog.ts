/**
 * Merged catalog from data/catalog/*.json parts.
 * Prefer importing this (or catalog.json which expand-catalog.mjs keeps in sync).
 */
import original from "@/data/catalog/00-original.json";
import grill from "@/data/catalog/01-grill.json";
import levant from "@/data/catalog/02-levant.json";
import burger from "@/data/catalog/03-burger.json";
import japanese from "@/data/catalog/04-japanese.json";
import desserts from "@/data/catalog/05-desserts.json";
import italian from "@/data/catalog/06-italian.json";
import indian from "@/data/catalog/07-indian.json";
import saudi from "@/data/catalog/08-saudi.json";
import seafood from "@/data/catalog/09-seafood.json";
import healthy from "@/data/catalog/10-healthy.json";
import grocery from "@/data/catalog/11-grocery.json";
import moreGrill from "@/data/catalog/12-more-grill-cafe.json";
import cafe from "@/data/catalog/13-cafe-bakery.json";
import world from "@/data/catalog/14-mexican-asian.json";
import friedChicken from "@/data/catalog/15-fried-chicken.json";

const PARTS = [
  original,
  grill,
  levant,
  burger,
  japanese,
  desserts,
  italian,
  indian,
  saudi,
  seafood,
  healthy,
  grocery,
  moreGrill,
  cafe,
  world,
  friedChicken,
] as const;

const seen = new Set<string>();
const restaurants = PARTS.flatMap((part) =>
  part.restaurants.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  }),
);

const catalog = { restaurants };

export default catalog;
export { restaurants as catalogRestaurants };
