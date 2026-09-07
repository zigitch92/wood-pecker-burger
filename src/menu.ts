import imgBurgerClassique from "@/imports/burger-classique-new.png";
import imgBurgerChicken from "@/imports/burger-chicken-new.png";
import imgBurgerSpicy from "@/imports/burger-spicy-new.png";
import imgJusCarotte from "@/imports/carrot-juice-new.png";
import imgJusOrange from "@/imports/orange-juice-new.png";
import imgMojito from "@/imports/mojito-new.png";

import imgHomeBurgerClassique from "@/imports/classic-burger.jpg.jpg";
import imgHomeBurgerChicken from "@/imports/chicken-burger.png.png";
import imgHomeBurgerSpicy from "@/imports/spicy-burger.png.png";
import imgHomeJusCarotte from "@/imports/carrot-juice.png.png";
import imgHomeJusOrange from "@/imports/orange-juice.png.png";
import imgHomeMojito from "@/imports/mojito-juice.png.png";

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
  homeImage: string;
  homeImageBg: string;
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
    imageBg: "#fdf6ec",
    image: imgBurgerClassique,
    homeImage: imgHomeBurgerClassique,
    homeImageBg: "#1a1a1a",
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
    imageBg: "#fdf6ec",
    image: imgBurgerChicken,
    homeImage: imgHomeBurgerChicken,
    homeImageBg: "#1a1a1a",
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
    imageBg: "#fdf6ec",
    image: imgBurgerSpicy,
    homeImage: imgHomeBurgerSpicy,
    homeImageBg: "#1a1a1a",
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
    imageBg: "#fdf6ec",
    image: imgMojito,
    homeImage: imgHomeMojito,
    homeImageBg: "#fdf6ec",
    imagePosition: "70% center",
  },
  {
    id: "jus-orange",
    category: "drinks",
    name: "Jus d'Orange",
    price: 300,
    shortIngredients: "Orange fraîche, sucre, glace pilée",
    ingredients: "Orange fraîche pressée, sucre et glace pilée.",
    imageBg: "#fdf6ec",
    image: imgJusOrange,
    homeImage: imgHomeJusOrange,
    homeImageBg: "#fdf6ec",
    imagePosition: "70% center",
  },
  {
    id: "jus-carotte",
    category: "drinks",
    name: "Jus de Carotte",
    price: 300,
    shortIngredients: "Carotte fraîche, sauce carotte, glace pilée",
    ingredients: "Carotte fraîche, jus de carotte et glace pilée.",
    imageBg: "#fdf6ec",
    image: imgJusCarotte,
    homeImage: imgHomeJusCarotte,
    homeImageBg: "#fdf6ec",
    imagePosition: "70% center",
  },
];
