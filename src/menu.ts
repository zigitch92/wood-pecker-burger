import imgBurgerClassique from "@/imports/classic-burger.jpg.jpg";
import imgBurgerChicken from "@/imports/chicken-burger.png.png";
import imgBurgerSpicy from "@/imports/spicy-burger.png.png";
import imgJusCarotte from "@/imports/carrot-juice.png.png";
import imgJusOrange from "@/imports/orange-juice.png.png";
import imgMojito from "@/imports/mojito-juice.png.png";

export type Category = "burgers" | "drinks";

export interface Product {
  id: string;
  category: Category;
  name: string;
  price: number;
  shortIngredients: string;
  ingredients: string;
  imageBg: string;
  image: string;
  imagePosition?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "burger-classique",
    category: "burgers",
    name: "Burger Classique",
    price: 650,
    shortIngredients: "Steak haché 180g, cheddar, salade, tomate",
    ingredients:
      "Pain burger, steak haché du bœuf (180g), cheddar fondu, salade fraîche, tomate et sauce burger maison.",
    imageBg: "#3A1A08",
    image: imgBurgerClassique,
    imagePosition: "75% center",
  },
  {
    id: "burger-chicken",
    category: "burgers",
    name: "Burger Chicken",
    price: 700,
    shortIngredients: "Poulet pané, cheddar, salade, sauce curry",
    ingredients:
      "Pain burger, poulet pané croustillant, cheddar fondu, salade fraîche, tomate fraîche et sauce curry.",
    imageBg: "#2A1A08",
    image: imgBurgerChicken,
    imagePosition: "75% center",
  },
  {
    id: "burger-spicy",
    category: "burgers",
    name: "Burger Spicy",
    price: 750,
    shortIngredients: "Steak haché 100g, cheddar, sauce BBQ chilli",
    ingredients:
      "Pain burger, steak haché de bœuf (100g), cheddar fondu, salade, tomate, sauce barbecue et chilli.",
    imageBg: "#2A0808",
    image: imgBurgerSpicy,
    imagePosition: "75% center",
  },
  {
    id: "mojito",
    category: "drinks",
    name: "Mojito Classique",
    price: 350,
    shortIngredients: "Menthe fraîche, citron, eau gazeuse, glace",
    ingredients:
      "Menthe fraîche, citron pressé, sucre, eau gazeuse et glace pilée.",
    imageBg: "#0A2A14",
    image: imgMojito,
    imagePosition: "70% center",
  },
  {
    id: "jus-orange",
    category: "drinks",
    name: "Jus d'Orange",
    price: 300,
    shortIngredients: "Orange fraîche, sucre, glace pilée",
    ingredients: "Orange fraîche pressée, sucre et glace pilée.",
    imageBg: "#2A1408",
    image: imgJusOrange,
    imagePosition: "70% center",
  },
  {
    id: "jus-carotte",
    category: "drinks",
    name: "Jus de Carotte",
    price: 300,
    shortIngredients: "Carotte fraîche, sauce carotte, glace pilée",
    ingredients: "Carotte fraîche, jus de carotte et glace pilée.",
    imageBg: "#2A1208",
    image: imgJusCarotte,
    imagePosition: "70% center",
  },
];
