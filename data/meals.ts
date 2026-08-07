import type { Meal, MealAddon, MealCategory } from "@/lib/types";
import { DEFAULT_ADDONS } from "@/lib/types";
import { restaurants } from "@/data/restaurants";

const IMG = {
  grill: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
  meat: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80",
  chicken: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80",
  kofta: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&q=80",
  rice: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
  shawarma: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&q=80",
  falafel: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=800&q=80",
  hummus: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
  burger2: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&q=80",
  fries: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80",
  shake: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80",
  sushi: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80",
  sushi2: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80",
  tuna: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&q=80",
  tempura: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&q=80",
  soup: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80",
  green: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
  sweet: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80",
  cake: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
  baklava: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=800&q=80",
  dessert: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80",
  cheesecake: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80",
  pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
  pizza2: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
  indian: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
  seafood: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
  pasta: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80",
  bowl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
};

type MealSeed = {
  slug: string;
  name: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: MealCategory;
  isPopular?: boolean;
  isOffer?: boolean;
  offerPrice?: number;
  spicyOption?: boolean;
  cashbackPercent?: number;
  addons?: MealAddon[];
};

function buildMeals(restaurantId: string, seeds: MealSeed[]): Meal[] {
  return seeds.map((s) => ({
    id: `${restaurantId}-${s.slug}`,
    restaurantId,
    name: s.name,
    description: s.description,
    image: s.image,
    price: s.price,
    rating: s.rating,
    calories: s.calories,
    protein: s.protein,
    carbs: s.carbs,
    fat: s.fat,
    category: s.category,
    isPopular: s.isPopular ?? s.category === "popular",
    isOffer: s.isOffer ?? s.category === "offers",
    offerPrice: s.offerPrice,
    spicyOption: s.spicyOption ?? true,
    cashbackPercent: s.cashbackPercent,
    addons: s.addons ?? DEFAULT_ADDONS.slice(0, 3),
  }));
}

