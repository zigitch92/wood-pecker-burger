import { useState } from "react";
import imgBurgerClassique from "@/imports/classic-burger.jpg.jpg";
import imgBurgerChicken from "@/imports/chicken-burger.png.png";
import imgBurgerSpicy from "@/imports/spicy-burger.png.png";
import imgJusCarotte from "@/imports/carrot-juice.png.png";
import imgJusOrange from "@/imports/orange-juice.png.png";
import imgMojito from "@/imports/mojito-juice.png.png";
import logo from "@/imports/logo.png.jpg";
import couverture from "@/imports/couverture.png.jpeg";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen =
  | "home"
  | "menu"
  | "cart"
  | "profile"
  | "product"
  | "checkout"
  | "confirmation";

type Category = "burgers" | "drinks";

interface Product {
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

interface CartItem {
  product: Product;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: "Livrée" | "En livraison" | "Préparation" | "Commande reçue";
  address: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
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

// ─── Image Placeholder ────────────────────────────────────────────────────────

function ProductImage({
  product,
  size = "md",
}: {
  product: Product;
  size?: "sm" | "md" | "lg";
}) {
  const heights: Record<string, string> = {
    sm: "h-20",
     md: "h-32",
    lg: "h-64",
  };
  return (
    <div
      className={`w-full ${heights[size]} rounded-xl overflow-hidden relative`}
      style={{ backgroundColor: product.imageBg }}
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover"
        style={{ objectPosition: product.imagePosition ?? "70% center" }}
      />
    </div>
  );
}

// ─── Bottom Navigation ────────────────────────────────────────────────────────

function BottomNav({
  screen,
  onNav,
  cartCount,
}: {
  screen: Screen;
  onNav: (s: Screen) => void;
  cartCount: number;
}) {
  const tabs: { id: Screen; label: string; icon: string }[] = [
    { id: "home", label: "Accueil", icon: "⌂" },
    { id: "menu", label: "Menu", icon: "◈" },
    { id: "cart", label: "Panier", icon: "◻" },
    { id: "profile", label: "Profil", icon: "◯" },
  ];

  return (
    <nav
      className="absolute bottom-0 left-0 right-0 z-50 flex items-stretch"
      style={{
        backgroundColor: "#f8ecd8",
        borderTop: "1px solid #e3d5c3",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {tabs.map((tab) => {
        const active =
          screen === tab.id ||
          (screen === "product" && tab.id === "menu") ||
          (screen === "checkout" && tab.id === "cart") ||
          (screen === "confirmation" && tab.id === "cart");
        return (
          <button
            key={tab.id}
            onClick={() => onNav(tab.id)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 relative"
          >
            {tab.id === "cart" && cartCount > 0 && (
              <span
                className="absolute top-2 right-[calc(50%-10px)] text-[10px] font-bold text-white rounded-full w-4 h-4 flex items-center justify-center"
                style={{ backgroundColor: "#c85a32" }}
              >
                {cartCount}
              </span>
            )}
            <div
              className="text-base font-light"
              style={{ color: active ? "#c85a32" : "#8b7768" }}
            >
              {tab.icon}
            </div>
            <span
              className="text-[10px] font-semibold tracking-wide"
              style={{ color: active ? "#c85a32" : "#8b7768" }}
            >
              {tab.label}
            </span>
            {active && (
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                style={{ backgroundColor: "#c85a32" }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onAdd,
  onOpen,
  isFav,
  onFav,
}: {
  product: Product;
  onAdd: () => void;
  onOpen: () => void;
  isFav: boolean;
  onFav: () => void;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden flex-shrink-0"
       style={{ backgroundColor: "#f8ecd8", width: "220px" }}
    >
      <div className="relative cursor-pointer" onClick={onOpen}>
        <ProductImage product={product} size="md" />
        <button
          className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={(e) => {
            e.stopPropagation();
            onFav();
          }}
        >
          <span className="text-sm">{isFav ? "❤️" : "🤍"}</span>
        </button>
      </div>
      <div className="p-3">
        <p
          className="font-bold text-sm leading-tight"
          style={{ color: "#33251f" }}
        >
          {product.name}
        </p>
        <p
          className="text-[11px] mt-0.5 line-clamp-2 leading-snug"
          style={{ color: "#8b7768" }}
        >
          {product.shortIngredients}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-sm" style={{ color: "#c85a32" }}>
            {product.price} DA
          </span>
          <button
            onClick={onAdd}
            className="text-white text-xs font-bold px-3 py-1.5 rounded-xl"
            style={{ backgroundColor: "#c85a32" }}
          >
            + Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────

function HomeScreen({
  onNav,
  cart,
  onAddToCart,
  onOpenProduct,
  favs,
  onToggleFav,
  searchQuery,
  onSearch,
}: {
  onNav: (s: Screen) => void;
  cart: CartItem[];
  onAddToCart: (p: Product) => void;
  onOpenProduct: (p: Product) => void;
  favs: Set<string>;
  onToggleFav: (id: string) => void;
  searchQuery: string;
  onSearch: (q: string) => void;
}) {
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const [activeCategory, setActiveCategory] = useState<Category>("burgers");

  const burgers = PRODUCTS.filter((p) => p.category === "burgers");
  const drinks = PRODUCTS.filter((p) => p.category === "drinks");

  const filtered = (activeCategory === "burgers" ? burgers : drinks).filter(
    (p) =>
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ingredients.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="flex flex-col min-h-full pb-20"
      style={{ background: "linear-gradient(135deg, #d4b17d 0%, #a84435 100%)" }}
    >
      {/* Header */}
      <div className="px-5 pt-12 pb-5 flex items-center justify-between">
        {/* Logo placeholder */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#f8ecd8" }}>
            <img
              src={logo}
              alt="Wood Pecker Burger"
              className="w-full h-full object-contain object-center rounded-full"
            />
          </div>
          <div>
            <p
              className="font-black text-base tracking-wider leading-none"
              style={{ color: "#33251f" }}
            >
              WOOD PECKER
            </p>
            <p className="text-[10px] tracking-widest" style={{ color: "#c85a32" }}>
              BURGER
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center relative"
            style={{ backgroundColor: "#f8ecd8" }}
            onClick={() => onNav("cart")}
          >
            <span className="text-base">🛒</span>
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 text-[9px] font-black text-white rounded-full w-4 h-4 flex items-center justify-center"
                style={{ backgroundColor: "#c85a32" }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div
        className="mx-5 rounded-2xl mb-5 relative overflow-hidden"
        style={{ backgroundColor: "#f8ecd8", minHeight: "125px" }}
      >
        {/* Background food photo */}
        <img
          src={couverture}
          alt="Couverture Wood Pecker Burger"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center", opacity: 0.85 }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(20,12,10,0.72), rgba(20,12,10,0.04) 70%)" }} />
        <div className="absolute bottom-4 left-5 z-10">
          <button
            className="text-white text-xs font-bold px-4 py-2 rounded-xl"
            style={{ backgroundColor: "#c85a32" }}
            onClick={() => onNav("menu")}
          >
            Voir le menu →
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mx-5 mb-5 flex gap-3">
        <button
          onClick={() => setActiveCategory("burgers")}
          className="min-w-0 flex-1 flex items-center justify-center gap-1 py-3.5 rounded-2xl font-bold text-xs transition-all"
          style={{
            backgroundColor: activeCategory === "burgers" ? "#c85a32" : "#f8ecd8",
            color: activeCategory === "burgers" ? "#fff" : "#8b7768",
          }}
        >
          🍔 <span>NOS BURGERS</span>
        </button>
        <button
          onClick={() => setActiveCategory("drinks")}
          className="min-w-0 flex-1 flex items-center justify-center gap-1 py-3.5 rounded-2xl font-bold text-xs transition-all"
          style={{
            backgroundColor: activeCategory === "drinks" ? "#c85a32" : "#f8ecd8",
            color: activeCategory === "drinks" ? "#fff" : "#8b7768",
          }}
        >
          🥤 <span>NOS BOISSONS</span>
        </button>
      </div>

      {/* Products horizontal scroll */}
      <div className="px-5 mb-2 flex items-center justify-between">
        <p className="font-bold text-base" style={{ color: "#33251f" }}>
          {activeCategory === "burgers" ? "Nos Burgers" : "Nos Boissons"}
        </p>
        <button
          className="text-xs font-semibold"
          style={{ color: "#c85a32" }}
          onClick={() => onNav("menu")}
        >
          Tout voir →
        </button>
      </div>
      <div
        className="flex gap-4 overflow-x-auto px-5 pb-2"
        style={{ scrollbarWidth: "none" }}
      >
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={() => onAddToCart(product)}
            onOpen={() => onOpenProduct(product)}
            isFav={favs.has(product.id)}
            onFav={() => onToggleFav(product.id)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm py-8 px-2" style={{ color: "#505050" }}>
            Aucun résultat trouvé.
          </p>
        )}
      </div>

      {/* Promo Banner */}
      <div
        className="mx-5 mt-6 rounded-2xl p-4 flex items-center gap-4"
        style={{ backgroundColor: "#f8ecd8" }}
      >
        <span className="text-3xl">🔥</span>
        <div>
          <p className="font-bold text-sm" style={{ color: "#33251f" }}>
            Commandez maintenant
          </p>
          <p className="text-xs" style={{ color: "#8b7768" }}>
            Livraison rapide, paiement à la livraison
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Menu Screen ──────────────────────────────────────────────────────────────

function MenuScreen({
  onAddToCart,
  onOpenProduct,
  favs,
  onToggleFav,
}: {
  onAddToCart: (p: Product) => void;
  onOpenProduct: (p: Product) => void;
  favs: Set<string>;
  onToggleFav: (id: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<Category>("burgers");
  const filtered = PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <div
      className="flex flex-col min-h-full pb-20"
      style={{ background: "linear-gradient(135deg, #d4b17d 0%, #a84435 100%)" }}
    >
      <div className="px-5 pt-12 pb-5">
        <p className="font-black text-2xl" style={{ color: "#33251f" }}>
          Notre Menu
        </p>
        <p className="text-sm mt-1" style={{ color: "#8b7768" }}>
          Choisissez votre plaisir
        </p>
      </div>

      {/* Tabs */}
      <div
        className="mx-5 mb-6 p-1 rounded-2xl flex"
        style={{ backgroundColor: "#f8ecd8" }}
      >
        {(["burgers", "drinks"] as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all"
            style={{
              backgroundColor: activeCategory === cat ? "#c85a32" : "transparent",
              color: activeCategory === cat ? "#fff" : "#8b7768",
            }}
          >
            {cat === "burgers" ? "🍔 Burgers" : "🥤 Boissons"}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="px-5 flex flex-col gap-4">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl overflow-hidden flex flex-col gap-3 p-3"
            style={{ backgroundColor: "#f8ecd8" }}
          >
            <div
              className="cursor-pointer w-full h-32 rounded-xl overflow-hidden"
              style={{ backgroundColor: product.imageBg }}
              onClick={() => onOpenProduct(product)}
            >
              <img src={product.image} alt={product.name} className="w-full h-full object-contain bg-black" style={{ objectPosition: "center" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <p
                  className="font-bold text-sm"
                  style={{ color: "#33251f" }}
                >
                  {product.name}
                </p>
                <button
                  onClick={() => onToggleFav(product.id)}
                  className="ml-2 text-sm flex-shrink-0"
                >
                  {favs.has(product.id) ? "❤️" : "🤍"}
                </button>
              </div>
              <p
                className="text-xs mt-0.5 line-clamp-2"
                style={{ color: "#8b7768" }}
              >
                {product.shortIngredients}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="font-bold text-sm" style={{ color: "#c85a32" }}>
                  {product.price} DA
                </span>
                <button
                  onClick={() => onAddToCart(product)}
                  className="text-white text-xs font-bold px-3 py-1.5 rounded-xl"
                  style={{ backgroundColor: "#c85a32" }}
                >
                  + Ajouter
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Product Detail Screen ────────────────────────────────────────────────────

function ProductDetailScreen({
  product,
  onBack,
  onAddToCart,
}: {
  product: Product;
  onBack: () => void;
  onAddToCart: (p: Product, qty: number) => void;
}) {
  const [qty, setQty] = useState(1);

  return (
    <div
      className="flex flex-col min-h-full pb-24"
      style={{ background: "linear-gradient(135deg, #d4b17d 0%, #a84435 100%)" }}
    >
      {/* Back button */}
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: "#f8ecd8" }}
        >
          <span style={{ color: "#33251f" }}>←</span>
        </button>
        <p className="font-bold text-base" style={{ color: "#33251f" }}>
          Détail du produit
        </p>
      </div>

      {/* Large photo */}
      <div className="mx-5 mb-5">
        <ProductImage product={product} size="lg" />
      </div>

      <div className="px-5">
        {/* Name + Price */}
        <div className="flex items-start justify-between mb-3">
          <p className="font-black text-2xl flex-1" style={{ color: "#33251f" }}>
            {product.name}
          </p>
          <p className="font-black text-xl ml-4" style={{ color: "#c85a32" }}>
            {product.price} DA
          </p>
        </div>

        {/* Ingredients */}
        <div
          className="rounded-2xl p-4 mb-5"
          style={{ backgroundColor: "#f8ecd8" }}
        >
          <p
            className="text-xs font-bold tracking-widest uppercase mb-2"
            style={{ color: "#c85a32" }}
          >
            Ingrédients
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#6f5b4d" }}>
            {product.ingredients}
          </p>
        </div>

        {/* Customization placeholder (for future) */}
        {product.category === "burgers" && (
          <div
            className="rounded-2xl p-4 mb-5 border"
            style={{ borderColor: "#e3d5c3", backgroundColor: "#f1e5d3" }}
          >
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#8b7768" }}
            >
              Personnalisation
            </p>
            {[
              "Supplément fromage",
              "Supplément steak",
              "Choix de sauce",
              "Sans oignon",
              "Sans tomate",
              "Niveau épicé",
            ].map((opt) => (
              <div
                key={opt}
                className="flex items-center justify-between py-2 border-b last:border-0"
                style={{ borderColor: "#e3d5c3" }}
              >
                <p className="text-sm" style={{ color: "#6f5b4d" }}>
                  {opt}
                </p>
                <span className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: "#e3d5c3", color: "#8b7768" }}>
                  Bientôt
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Quantity selector */}
        <div className="flex items-center justify-between mb-6">
          <p className="font-bold text-sm" style={{ color: "#F5F5F5" }}>
            Quantité
          </p>
          <div
            className="flex items-center gap-4 px-4 py-2 rounded-2xl"
            style={{ backgroundColor: "#1C1C1C" }}
          >
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-7 h-7 rounded-xl flex items-center justify-center font-bold"
              style={{ backgroundColor: qty === 1 ? "#2A2A2A" : "#FF5A1F", color: "#fff" }}
            >
              −
            </button>
            <span className="font-bold text-base w-4 text-center" style={{ color: "#F5F5F5" }}>
              {qty}
            </span>
            <button
              onClick={() => setQty(qty + 1)}
              className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-white"
              style={{ backgroundColor: "#FF5A1F" }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Add to cart button */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4" style={{ background: "linear-gradient(135deg, #d4b17d 0%, #a84435 100%)", borderTop: "1px solid #b8755e" }}>
        <button
          onClick={() => onAddToCart(product, qty)}
          className="w-full py-4 rounded-2xl text-white font-bold text-base"
          style={{ backgroundColor: "#c85a32" }}
        >
          Ajouter au panier • {product.price * qty} DA
        </button>
      </div>
    </div>
  );
}

// ─── Cart Screen ──────────────────────────────────────────────────────────────

function CartScreen({
  cart,
  onUpdateQty,
  onRemove,
  onCheckout,
}: {
  cart: CartItem[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}) {
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const delivery = cart.length > 0 ? 150 : 0;
  const total = subtotal + delivery;

  return (
    <div
      className="flex flex-col min-h-full pb-20"
      style={{ background: "linear-gradient(135deg, #d4b17d 0%, #a84435 100%)" }}
    >
      <div className="px-5 pt-12 pb-5">
        <p className="font-black text-2xl" style={{ color: "#33251f" }}>
          Mon Panier
        </p>
        <p className="text-sm mt-1" style={{ color: "#8b7768" }}>
          {cart.length === 0
            ? "Votre panier est vide"
            : `${cart.reduce((s, i) => s + i.quantity, 0)} article(s)`}
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5">
          <span className="text-6xl opacity-20">🛒</span>
          <p className="text-center" style={{ color: "#505050" }}>
            Votre panier est vide.{"\n"}Ajoutez des produits pour commander.
          </p>
        </div>
      ) : (
        <>
          <div className="px-5 flex flex-col gap-3">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="rounded-2xl p-3 flex items-center gap-3"
                style={{ backgroundColor: "#fffaf2" }}
              >
                <div
                  className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden"
                  style={{ backgroundColor: item.product.imageBg }}
                >
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" style={{ objectPosition: item.product.imagePosition ?? "70% center" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm" style={{ color: "#33251f" }}>
                    {item.product.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#8b7768" }}>
                    {item.product.price} DA / unité
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() =>
                        item.quantity === 1
                          ? onRemove(item.product.id)
                          : onUpdateQty(item.product.id, item.quantity - 1)
                      }
                      className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-sm"
                      style={{ backgroundColor: "#2A2A2A", color: "#F5F5F5" }}
                    >
                      −
                    </button>
                    <span className="font-bold text-sm" style={{ color: "#F5F5F5" }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-sm text-white"
                      style={{ backgroundColor: "#c85a32" }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => onRemove(item.product.id)}
                    className="text-xs px-2 py-1 rounded-lg"
                    style={{ backgroundColor: "#2A2A2A", color: "#707070" }}
                  >
                    ✕
                  </button>
                  <p className="font-bold text-sm" style={{ color: "#c85a32" }}>
                    {item.product.price * item.quantity} DA
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div
            className="mx-5 mt-5 rounded-2xl p-4"
            style={{ backgroundColor: "#fffaf2" }}
          >
            <div className="flex justify-between py-2">
              <p className="text-sm" style={{ color: "#909090" }}>
                Sous-total
              </p>
              <p className="text-sm font-semibold" style={{ color: "#F5F5F5" }}>
                {subtotal} DA
              </p>
            </div>
            <div
              className="flex justify-between py-2 border-b"
              style={{ borderColor: "#2E2E2E" }}
            >
              <p className="text-sm" style={{ color: "#909090" }}>
                Livraison
              </p>
              <p className="text-sm font-semibold" style={{ color: "#F5F5F5" }}>
                {delivery} DA
              </p>
            </div>
            <div className="flex justify-between pt-3">
              <p className="font-bold" style={{ color: "#F5F5F5" }}>
                TOTAL
              </p>
              <p className="font-black text-lg" style={{ color: "#c85a32" }}>
                {total} DA
              </p>
            </div>
          </div>

          {/* Commander button */}
          <div className="px-5 mt-5">
            <button
              onClick={onCheckout}
              className="w-full py-4 rounded-2xl text-white font-bold text-base"
              style={{ backgroundColor: "#c85a32" }}
            >
              Commander →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Checkout Screen ──────────────────────────────────────────────────────────

function CheckoutScreen({
  cart,
  onConfirm,
  onBack,
}: {
  cart: CartItem[];
  onConfirm: (info: { nom: string; prenom: string; tel: string; address: string; deliveryMode: string; paymentMode: string }) => void;
  onBack: () => void;
}) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [tel, setTel] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryMode, setDeliveryMode] = useState("livraison");
  const [paymentMode, setPaymentMode] = useState("livraison");

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const delivery = deliveryMode === "livraison" ? 150 : 0;
  const total = subtotal + delivery;

  const fieldStyle = {
    backgroundColor: "#fffaf2",
    color: "#33251f",
    border: "1px solid #e3d5c3",
  };

  return (
    <div
      className="flex flex-col min-h-full pb-28"
      style={{ background: "linear-gradient(135deg, #d4b17d 0%, #a84435 100%)" }}
    >
      <div className="px-5 pt-12 pb-5 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: "#fffaf2" }}
        >
          <span style={{ color: "#33251f" }}>←</span>
        </button>
        <p className="font-black text-2xl" style={{ color: "#33251f" }}>
          Commander
        </p>
      </div>

      <div className="px-5 flex flex-col gap-5">
        {/* Customer info */}
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: "#fffaf2" }}
        >
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: "#c85a32" }}
          >
            Vos informations
          </p>
          <div className="flex gap-3 mb-3">
            <input
              type="text"
              placeholder="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="flex-1 px-3 py-3 rounded-xl text-sm outline-none"
              style={fieldStyle}
            />
            <input
              type="text"
              placeholder="Prénom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className="flex-1 px-3 py-3 rounded-xl text-sm outline-none"
              style={fieldStyle}
            />
          </div>
          <input
            type="tel"
            placeholder="Numéro de téléphone"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            className="w-full px-3 py-3 rounded-xl text-sm outline-none mb-3"
            style={fieldStyle}
          />
          <input
            type="text"
            placeholder="Adresse de livraison"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-3 rounded-xl text-sm outline-none"
            style={fieldStyle}
          />
        </div>

        {/* Delivery mode */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: "#fffaf2" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#FF5A1F" }}>
            Mode de livraison
          </p>
          {[
            { id: "livraison", label: "Livraison à domicile", sub: "+150 DA", icon: "🚴" },
            { id: "retrait", label: "Retrait au restaurant", sub: "Gratuit", icon: "🏪" },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setDeliveryMode(opt.id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl mb-2 last:mb-0"
              style={{
                backgroundColor: deliveryMode === opt.id ? "rgba(255,90,31,0.15)" : "#242424",
                border: `1px solid ${deliveryMode === opt.id ? "#FF5A1F" : "#2E2E2E"}`,
              }}
            >
              <span className="text-xl">{opt.icon}</span>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold" style={{ color: "#F5F5F5" }}>{opt.label}</p>
                <p className="text-xs" style={{ color: "#707070" }}>{opt.sub}</p>
              </div>
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: deliveryMode === opt.id ? "#FF5A1F" : "#404040" }}
              >
                {deliveryMode === opt.id && (
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#FF5A1F" }} />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Payment */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: "#1C1C1C" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#FF5A1F" }}>
            Paiement
          </p>
          {[
            { id: "livraison", label: "Paiement à la livraison", sub: "Cash ou carte", icon: "💵" },
            { id: "online", label: "Paiement en ligne", sub: "Bientôt disponible", icon: "💳", disabled: true },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => !opt.disabled && setPaymentMode(opt.id)}
              disabled={opt.disabled}
              className="w-full flex items-center gap-3 p-3 rounded-xl mb-2 last:mb-0"
              style={{
                backgroundColor: paymentMode === opt.id ? "rgba(255,90,31,0.15)" : "#242424",
                border: `1px solid ${paymentMode === opt.id ? "#FF5A1F" : "#2E2E2E"}`,
                opacity: opt.disabled ? 0.4 : 1,
              }}
            >
              <span className="text-xl">{opt.icon}</span>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold" style={{ color: "#F5F5F5" }}>{opt.label}</p>
                <p className="text-xs" style={{ color: "#707070" }}>{opt.sub}</p>
              </div>
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: paymentMode === opt.id ? "#FF5A1F" : "#404040" }}
              >
                {paymentMode === opt.id && (
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#FF5A1F" }} />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Order summary */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: "#1C1C1C" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#FF5A1F" }}>
            Récapitulatif
          </p>
          {cart.map((item) => (
            <div key={item.product.id} className="flex justify-between py-1.5">
              <p className="text-sm" style={{ color: "#C0C0C0" }}>
                {item.product.name} × {item.quantity}
              </p>
              <p className="text-sm font-semibold" style={{ color: "#F5F5F5" }}>
                {item.product.price * item.quantity} DA
              </p>
            </div>
          ))}
          <div className="border-t mt-2 pt-2" style={{ borderColor: "#2E2E2E" }}>
            <div className="flex justify-between">
              <p className="font-bold" style={{ color: "#F5F5F5" }}>TOTAL</p>
              <p className="font-black" style={{ color: "#FF5A1F" }}>{total} DA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm button */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4" style={{ background: "linear-gradient(135deg, #d4b17d 0%, #a84435 100%)", borderTop: "1px solid #b8755e" }}>
        <button
          onClick={() => onConfirm({ nom, prenom, tel, address, deliveryMode, paymentMode })}
          className="w-full py-4 rounded-2xl text-white font-bold text-base"
          style={{ backgroundColor: "#c85a32" }}
        >
          Confirmer la commande →
        </button>
      </div>
    </div>
  );
}

// ─── Order Confirmation Screen ────────────────────────────────────────────────

function ConfirmationScreen({
  order,
  onHome,
}: {
  order: Order;
  onHome: () => void;
}) {
  const steps = ["Commande reçue", "Préparation", "En livraison", "Livrée"];
  const currentStep = 1; // simulate "Préparation"

  return (
    <div
      className="flex flex-col min-h-full pb-24"
      style={{ background: "linear-gradient(135deg, #d4b17d 0%, #a84435 100%)" }}
    >
      <div className="px-5 pt-12 pb-8 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "rgba(255,90,31,0.15)" }}
        >
          <span className="text-3xl">✅</span>
        </div>
        <p className="font-black text-2xl" style={{ color: "#33251f" }}>
          Commande confirmée !
        </p>
        <p className="text-sm mt-2" style={{ color: "#909090" }}>
          Merci pour votre commande.
        </p>
        <div
          className="inline-block mt-3 px-4 py-1.5 rounded-full text-xs font-bold"
          style={{ backgroundColor: "rgba(200,90,50,0.15)", color: "#c85a32" }}
        >
          Commande #{order.id}
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4">
        {/* Status tracker */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: "#fffaf2" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: "#FF5A1F" }}>
            Statut de la commande
          </p>
          {steps.map((step, i) => (
            <div key={step} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    backgroundColor: i <= currentStep ? "#FF5A1F" : "#2A2A2A",
                    color: i <= currentStep ? "#fff" : "#404040",
                  }}
                >
                  {i < currentStep ? "✓" : i === currentStep ? "●" : "○"}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="w-0.5 h-6 my-1"
                    style={{ backgroundColor: i < currentStep ? "#FF5A1F" : "#2A2A2A" }}
                  />
                )}
              </div>
              <div className="pb-4">
                <p
                  className="text-sm font-semibold"
                  style={{ color: i <= currentStep ? "#F5F5F5" : "#404040" }}
                >
                  {step}
                </p>
                {i === currentStep && (
                  <p className="text-xs mt-0.5" style={{ color: "#707070" }}>
                    En cours...
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order details */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: "#fffaf2" }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#FF5A1F" }}>
            Détail de la commande
          </p>
          {order.items.map((item) => (
            <div key={item.product.id} className="flex justify-between py-1.5">
              <p className="text-sm" style={{ color: "#C0C0C0" }}>
                {item.product.name} × {item.quantity}
              </p>
              <p className="text-sm font-semibold" style={{ color: "#F5F5F5" }}>
                {item.product.price * item.quantity} DA
              </p>
            </div>
          ))}
          <div className="border-t mt-2 pt-2 flex justify-between" style={{ borderColor: "#2E2E2E" }}>
            <p className="font-bold" style={{ color: "#F5F5F5" }}>TOTAL</p>
            <p className="font-black" style={{ color: "#FF5A1F" }}>{order.total} DA</p>
          </div>
        </div>

        {/* Delivery info */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: "#fffaf2" }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">📍</span>
            <p className="text-sm font-semibold" style={{ color: "#F5F5F5" }}>
              {order.address || "Retrait au restaurant"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">⏱</span>
            <p className="text-sm" style={{ color: "#909090" }}>
              Temps de préparation estimé : <strong style={{ color: "#F5F5F5" }}>25–35 min</strong>
            </p>
          </div>
        </div>

        <button
          onClick={onHome}
          className="w-full py-4 rounded-2xl font-bold text-base"
          style={{ backgroundColor: "#fffaf2", color: "#c85a32" }}
        >
          Retour à l&apos;accueil
        </button>
      </div>
    </div>
  );
}

// ─── Profile Screen ───────────────────────────────────────────────────────────

function ProfileScreen({ orders }: { orders: Order[] }) {
  const [tab, setTab] = useState<"profile" | "history">("profile");

  return (
    <div className="flex flex-col min-h-full pb-20" style={{ background: "linear-gradient(135deg, #d4b17d 0%, #a84435 100%)" }}>
      <div className="px-5 pt-12 pb-5">
        <p className="font-black text-2xl" style={{ color: "#33251f" }}>
          Mon Profil
        </p>
      </div>

      {/* Avatar */}
      <div className="px-5 mb-6 flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl"
          style={{ backgroundColor: "#c85a32", color: "#fff" }}
        >
          U
        </div>
        <div>
          <p className="font-bold text-base" style={{ color: "#F5F5F5" }}>
            Utilisateur
          </p>
          <p className="text-xs" style={{ color: "#707070" }}>
            Client WOOD PECKER BURGER
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-5 mb-5 p-1 rounded-2xl flex" style={{ backgroundColor: "#fffaf2" }}>
        {[
          { id: "profile", label: "Profil" },
          { id: "history", label: "Commandes" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm"
            style={{
              backgroundColor: tab === t.id ? "#c85a32" : "transparent",
              color: tab === t.id ? "#fff" : "#8b7768",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" ? (
        <div className="px-5 flex flex-col gap-4">
          {[
            { label: "Nom", placeholder: "Votre nom", icon: "👤" },
            { label: "Téléphone", placeholder: "Votre téléphone", icon: "📱" },
            { label: "Adresse", placeholder: "Votre adresse", icon: "📍" },
          ].map((field) => (
            <div key={field.label} className="rounded-2xl p-4" style={{ backgroundColor: "#fffaf2" }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#c85a32" }}>
                {field.label}
              </p>
              <div className="flex items-center gap-3">
                <span>{field.icon}</span>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: "#C0C0C0" }}
                />
              </div>
            </div>
          ))}
          <button
            className="w-full py-4 rounded-2xl text-white font-bold text-base"
            style={{ backgroundColor: "#c85a32" }}
          >
            Sauvegarder
          </button>
        </div>
      ) : (
        <div className="px-5 flex flex-col gap-3">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <span className="text-5xl opacity-20">📋</span>
              <p style={{ color: "#505050" }}>Aucune commande pour le moment.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="rounded-2xl p-4" style={{ backgroundColor: "#fffaf2" }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-sm" style={{ color: "#F5F5F5" }}>
                      Commande #{order.id}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#707070" }}>
                      {order.date}
                    </p>
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: order.status === "Livrée" ? "rgba(34,197,94,0.15)" : "rgba(255,90,31,0.15)",
                      color: order.status === "Livrée" ? "#22C55E" : "#FF5A1F",
                    }}
                  >
                    {order.status}
                  </span>
                </div>
                {order.items.map((item) => (
                  <p key={item.product.id} className="text-xs py-0.5" style={{ color: "#909090" }}>
                    {item.product.name} × {item.quantity}
                  </p>
                ))}
                <div className="flex justify-between mt-3 pt-3 border-t" style={{ borderColor: "#2E2E2E" }}>
                  <p className="text-sm" style={{ color: "#707070" }}>Total</p>
                  <p className="font-bold text-sm" style={{ color: "#FF5A1F" }}>
                    {order.total} DA
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [activeCategory] = useState<Category>("burgers");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [prevScreen, setPrevScreen] = useState<Screen>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  function addToCart(product: Product, qty = 1) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  }

  function updateQty(id: string, qty: number) {
    setCart((prev) => prev.map((i) => (i.product.id === id ? { ...i, quantity: qty } : i)));
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  }

  function toggleFav(id: string) {
    setFavs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function openProduct(product: Product) {
    setSelectedProduct(product);
    setPrevScreen(screen);
    setScreen("product");
  }

  function goNav(s: Screen) {
    if (s !== "product" && s !== "checkout" && s !== "confirmation") {
      setScreen(s);
    } else {
      setScreen(s);
    }
  }

  function handleCheckout(info: { nom: string; prenom: string; tel: string; address: string; deliveryMode: string; paymentMode: string }) {
    const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const delivery = info.deliveryMode === "livraison" ? 150 : 0;
    const orderId = Math.floor(Math.random() * 90000 + 10000).toString();
    const order: Order = {
      id: orderId,
      date: new Date().toLocaleDateString("fr-FR"),
      items: [...cart],
      total: subtotal + delivery,
      status: "Préparation",
      address: info.address,
    };
    setOrders((prev) => [order, ...prev]);
    setCurrentOrder(order);
    setCart([]);
    setScreen("confirmation");
  }

  const showBottomNav =
    screen !== "product" && screen !== "checkout" && screen !== "confirmation";

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: "linear-gradient(135deg, #d4b17d 0%, #a84435 100%)", fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Mobile frame container */}
      <div className="w-full h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {screen === "home" && (
          <HomeScreen
            onNav={goNav}
            cart={cart}
            onAddToCart={addToCart}
            onOpenProduct={openProduct}
            favs={favs}
            onToggleFav={toggleFav}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
          />
        )}
        {screen === "menu" && (
          <MenuScreen
            onAddToCart={addToCart}
            onOpenProduct={openProduct}
            favs={favs}
            onToggleFav={toggleFav}
          />
        )}
        {screen === "cart" && (
          <CartScreen
            cart={cart}
            onUpdateQty={updateQty}
            onRemove={removeFromCart}
            onCheckout={() => setScreen("checkout")}
          />
        )}
        {screen === "profile" && <ProfileScreen orders={orders} />}
        {screen === "product" && selectedProduct && (
          <ProductDetailScreen
            product={selectedProduct}
            onBack={() => setScreen(prevScreen)}
            onAddToCart={(p, qty) => {
              addToCart(p, qty);
              setScreen(prevScreen);
            }}
          />
        )}
        {screen === "checkout" && (
          <CheckoutScreen
            cart={cart}
            onConfirm={handleCheckout}
            onBack={() => setScreen("cart")}
          />
        )}
        {screen === "confirmation" && currentOrder && (
          <ConfirmationScreen
            order={currentOrder}
            onHome={() => setScreen("home")}
          />
        )}
      </div>

      {showBottomNav && (
        <BottomNav screen={screen} onNav={goNav} cartCount={cartCount} />
      )}
    </div>
  );
}