const catalog: Record<string, MealSeed[]> = {
  "bayt-alshawaya": [
    { slug: "mixed", name: "مشكل مشاوي", description: "تشكيلة لحم ودجاج على الفحم مع أرز.", image: IMG.grill, price: 69, rating: 4.9, calories: 820, protein: 48, carbs: 55, fat: 38, category: "popular", isPopular: true },
    { slug: "lamb", name: "ريش غنم", description: "ريش غنم مشوية مع طحينة.", image: IMG.meat, price: 85, rating: 4.8, calories: 710, protein: 52, carbs: 12, fat: 48, category: "offers", isOffer: true, offerPrice: 72, cashbackPercent: 10 },
    { slug: "chicken", name: "دجاج على الفحم", description: "نصف دجاجة متبلة مع خبز.", image: IMG.chicken, price: 42, rating: 4.6, calories: 540, protein: 42, carbs: 18, fat: 28, category: "popular", isPopular: true },
    { slug: "kofta", name: "كفتة لحم", description: "كفتة مشوية مع بطاطس.", image: IMG.kofta, price: 48, rating: 4.5, calories: 620, protein: 36, carbs: 32, fat: 34, category: "menu" },
    { slug: "bukhari", name: "أرز بخاري", description: "أرز بخاري باللحم والمكسرات.", image: IMG.rice, price: 38, rating: 4.4, calories: 580, protein: 28, carbs: 68, fat: 18, category: "menu" },
    { slug: "tikka", name: "تكة دجاج", description: "قطع دجاج متبلة مشوية.", image: IMG.chicken, price: 45, rating: 4.5, calories: 490, protein: 40, carbs: 10, fat: 26, category: "menu", spicyOption: true },
    { slug: "mixed-plate", name: "طبق مشاوي عائلي", description: "طبق كبير يكفي 3 أشخاص.", image: IMG.grill, price: 149, rating: 4.7, calories: 1600, protein: 95, carbs: 90, fat: 80, category: "offers", isOffer: true, offerPrice: 129 },
    { slug: "kebab", name: "كباب حلبي", description: "كباب لحم مع بصل مشوي.", image: IMG.kofta, price: 52, rating: 4.6, calories: 600, protein: 38, carbs: 20, fat: 36, category: "popular", isPopular: true },
    { slug: "liver", name: "كبدة مشوية", description: "كبدة غنم طازجة على الفحم.", image: IMG.meat, price: 36, rating: 4.3, calories: 420, protein: 32, carbs: 8, fat: 24, category: "menu" },
    { slug: "soup", name: "شوربة حريرة", description: "شوربة دافئة بالمرقة والبهارات.", image: IMG.soup, price: 18, rating: 4.2, calories: 180, protein: 10, carbs: 16, fat: 8, category: "menu", spicyOption: false },
  ],
  "madhaq-alsham": [
    { slug: "shawarma", name: "شاورما دجاج", description: "ساندويتش شاورما مع ثومية.", image: IMG.shawarma, price: 28, rating: 4.7, calories: 480, protein: 28, carbs: 42, fat: 20, category: "offers", isOffer: true, offerPrice: 22, isPopular: true, cashbackPercent: 15 },
    { slug: "falafel", name: "صحن فلافل", description: "فلافل مع حمص وسلطة.", image: IMG.falafel, price: 22, rating: 4.5, calories: 410, protein: 14, carbs: 48, fat: 16, category: "menu", spicyOption: false },
    { slug: "hummus", name: "حمص باللحمة", description: "حمص كريمي مع لحم مفروم.", image: IMG.hummus, price: 32, rating: 4.6, calories: 390, protein: 22, carbs: 28, fat: 22, category: "popular", isPopular: true },
    { slug: "kibbeh", name: "كبة مقلية", description: "كبة محشوة باللحم والجوز.", image: IMG.kofta, price: 35, rating: 4.4, calories: 450, protein: 18, carbs: 38, fat: 24, category: "menu" },
    { slug: "fattoush", name: "فتوش", description: "سلطة فتوش مع خبز محمص.", image: IMG.salad, price: 18, rating: 4.3, calories: 220, protein: 6, carbs: 24, fat: 10, category: "menu", spicyOption: false },
    { slug: "manakeesh", name: "مناقيش زعتر", description: "مناقيش طازجة بالزعتر والزيت.", image: IMG.pizza2, price: 16, rating: 4.4, calories: 320, protein: 8, carbs: 40, fat: 12, category: "popular", isPopular: true, spicyOption: false },
    { slug: "foul", name: "فول مدمس", description: "فول مع زيت وكمون.", image: IMG.hummus, price: 14, rating: 4.2, calories: 280, protein: 12, carbs: 32, fat: 10, category: "menu", spicyOption: false },
    { slug: "mixed-mezzah", name: "مشكل مقبلات", description: "حمص ومتبل ومخلّلات.", image: IMG.salad, price: 40, rating: 4.5, calories: 520, protein: 16, carbs: 40, fat: 28, category: "offers", isOffer: true, offerPrice: 34 },
    { slug: "meat-shawarma", name: "شاورما لحم", description: "شاورما لحم بقري مع ثومية.", image: IMG.shawarma, price: 34, rating: 4.6, calories: 540, protein: 32, carbs: 40, fat: 26, category: "popular", isPopular: true },
    { slug: "lentil", name: "شوربة عدس", description: "عدس كريمي مع خبز.", image: IMG.soup, price: 12, rating: 4.1, calories: 210, protein: 10, carbs: 28, fat: 6, category: "menu", spicyOption: false },
  ],
  "aseel-burger": [
    { slug: "classic", name: "برجر كلاسيك", description: "لحم بقري مع جبنة وخس.", image: IMG.burger, price: 36, rating: 4.6, calories: 650, protein: 32, carbs: 48, fat: 32, category: "popular", isPopular: true },
    { slug: "double", name: "دبل تشيز", description: "قطعتان لحم مع شيدر.", image: IMG.burger2, price: 48, rating: 4.8, calories: 890, protein: 48, carbs: 52, fat: 48, category: "offers", isOffer: true, offerPrice: 42 },
    { slug: "crispy", name: "برجر دجاج مقرمش", description: "صدر دجاج مقلي ومايونيز.", image: IMG.burger, price: 34, rating: 4.5, calories: 580, protein: 30, carbs: 50, fat: 26, category: "popular", isPopular: true },
    { slug: "fries", name: "بطاطس مقلية", description: "بطاطس ذهبية ببهارات أصيل.", image: IMG.fries, price: 12, rating: 4.4, calories: 320, protein: 4, carbs: 42, fat: 14, category: "menu", spicyOption: false },
    { slug: "shake", name: "ميلك شيك فانيلا", description: "حليب كريمي بالفانيلا.", image: IMG.shake, price: 18, rating: 4.3, calories: 380, protein: 8, carbs: 48, fat: 16, category: "menu", spicyOption: false },
    { slug: "bbq", name: "برجر باربكيو", description: "لحم مع صلصة باربكيو وبصل.", image: IMG.burger2, price: 42, rating: 4.5, calories: 720, protein: 36, carbs: 50, fat: 34, category: "menu" },
    { slug: "mushroom", name: "برجر مشروم", description: "لحم مع صلصة مشروم كريمية.", image: IMG.burger, price: 40, rating: 4.4, calories: 700, protein: 34, carbs: 46, fat: 36, category: "menu" },
    { slug: "combo", name: "وجبة كومبو", description: "برجر + بطاطس + مشروب.", image: IMG.burger2, price: 49, rating: 4.7, calories: 980, protein: 36, carbs: 90, fat: 42, category: "offers", isOffer: true, offerPrice: 44, isPopular: true, cashbackPercent: 12 },
    { slug: "onion", name: "حلقات بصل", description: "حلقات بصل مقرمشة.", image: IMG.fries, price: 14, rating: 4.2, calories: 360, protein: 5, carbs: 38, fat: 18, category: "menu", spicyOption: false },
    { slug: "kids", name: "وجبة أطفال", description: "برجر صغير مع بطاطس.", image: IMG.burger, price: 26, rating: 4.3, calories: 480, protein: 20, carbs: 45, fat: 22, category: "menu", spicyOption: false },
  ],
  "sushi-noi": [
    { slug: "salmon", name: "رول سلمون", description: "سلمون وأفوكادو وسمسم.", image: IMG.sushi2, price: 55, rating: 4.8, calories: 420, protein: 24, carbs: 48, fat: 14, category: "popular", isPopular: true, spicyOption: false },
    { slug: "tuna", name: "نينيري تونا", description: "تونا على أرز متبل.", image: IMG.tuna, price: 62, rating: 4.7, calories: 380, protein: 28, carbs: 42, fat: 10, category: "menu", spicyOption: false },
    { slug: "tempura", name: "رول تمبورا", description: "روبيان تمبورا ومايونيز حار.", image: IMG.tempura, price: 48, rating: 4.6, calories: 510, protein: 20, carbs: 55, fat: 22, category: "offers", isOffer: true, offerPrice: 40, isPopular: true },
    { slug: "miso", name: "شوربة ميسو", description: "ميسو مع توفو وأعشاب.", image: IMG.soup, price: 16, rating: 4.4, calories: 90, protein: 6, carbs: 8, fat: 3, category: "menu", spicyOption: false },
    { slug: "edamame", name: "إدامامي", description: "فول صويا بملح البحر.", image: IMG.green, price: 14, rating: 4.2, calories: 150, protein: 12, carbs: 10, fat: 6, category: "menu", spicyOption: false },
    { slug: "dragon", name: "دراغون رول", description: "رول مع أنقليس وأفوكادو.", image: IMG.sushi, price: 68, rating: 4.7, calories: 520, protein: 22, carbs: 58, fat: 18, category: "popular", isPopular: true },
    { slug: "veggie", name: "رول خضار", description: "خيار وجزر وأفوكادو.", image: IMG.sushi2, price: 36, rating: 4.3, calories: 300, protein: 8, carbs: 48, fat: 8, category: "menu", spicyOption: false },
    { slug: "set", name: "سيت سوشي", description: "تشكيلة 16 قطعة.", image: IMG.sushi, price: 99, rating: 4.8, calories: 780, protein: 40, carbs: 90, fat: 22, category: "offers", isOffer: true, offerPrice: 85 },
    { slug: "ramen", name: "رامن دجاج", description: "شوربة رامن مع نودلز.", image: IMG.soup, price: 45, rating: 4.5, calories: 560, protein: 28, carbs: 62, fat: 16, category: "menu" },
    { slug: "gyoza", name: "غيوزا", description: "زلابية لحم مشوية.", image: IMG.tempura, price: 28, rating: 4.4, calories: 340, protein: 14, carbs: 32, fat: 14, category: "popular", isPopular: true },
  ],
  "halawiyat-riyadh": [
    { slug: "kunafa", name: "كنافة نابلسية", description: "كنافة بالجبن والقطر.", image: IMG.sweet, price: 32, rating: 4.9, calories: 480, protein: 10, carbs: 62, fat: 20, category: "offers", isOffer: true, offerPrice: 26, isPopular: true, spicyOption: false, cashbackPercent: 8 },
    { slug: "basbousa", name: "بسبوسة بالقشطة", description: "بسبوسة طرية بالقشطة.", image: IMG.cake, price: 24, rating: 4.7, calories: 390, protein: 6, carbs: 52, fat: 16, category: "popular", isPopular: true, spicyOption: false },
    { slug: "baklava", name: "بقلاوة مشكلة", description: "بقلاوة فستق وجوز.", image: IMG.baklava, price: 28, rating: 4.8, calories: 420, protein: 8, carbs: 48, fat: 22, category: "menu", spicyOption: false },
    { slug: "luqaimat", name: "لقيمات", description: "لقيمات مع دبس وسمسم.", image: IMG.dessert, price: 18, rating: 4.6, calories: 340, protein: 4, carbs: 48, fat: 14, category: "popular", isPopular: true, spicyOption: false },
    { slug: "cheesecake", name: "تشيز كيك فراولة", description: "تشيز كيك مع فراولة.", image: IMG.cheesecake, price: 30, rating: 4.5, calories: 450, protein: 8, carbs: 42, fat: 26, category: "menu", spicyOption: false },
    { slug: "umali", name: "أم علي", description: "أم علي ساخنة بالمكسرات.", image: IMG.cake, price: 26, rating: 4.6, calories: 410, protein: 9, carbs: 48, fat: 18, category: "menu", spicyOption: false },
    { slug: "maamoul", name: "معمول تمر", description: "معمول محشو بالتمر.", image: IMG.baklava, price: 20, rating: 4.4, calories: 300, protein: 4, carbs: 40, fat: 12, category: "menu", spicyOption: false },
    { slug: "box", name: "بوكس حلويات", description: "تشكيلة صغيرة للتذوق.", image: IMG.sweet, price: 55, rating: 4.8, calories: 900, protein: 14, carbs: 110, fat: 40, category: "offers", isOffer: true, offerPrice: 48, spicyOption: false },
    { slug: "qahwa", name: "قهوة عربية", description: "قهوة سعودية مع تمر.", image: IMG.dessert, price: 12, rating: 4.5, calories: 40, protein: 0, carbs: 6, fat: 0, category: "menu", spicyOption: false },
    { slug: "ice", name: "آيس كريم فستق", description: "آيس كريم بالفستق الحلبي.", image: IMG.cheesecake, price: 22, rating: 4.4, calories: 280, protein: 5, carbs: 30, fat: 14, category: "popular", isPopular: true, spicyOption: false },
  ],
  "pizza-roma": [
    { slug: "margherita", name: "مارغريتا", description: "صلصة طماطم وموزاريلا.", image: IMG.pizza, price: 38, rating: 4.5, calories: 620, protein: 22, carbs: 70, fat: 22, category: "popular", isPopular: true, spicyOption: false },
    { slug: "pepperoni", name: "بيبروني", description: "بيبروني حار وجبنة.", image: IMG.pizza2, price: 48, rating: 4.7, calories: 740, protein: 28, carbs: 68, fat: 32, category: "offers", isOffer: true, offerPrice: 42 },
    { slug: "four-cheese", name: "أربع أجبان", description: "مزيج جبن إيطالي.", image: IMG.pizza, price: 52, rating: 4.6, calories: 780, protein: 30, carbs: 65, fat: 38, category: "popular", isPopular: true, spicyOption: false },
    { slug: "veggie", name: "بيتزا خضار", description: "فلفل ومشروم وزيتون.", image: IMG.pizza2, price: 42, rating: 4.3, calories: 580, protein: 18, carbs: 72, fat: 18, category: "menu", spicyOption: false },
    { slug: "pasta", name: "باستا بولونيز", description: "سباغيتي بلحم مفروم.", image: IMG.pasta, price: 40, rating: 4.4, calories: 640, protein: 26, carbs: 75, fat: 20, category: "menu" },
    { slug: "alfredo", name: "فيتوتشيني ألفريدو", description: "صلصة كريمة ودجاج.", image: IMG.pasta, price: 44, rating: 4.5, calories: 720, protein: 28, carbs: 70, fat: 30, category: "popular", isPopular: true, spicyOption: false },
    { slug: "garlic-bread", name: "خبز بالثوم", description: "خبز مقرمش بزبدة الثوم.", image: IMG.fries, price: 16, rating: 4.2, calories: 340, protein: 8, carbs: 38, fat: 14, category: "menu", spicyOption: false },
    { slug: "calzone", name: "كالزوني", description: "بيتزا مطوية محشوة.", image: IMG.pizza, price: 46, rating: 4.4, calories: 700, protein: 30, carbs: 68, fat: 28, category: "menu" },
    { slug: "family", name: "بيتزا عائلية", description: "حجم كبير يكفي 4.", image: IMG.pizza2, price: 89, rating: 4.6, calories: 1400, protein: 50, carbs: 140, fat: 55, category: "offers", isOffer: true, offerPrice: 79 },
    { slug: "tiramisu", name: "تيراميسو", description: "حلوى إيطالية كلاسيكية.", image: IMG.cake, price: 28, rating: 4.7, calories: 420, protein: 7, carbs: 40, fat: 24, category: "menu", spicyOption: false },
  ],
  "hindi-masala": [
    { slug: "butter-chicken", name: "بطر تشيكن", description: "دجاج بصلصة طماطم كريمية.", image: IMG.indian, price: 48, rating: 4.7, calories: 680, protein: 36, carbs: 40, fat: 36, category: "popular", isPopular: true },
    { slug: "biryani", name: "برياني دجاج", description: "أرز برياني بالتوابل.", image: IMG.rice, price: 42, rating: 4.6, calories: 720, protein: 32, carbs: 80, fat: 24, category: "offers", isOffer: true, offerPrice: 36, isPopular: true, cashbackPercent: 10 },
    { slug: "tikka-masala", name: "تكا مسايا", description: "دجاج تكا بصلصة مسايا.", image: IMG.indian, price: 46, rating: 4.5, calories: 640, protein: 34, carbs: 38, fat: 32, category: "popular", isPopular: true },
    { slug: "samosa", name: "سمبوسة هندية", description: "سمبوسة بطاطس وبازلاء.", image: IMG.falafel, price: 18, rating: 4.3, calories: 320, protein: 8, carbs: 36, fat: 14, category: "menu" },
    { slug: "naan", name: "خبز نان", description: "نان طازج من الفرن.", image: IMG.pizza2, price: 10, rating: 4.4, calories: 260, protein: 7, carbs: 45, fat: 5, category: "menu", spicyOption: false },
    { slug: "dal", name: "دال هندي", description: "عدس متبل كريمي.", image: IMG.soup, price: 24, rating: 4.2, calories: 340, protein: 14, carbs: 42, fat: 10, category: "menu", spicyOption: false },
    { slug: "paneer", name: "بانير تكّا", description: "جبنة بانير مشوية.", image: IMG.hummus, price: 38, rating: 4.4, calories: 480, protein: 22, carbs: 20, fat: 30, category: "menu", spicyOption: false },
    { slug: "thali", name: "ثالي هندي", description: "وجبة كاملة متنوعة.", image: IMG.indian, price: 59, rating: 4.6, calories: 950, protein: 40, carbs: 100, fat: 35, category: "offers", isOffer: true, offerPrice: 52 },
    { slug: "lassi", name: "لاسي مانجو", description: "مشروب زبادي بالمانجو.", image: IMG.shake, price: 16, rating: 4.5, calories: 220, protein: 6, carbs: 35, fat: 6, category: "menu", spicyOption: false },
    { slug: "vindaloo", name: "فيندالو لحم", description: "لحم حار جداً على الطريقة الهندية.", image: IMG.meat, price: 54, rating: 4.5, calories: 700, protein: 40, carbs: 30, fat: 38, category: "menu", spicyOption: true },
  ],
  "kabsa-dar": [
    { slug: "chicken-kabsa", name: "كبسة دجاج", description: "كبسة سعودية كلاسيكية.", image: IMG.rice, price: 42, rating: 4.8, calories: 720, protein: 38, carbs: 75, fat: 24, category: "popular", isPopular: true },
    { slug: "lamb-kabsa", name: "كبسة لحم", description: "كبسة بلحم غنم طري.", image: IMG.rice, price: 55, rating: 4.7, calories: 820, protein: 42, carbs: 72, fat: 32, category: "offers", isOffer: true, offerPrice: 48, isPopular: true },
    { slug: "mandi", name: "مندي دجاج", description: "مندي على الطريقة الحضرمية.", image: IMG.chicken, price: 48, rating: 4.6, calories: 700, protein: 40, carbs: 68, fat: 26, category: "popular", isPopular: true },
    { slug: "madhbi", name: "مظبي", description: "دجاج مظبي مع أرز.", image: IMG.grill, price: 52, rating: 4.5, calories: 740, protein: 42, carbs: 70, fat: 28, category: "menu" },
    { slug: "saleeg", name: "سليق", description: "سليق كريمي بالحليب.", image: IMG.soup, price: 36, rating: 4.3, calories: 580, protein: 28, carbs: 55, fat: 22, category: "menu", spicyOption: false },
    { slug: "jarish", name: "جريش", description: "جريش سعودي تقليدي.", image: IMG.soup, price: 28, rating: 4.2, calories: 420, protein: 14, carbs: 50, fat: 14, category: "menu", spicyOption: false },
    { slug: "mutabbaq", name: "مطبق لحم", description: "مطبق مقرمش محشو.", image: IMG.falafel, price: 18, rating: 4.4, calories: 380, protein: 14, carbs: 36, fat: 18, category: "menu" },
    { slug: "family-kabsa", name: "كبسة عائلية", description: "تكفي 4 أشخاص.", image: IMG.rice, price: 129, rating: 4.8, calories: 2200, protein: 110, carbs: 220, fat: 80, category: "offers", isOffer: true, offerPrice: 109 },
    { slug: "dates", name: "تمر بالقشطة", description: "تمر فاخر مع قشطة.", image: IMG.dessert, price: 22, rating: 4.5, calories: 320, protein: 4, carbs: 45, fat: 12, category: "menu", spicyOption: false },
    { slug: "laban", name: "لبن طازج", description: "لبن رائب بارد.", image: IMG.shake, price: 8, rating: 4.1, calories: 120, protein: 6, carbs: 10, fat: 5, category: "menu", spicyOption: false },
  ],
  "seafood-coast": [
    { slug: "shrimp", name: "روبيان مشوي", description: "روبيان طازج على الفحم.", image: IMG.seafood, price: 75, rating: 4.6, calories: 420, protein: 38, carbs: 8, fat: 22, category: "popular", isPopular: true },
    { slug: "fish", name: "سمك هامور", description: "هامور مقلي أو مشوي.", image: IMG.seafood, price: 85, rating: 4.5, calories: 520, protein: 45, carbs: 12, fat: 26, category: "offers", isOffer: true, offerPrice: 72 },
    { slug: "sayadiyah", name: "صيادية", description: "أرز صيادية مع سمك.", image: IMG.rice, price: 55, rating: 4.4, calories: 680, protein: 36, carbs: 70, fat: 22, category: "popular", isPopular: true },
    { slug: "calamari", name: "كاليماري مقلي", description: "حلقات حبار مقرمشة.", image: IMG.fries, price: 42, rating: 4.3, calories: 480, protein: 24, carbs: 35, fat: 24, category: "menu" },
    { slug: "mixed-seafood", name: "مشكل بحري", description: "روبيان وسمك وكاليماري.", image: IMG.seafood, price: 99, rating: 4.7, calories: 780, protein: 55, carbs: 30, fat: 38, category: "offers", isOffer: true, offerPrice: 89, isPopular: true },
    { slug: "fish-sandwich", name: "ساندويتش سمك", description: "فيليه سمك مع صلصة.", image: IMG.burger, price: 32, rating: 4.2, calories: 520, protein: 28, carbs: 45, fat: 20, category: "menu" },
    { slug: "soup-fish", name: "شوربة سمك", description: "مرقة سمك بالخضار.", image: IMG.soup, price: 22, rating: 4.3, calories: 210, protein: 18, carbs: 14, fat: 8, category: "menu", spicyOption: false },
    { slug: "grilled-salmon", name: "سلمون مشوي", description: "سلمون مع خضار مشوية.", image: IMG.tuna, price: 78, rating: 4.6, calories: 540, protein: 42, carbs: 10, fat: 32, category: "popular", isPopular: true, spicyOption: false },
    { slug: "rice-shrimp", name: "أرز بالروبيان", description: "أرز بسمتي مع روبيان.", image: IMG.rice, price: 48, rating: 4.4, calories: 620, protein: 30, carbs: 72, fat: 18, category: "menu" },
    { slug: "fries-side", name: "بطاطس ساحلية", description: "بطاطس ببهارات البحر.", image: IMG.fries, price: 14, rating: 4.1, calories: 340, protein: 4, carbs: 42, fat: 16, category: "menu", spicyOption: false },
  ],
  "healthy-bowl": [
    { slug: "quinoa", name: "بول كينوا", description: "كينوا مع خضار مشوية.", image: IMG.bowl, price: 36, rating: 4.4, calories: 420, protein: 16, carbs: 48, fat: 14, category: "popular", isPopular: true, spicyOption: false },
    { slug: "chicken-salad", name: "سلطة دجاج مشوي", description: "خس ودجاج وصلصة خفيفة.", image: IMG.salad, price: 34, rating: 4.5, calories: 380, protein: 32, carbs: 18, fat: 16, category: "offers", isOffer: true, offerPrice: 29, isPopular: true, spicyOption: false },
    { slug: "avocado", name: "توست أفوكادو", description: "خبز أسمر مع أفوكادو.", image: IMG.green, price: 28, rating: 4.3, calories: 360, protein: 10, carbs: 32, fat: 20, category: "menu", spicyOption: false },
    { slug: "smoothie", name: "سموذي أخضر", description: "سبانخ وموز وتفاح.", image: IMG.shake, price: 22, rating: 4.2, calories: 210, protein: 5, carbs: 40, fat: 2, category: "menu", spicyOption: false },
    { slug: "poke", name: "بوكيه سلمون", description: "أرز مع سلمون طازج.", image: IMG.bowl, price: 48, rating: 4.6, calories: 520, protein: 28, carbs: 50, fat: 18, category: "popular", isPopular: true, spicyOption: false },
    { slug: "wrap", name: "راب دجاج صحي", description: "راب أسمر مع خضار.", image: IMG.shawarma, price: 30, rating: 4.3, calories: 400, protein: 26, carbs: 38, fat: 12, category: "menu" },
    { slug: "soup-veg", name: "شوربة خضار", description: "خضار طازجة بدون كريمة.", image: IMG.soup, price: 16, rating: 4.1, calories: 140, protein: 5, carbs: 20, fat: 4, category: "menu", spicyOption: false },
    { slug: "energy", name: "وجبة طاقة", description: "بول + سموذي.", image: IMG.bowl, price: 49, rating: 4.5, calories: 580, protein: 20, carbs: 70, fat: 16, category: "offers", isOffer: true, offerPrice: 42, spicyOption: false },
    { slug: "falafel-bowl", name: "بول فلافل", description: "فلافل مخبوز مع سلطة.", image: IMG.falafel, price: 32, rating: 4.2, calories: 450, protein: 16, carbs: 48, fat: 16, category: "menu", spicyOption: false },
    { slug: "yogurt", name: "زبادي بالعسل", description: "زبادي يوناني وعسل ومكسرات.", image: IMG.dessert, price: 18, rating: 4.4, calories: 260, protein: 12, carbs: 28, fat: 8, category: "popular", isPopular: true, spicyOption: false },
  ],
  "luqma-mart": [
    { slug: "milk", name: "حليب طازج 1 لتر", description: "حليب كامل الدسم.", image: IMG.shake, price: 8, rating: 4.5, calories: 150, protein: 8, carbs: 12, fat: 8, category: "popular", isPopular: true, spicyOption: false, addons: [] },
    { slug: "eggs", name: "بيض طازج (30)", description: "كرتونة بيض بلدي.", image: IMG.bowl, price: 22, rating: 4.6, calories: 70, protein: 6, carbs: 1, fat: 5, category: "popular", isPopular: true, spicyOption: false, addons: [] },
    { slug: "bread", name: "خبز توست", description: "رغيف توست طازج.", image: IMG.pizza2, price: 6, rating: 4.3, calories: 180, protein: 6, carbs: 32, fat: 2, category: "menu", spicyOption: false, addons: [] },
    { slug: "water", name: "مياه معدنية (6)", description: "عبوة مياه 6 قطع.", image: IMG.green, price: 9, rating: 4.4, calories: 0, protein: 0, carbs: 0, fat: 0, category: "menu", spicyOption: false, addons: [] },
    { slug: "rice-pack", name: "أرز بسمتي 5 كغ", description: "أرز بسمتي فاخر.", image: IMG.rice, price: 45, rating: 4.7, calories: 350, protein: 7, carbs: 78, fat: 1, category: "offers", isOffer: true, offerPrice: 39, spicyOption: false, cashbackPercent: 5, addons: [] },
    { slug: "oil", name: "زيت ذرة 1.5 لتر", description: "زيت ذرة للطبخ.", image: IMG.bowl, price: 28, rating: 4.2, calories: 120, protein: 0, carbs: 0, fat: 14, category: "menu", spicyOption: false, addons: [] },
    { slug: "cheese", name: "جبنة مثلثات", description: "علبة جبنة مثلثات.", image: IMG.hummus, price: 14, rating: 4.3, calories: 90, protein: 5, carbs: 2, fat: 7, category: "popular", isPopular: true, spicyOption: false, addons: [] },
    { slug: "juice", name: "عصير برتقال 1 لتر", description: "عصير برتقال طبيعي.", image: IMG.shake, price: 12, rating: 4.4, calories: 110, protein: 1, carbs: 26, fat: 0, category: "offers", isOffer: true, offerPrice: 10, spicyOption: false, cashbackPercent: 8, addons: [] },
    { slug: "dates", name: "تمر سكري 1 كغ", description: "تمر سكري فاخر.", image: IMG.dessert, price: 35, rating: 4.8, calories: 280, protein: 2, carbs: 75, fat: 0, category: "menu", spicyOption: false, addons: [] },
    { slug: "combo-home", name: "بوكس البيت", description: "حليب + بيض + خبز + مياه.", image: IMG.bowl, price: 49, rating: 4.6, calories: 400, protein: 20, carbs: 45, fat: 15, category: "offers", isOffer: true, offerPrice: 42, isPopular: true, spicyOption: false, cashbackPercent: 10, addons: [] },
  ],
};

export const meals: Meal[] = restaurants.flatMap((r) => {
  const seeds = catalog[r.id];
  if (!seeds || seeds.length !== 10) {
    throw new Error(`Expected 10 meals for ${r.id}, got ${seeds?.length ?? 0}`);
  }
  return buildMeals(r.id, seeds);
});

export function getMealById(id: string): Meal | undefined {
  return meals.find((m) => m.id === id);
}

export function getMealsByRestaurant(restaurantId: string): Meal[] {
  return meals.filter((m) => m.restaurantId === restaurantId);
}

export function getMealPrice(meal: Meal): number {
  return meal.isOffer && meal.offerPrice != null ? meal.offerPrice : meal.price;
}

export function searchCatalog(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return { restaurants: [], meals: [] };
  }

  const matchedRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) ||
      (r.tags ?? []).some((t) => t.toLowerCase().includes(q)),
  );

  const matchedMeals = meals.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q),
  );

  return { restaurants: matchedRestaurants, meals: matchedMeals };
}

export type SearchSuggestion = {
  id: string;
  label: string;
  href: string;
  kind: "restaurant" | "meal";
  meta?: string;
};

export function getSearchSuggestions(
  query: string,
  limit = 3,
): SearchSuggestion[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const items: SearchSuggestion[] = [];

  for (const r of restaurants) {
    if (
      r.name.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q)
    ) {
      items.push({
        id: `r-${r.id}`,
        label: r.name,
        href: `/restaurants/${r.id}`,
        kind: "restaurant",
        meta: r.cuisine,
      });
    }
  }

  for (const m of meals) {
    if (
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
    ) {
      items.push({
        id: `m-${m.id}`,
        label: m.name,
        href: `/meals/${m.id}?from=home`,
        kind: "meal",
        meta: "وجبة",
      });
    }
  }

  return items.slice(0, limit);
}

export function lineUnitPrice(
  meal: Meal,
  spicy: boolean,
  addons: { price: number }[],
): number {
  const base = getMealPrice(meal);
  const spicyFee = spicy && meal.spicyOption ? 2 : 0;
  const addonsTotal = addons.reduce((s, a) => s + a.price, 0);
  return base + spicyFee + addonsTotal;
}
