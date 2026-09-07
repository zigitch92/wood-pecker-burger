import { useState, useEffect } from "react";
import { supabase } from "@/supabase";
import { PRODUCTS, type Product, type Category } from "@/menu";
import logo from "@/imports/logo.png.jpg";
import heroVideo from "@/imports/hero-video.mp4";

const heroPhoto = "/Gemini_Generated_Image_y59vxdy59vxdy59v.jpg";


// ─── Types ────────────────────────────────────────────────────────────────────

type Screen =
  | "home"
  | "menu"
  | "cart"
  | "product"
  | "checkout"
  | "confirmation";

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
  customerName: string;
}

interface Theme {
  primary: string;
  primaryDark: string;
  accent: string;
  gradient: string;
  card: string;
  cardAlt: string;
  text: string;
  textMuted: string;
  border: string;
  headerBg: string;
}

const BURGER_THEME: Theme = {
  primary: "#c85a32",
  primaryDark: "#a84435",
  accent: "#e8a838",
  gradient: "linear-gradient(135deg, #d4b17d 0%, #a84435 100%)",
  card: "#f8ecd8",
  cardAlt: "#fffaf2",
  text: "#33251f",
  textMuted: "#8b7768",
  border: "#e3d5c3",
  headerBg: "#f8ecd8",
};

const COCKTAIL_THEME: Theme = {
  primary: "#2d7a4f",
  primaryDark: "#1f5e3a",
  accent: "#d4b838",
  gradient: "linear-gradient(135deg, #c5d99a 0%, #2d7a4f 100%)",
  card: "#e8f0d8",
  cardAlt: "#f4f8e8",
  text: "#1a3320",
  textMuted: "#5a7a62",
  border: "#c5d9b0",
  headerBg: "#e8f0d8",
};

function themeFor(category: Category): Theme {
  return category === "drinks" ? COCKTAIL_THEME : BURGER_THEME;
}

// ─── Product Image ────────────────────────────────────────────────────────────

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
      style={{ backgroundColor: product.homeImageBg }}
    >
      <img
        src={product.homeImage}
        alt={product.name}
        className="w-full h-full object-cover"
        style={{ objectPosition: product.imagePosition ?? "70% center" }}
      />
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onAdd,
  onOpen,
  isFav,
  onFav,
  theme,
}: {
  product: Product;
  onAdd: () => void;
  onOpen: () => void;
  isFav: boolean;
  onFav: () => void;
  theme: Theme;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden flex-shrink-0"
      style={{ backgroundColor: theme.card, width: "220px" }}
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
          style={{ color: theme.text }}
        >
          {product.name}
        </p>
        <p
          className="text-[11px] mt-0.5 line-clamp-2 leading-snug"
          style={{ color: theme.textMuted }}
        >
          {product.shortIngredients}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-sm" style={{ color: theme.primary }}>
            {product.price} DA
          </span>
          <button
            onClick={onAdd}
            className="text-white text-xs font-bold px-3 py-1.5 rounded-xl active:scale-95 transition-transform"
            style={{ backgroundColor: theme.primary }}
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
}: {
  onNav: (s: Screen) => void;
  cart: CartItem[];
  onAddToCart: (p: Product) => void;
  onOpenProduct: (p: Product) => void;
  favs: Set<string>;
  onToggleFav: (id: string) => void;
}) {
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const [activeCategory, setActiveCategory] = useState<Category>("burgers");
  const theme = themeFor(activeCategory);

  const [showVideo, setShowVideo] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setShowVideo((v) => !v);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const burgers = PRODUCTS.filter((p) => p.category === "burgers");
  const drinks = PRODUCTS.filter((p) => p.category === "drinks");

  const visible = activeCategory === "burgers" ? burgers : drinks;

  return (
    <div
      className="flex flex-col min-h-full pb-6"
      style={{ background: theme.gradient }}
    >
      {/* Header */}
      <div className="px-5 pt-12 pb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: theme.headerBg }}
          >
            <img
              src={logo}
              alt="Wood Pecker Burger"
              className="w-full h-full object-contain object-center rounded-full"
            />
          </div>
          <div>
            <p
              className="font-black text-base tracking-wider leading-none"
              style={{ color: theme.text }}
            >
              WOOD PECKER
            </p>
            <p
              className="text-[10px] tracking-widest"
              style={{ color: theme.primary }}
            >
              BURGER
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center relative active:scale-90 transition-transform"
            style={{ backgroundColor: theme.headerBg }}
            onClick={() => onNav("cart")}
          >
            <span className="text-base">🛒</span>
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 text-[9px] font-black text-white rounded-full w-4 h-4 flex items-center justify-center"
                style={{ backgroundColor: theme.primary }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Slogan */}
      <div className="px-5 mb-4 text-center">
        <p
          className="text-xl leading-snug"
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: 600,
            color: theme.text,
          }}
        >
          T'as faim ? Commande, on s'occupe du reste
        </p>
      </div>

      {/* Hero Banner */}
      <div
        className="mx-5 rounded-2xl mb-5 relative overflow-hidden"
        style={{ backgroundColor: theme.card, height: "170px" }}
      >
        <img
          src={heroPhoto}
          alt="Packaging Wood Pecker Burger, frites et boisson"
          className="w-full h-full object-cover absolute inset-0 transition-opacity duration-700"
          style={{ objectPosition: "center", opacity: showVideo ? 0 : 1 }}
        />
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover absolute inset-0 transition-opacity duration-700"
          style={{ objectPosition: "center", opacity: showVideo ? 1 : 0 }}
        />
      </div>

      {/* Category Tabs */}
      <div className="mx-5 mb-5 flex gap-3">
        <button
          onClick={() => setActiveCategory("burgers")}
          className="min-w-0 flex-1 flex items-center justify-center gap-1 py-3.5 rounded-2xl font-bold text-xs transition-all active:scale-95"
          style={{
            backgroundColor:
              activeCategory === "burgers" ? theme.primary : theme.card,
            color: activeCategory === "burgers" ? "#fff" : theme.textMuted,
          }}
        >
          🍔 <span>NOS BURGERS</span>
        </button>
        <button
          onClick={() => setActiveCategory("drinks")}
          className="min-w-0 flex-1 flex items-center justify-center gap-1 py-3.5 rounded-2xl font-bold text-xs transition-all active:scale-95"
          style={{
            backgroundColor:
              activeCategory === "drinks" ? theme.primary : theme.card,
            color: activeCategory === "drinks" ? "#fff" : theme.textMuted,
          }}
        >
          🥤 <span>NOS COCKTAILS</span>
        </button>
      </div>

      {/* Products horizontal scroll */}
      <div className="px-5 mb-2 flex items-center justify-between">
        <p className="font-bold text-base" style={{ color: theme.text }}>
          {activeCategory === "burgers" ? "Nos Burgers" : "Nos Cocktails"}
        </p>
        <button
          className="text-xs font-semibold"
          style={{ color: theme.primary }}
          onClick={() => onNav("menu")}
        >
          Tout voir →
        </button>
      </div>
      <div
        className="flex gap-4 overflow-x-auto px-5 pb-2"
        style={{ scrollbarWidth: "none" }}
      >
        {visible.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={() => onAddToCart(product)}
            onOpen={() => onOpenProduct(product)}
            isFav={favs.has(product.id)}
            onFav={() => onToggleFav(product.id)}
            theme={theme}
          />
        ))}
      </div>

      {/* Horaires d'ouverture */}
      <div
        className="mx-5 mt-6 mb-2 rounded-full py-2.5 pl-2.5 pr-5 flex items-center justify-center gap-2.5 shadow-md border"
        style={{ backgroundColor: "#ffffff", borderColor: theme.card2 }}
      >
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0"
          style={{ backgroundColor: theme.card }}
        >
          🕐
        </span>
        <p className="text-sm font-bold tracking-wide" style={{ color: theme.text }}>
          Ouvert de 11h00 jusqu'à Minuit
        </p>
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
  const theme = themeFor(activeCategory);
  const filtered = PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <div
      className="flex flex-col min-h-full pb-6"
      style={{ background: theme.gradient }}
    >
      <div className="px-5 pt-12 pb-5">
        <p className="font-black text-2xl" style={{ color: theme.text }}>
          {activeCategory === "burgers" ? "Nos Burgers" : "Nos Cocktails"}
        </p>
        <p className="text-sm mt-1" style={{ color: theme.textMuted }}>
          {activeCategory === "burgers"
            ? "L'art du burger"
            : "Fraîcheur et saveurs"}
        </p>
      </div>

      {/* Tabs */}
      <div
        className="mx-5 mb-6 p-1 rounded-2xl flex"
        style={{ backgroundColor: theme.card }}
      >
        {(["burgers", "drinks"] as Category[]).map((cat) => {
          const catTheme = themeFor(cat);
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
              style={{
                backgroundColor:
                  activeCategory === cat ? catTheme.primary : "transparent",
                color: activeCategory === cat ? "#fff" : theme.textMuted,
              }}
            >
              {cat === "burgers" ? "🍔 Burgers" : "🥤 Cocktails"}
            </button>
          );
        })}
      </div>

      {/* Product List */}
      <div className="px-5 flex flex-col gap-4">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl overflow-hidden flex flex-col gap-3 p-3"
            style={{ backgroundColor: theme.card }}
          >
            <div
              className="cursor-pointer w-full h-32 rounded-xl overflow-hidden active:scale-[0.98] transition-transform"
              style={{ backgroundColor: product.homeImageBg }}
              onClick={() => onOpenProduct(product)}
            >
              <img
                src={product.homeImage}
                alt={product.name}
                className="w-full h-full object-cover"
                style={{ objectPosition: product.imagePosition ?? "70% center" }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <p
                  className="font-bold text-sm"
                  style={{ color: theme.text }}
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
                style={{ color: theme.textMuted }}
              >
                {product.shortIngredients}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span
                  className="font-bold text-sm"
                  style={{ color: theme.primary }}
                >
                  {product.price} DA
                </span>
                <button
                  onClick={() => onAddToCart(product)}
                  className="text-white text-xs font-bold px-3 py-1.5 rounded-xl active:scale-95 transition-transform"
                  style={{ backgroundColor: theme.primary }}
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
  const theme = themeFor(product.category);
  const [supplements, setSupplements] = useState<Record<string, boolean>>({
    kiri: false,
    steak: false,
    frites: false,
  });
  const [preferences, setPreferences] = useState<Record<string, string>>({
    sauce: "avec",
    oignon: "avec",
    tomate: "avec",
    epice: "non",
  });
  const supplementTotal =
    (supplements.kiri ? 50 : 0) +
    (supplements.steak ? 100 : 0) +
    (supplements.frites ? 300 : 0);
  const unitPrice = product.price + supplementTotal;

  return (
    <div
      className="flex flex-col min-h-full pb-24"
      style={{ background: theme.gradient }}
    >
      {/* Back button */}
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
          style={{ backgroundColor: theme.card }}
        >
          <span style={{ color: theme.text }}>←</span>
        </button>
        <p className="font-bold text-base" style={{ color: theme.text }}>
          Détail du produit
        </p>
      </div>

      {/* Large photo */}
      <div className="mx-5 mb-5">
        <div
          className="w-full h-64 rounded-xl overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: "transparent" }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
            style={{
              objectPosition: "center",
              transform: "scale(1.05)",
            }}
          />
        </div>
      </div>

      <div className="px-5">
        {/* Name + Price */}
        <div className="flex items-start justify-between mb-3">
          <p
            className="font-black text-2xl flex-1"
            style={{ color: theme.text }}
          >
            {product.name}
          </p>
          <p
            className="font-black text-xl ml-4"
            style={{ color: theme.primaryDark }}
          >
            {product.price} DA
          </p>
        </div>

        {/* Ingredients */}
        <div
          className="rounded-2xl p-4 mb-5"
          style={{ backgroundColor: theme.card }}
        >
          <p
            className="text-xs font-bold tracking-widest uppercase mb-2"
            style={{ color: theme.primary }}
          >
            Ingrédients
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: theme.textMuted }}
          >
            {product.ingredients}
          </p>
        </div>

        {/* Customization */}
        {product.category === "burgers" && (
          <div
            className="rounded-2xl p-4 mb-5 border"
            style={{ borderColor: theme.border, backgroundColor: theme.cardAlt }}
          >
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: theme.textMuted }}
            >
              Personnalisation
            </p>

            {/* Supplements avec prix */}
            {[
              { key: "kiri", label: "Supplément Kiri", price: 50 },
              { key: "steak", label: "Supplément Steak", price: 100 },
              { key: "frites", label: "Supplément Barquette de Frites", price: 300 },
            ].map((opt) => (
              <div
                key={opt.key}
                className="flex items-center justify-between py-2.5 border-b last:border-0"
                style={{ borderColor: theme.border }}
              >
                <div className="flex items-center gap-2">
                  <p className="text-sm" style={{ color: theme.textMuted }}>
                    {opt.label}
                  </p>
                  <span
                    className="text-xs font-bold"
                    style={{ color: theme.primary }}
                  >
                    +{opt.price} DA
                  </span>
                </div>
                <button
                  onClick={() =>
                    setSupplements((prev) => ({ ...prev, [opt.key]: !prev[opt.key] }))
                  }
                  className="w-11 h-6 rounded-full flex items-center transition-colors flex-shrink-0"
                  style={{
                    backgroundColor: supplements[opt.key]
                      ? theme.primary
                      : theme.border,
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: supplements[opt.key]
                        ? "translateX(22px)"
                        : "translateX(2px)",
                    }}
                  />
                </button>
              </div>
            ))}

            {/* Options Avec / Sans */}
            {[
              { key: "sauce", label: "Choix de sauce" },
              { key: "oignon", label: "Oignon" },
              { key: "tomate", label: "Tomate" },
            ].map((opt) => (
              <div
                key={opt.key}
                className="flex items-center justify-between py-2.5 border-b last:border-0"
                style={{ borderColor: theme.border }}
              >
                <p className="text-sm" style={{ color: theme.textMuted }}>
                  {opt.label}
                </p>
                <div className="flex gap-1.5">
                  {["avec", "sans"].map((val) => (
                    <button
                      key={val}
                      onClick={() =>
                        setPreferences((prev) => ({ ...prev, [opt.key]: val }))
                      }
                      className="px-3.5 py-1 rounded-lg text-xs font-bold capitalize transition-all active:scale-95"
                      style={{
                        backgroundColor:
                          preferences[opt.key] === val
                            ? theme.primary
                            : "transparent",
                        color:
                          preferences[opt.key] === val ? "#fff" : theme.textMuted,
                        border: `1px solid ${
                          preferences[opt.key] === val
                            ? theme.primary
                            : theme.border
                        }`,
                      }}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Niveau d'épice Oui / Non */}
            <div
              className="flex items-center justify-between py-2.5"
            >
              <p className="text-sm" style={{ color: theme.textMuted }}>
                Niveau d'épice
              </p>
              <div className="flex gap-1.5">
                {["oui", "non"].map((val) => (
                  <button
                    key={val}
                    onClick={() =>
                      setPreferences((prev) => ({ ...prev, epice: val }))
                    }
                    className="px-3.5 py-1 rounded-lg text-xs font-bold capitalize transition-all active:scale-95"
                    style={{
                      backgroundColor:
                        preferences.epice === val ? theme.primary : "transparent",
                      color: preferences.epice === val ? "#fff" : theme.textMuted,
                      border: `1px solid ${
                        preferences.epice === val ? theme.primary : theme.border
                      }`,
                    }}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quantity selector */}
        <div className="flex items-center justify-between mb-6">
          <p className="font-bold text-sm" style={{ color: theme.text }}>
            Quantité
          </p>
          <div
            className="flex items-center gap-4 px-4 py-2 rounded-2xl"
            style={{ backgroundColor: theme.card }}
          >
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-7 h-7 rounded-xl flex items-center justify-center font-bold active:scale-90 transition-transform"
              style={{
                backgroundColor: qty === 1 ? theme.border : theme.primary,
                color: "#fff",
              }}
            >
              −
            </button>
            <span
              className="font-bold text-base w-4 text-center"
              style={{ color: theme.text }}
            >
              {qty}
            </span>
            <button
              onClick={() => setQty(qty + 1)}
              className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-white active:scale-90 transition-transform"
              style={{ backgroundColor: theme.primary }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Add to cart button */}
      <div
        className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4"
        style={{
          background: theme.gradient,
          borderTop: `1px solid ${theme.border}`,
        }}
      >
        <button
          onClick={() => onAddToCart({ ...product, price: unitPrice }, qty)}
          className="w-full py-4 rounded-2xl text-white font-bold text-base active:scale-[0.98] transition-transform"
          style={{ backgroundColor: theme.primary }}
        >
          Ajouter au panier • {unitPrice * qty} DA
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
  onBack,
}: {
  cart: CartItem[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  onBack: () => void;
}) {
  const theme = BURGER_THEME;
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const delivery = cart.length > 0 ? 150 : 0;
  const total = subtotal + delivery;

  return (
    <div
      className="flex flex-col min-h-full pb-6"
      style={{ background: theme.gradient }}
    >
      <div className="px-5 pt-12 pb-5 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
          style={{ backgroundColor: theme.cardAlt }}
        >
          <span style={{ color: theme.text }}>←</span>
        </button>
        <div>
          <p className="font-black text-2xl" style={{ color: theme.text }}>
            Mon Panier
          </p>
          <p className="text-sm mt-0.5" style={{ color: theme.textMuted }}>
            {cart.length === 0
              ? "Votre panier est vide"
              : `${cart.reduce((s, i) => s + i.quantity, 0)} article(s)`}
          </p>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5">
          <span className="text-6xl opacity-20">🛒</span>
          <p className="text-center" style={{ color: theme.textMuted }}>
            Votre panier est vide.
            <br />
            Ajoutez des produits pour commander.
          </p>
        </div>
      ) : (
        <>
          <div className="px-5 flex flex-col gap-3">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="rounded-2xl p-3 flex items-center gap-3"
                style={{ backgroundColor: theme.cardAlt }}
              >
                <div
                  className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden"
                  style={{ backgroundColor: item.product.imageBg }}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: item.product.imagePosition ?? "70% center",
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-bold text-sm"
                    style={{ color: theme.text }}
                  >
                    {item.product.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: theme.textMuted }}>
                    {item.product.price} DA / unité
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() =>
                        item.quantity === 1
                          ? onRemove(item.product.id)
                          : onUpdateQty(item.product.id, item.quantity - 1)
                      }
                      className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-sm active:scale-90 transition-transform"
                      style={{
                        backgroundColor: theme.border,
                        color: theme.text,
                      }}
                    >
                      −
                    </button>
                    <span
                      className="font-bold text-sm"
                      style={{ color: theme.text }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQty(item.product.id, item.quantity + 1)
                      }
                      className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-sm text-white active:scale-90 transition-transform"
                      style={{ backgroundColor: theme.primary }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => onRemove(item.product.id)}
                    className="text-xs px-2 py-1 rounded-lg active:scale-90 transition-transform"
                    style={{ backgroundColor: theme.border, color: theme.textMuted }}
                  >
                    ✕
                  </button>
                  <p
                    className="font-bold text-sm"
                    style={{ color: theme.primary }}
                  >
                    {item.product.price * item.quantity} DA
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div
            className="mx-5 mt-5 rounded-2xl p-4"
            style={{ backgroundColor: theme.cardAlt }}
          >
            <div className="flex justify-between py-2">
              <p className="text-sm" style={{ color: theme.textMuted }}>
                Sous-total
              </p>
              <p className="text-sm font-semibold" style={{ color: theme.text }}>
                {subtotal} DA
              </p>
            </div>
            <div
              className="flex justify-between py-2 border-b"
              style={{ borderColor: theme.border }}
            >
              <p className="text-sm" style={{ color: theme.textMuted }}>
                Livraison
              </p>
              <p className="text-sm font-semibold" style={{ color: theme.text }}>
                {delivery} DA
              </p>
            </div>
            <div className="flex justify-between pt-3">
              <p className="font-bold" style={{ color: theme.text }}>
                TOTAL
              </p>
              <p
                className="font-black text-lg"
                style={{ color: theme.primary }}
              >
                {total} DA
              </p>
            </div>
          </div>

          {/* Commander button */}
          <div className="px-5 mt-5">
            <button
              onClick={onCheckout}
              className="w-full py-4 rounded-2xl text-white font-bold text-base active:scale-[0.98] transition-transform"
              style={{ backgroundColor: theme.primary }}
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
  submitting,
}: {
  cart: CartItem[];
  onConfirm: (info: {
    nom: string;
    prenom: string;
    tel: string;
    address: string;
    deliveryMode: string;
    paymentMode: string;
  }) => void;
  onBack: () => void;
  submitting: boolean;
}) {
  const theme = BURGER_THEME;
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
    backgroundColor: theme.cardAlt,
    color: theme.text,
    border: `1px solid ${theme.border}`,
  };

  const canSubmit =
    nom.trim() !== "" &&
    prenom.trim() !== "" &&
    tel.trim() !== "" &&
    (deliveryMode === "retrait" || address.trim() !== "") &&
    !submitting;

  return (
    <div
      className="flex flex-col min-h-full pb-28"
      style={{ background: theme.gradient }}
    >
      <div className="px-5 pt-12 pb-5 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
          style={{ backgroundColor: theme.cardAlt }}
        >
          <span style={{ color: theme.text }}>←</span>
        </button>
        <p className="font-black text-2xl" style={{ color: theme.text }}>
          Commander
        </p>
      </div>

      <div className="px-5 flex flex-col gap-5">
        {/* Customer info */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: theme.cardAlt }}>
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: theme.primary }}
          >
            Vos informations
          </p>
          <input
            type="text"
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full px-3 py-3 rounded-xl text-sm outline-none mb-3"
            style={fieldStyle}
          />
          <input
            type="text"
            placeholder="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            className="w-full px-3 py-3 rounded-xl text-sm outline-none mb-3"
            style={fieldStyle}
          />
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
        <div className="rounded-2xl p-4" style={{ backgroundColor: theme.cardAlt }}>
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: theme.primary }}
          >
            Mode de livraison
          </p>
          {[
            { id: "livraison", label: "Livraison à domicile", sub: "+150 DA", icon: "🚴" },
            { id: "retrait", label: "Retrait au restaurant", sub: "Gratuit", icon: "🏪" },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setDeliveryMode(opt.id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl mb-2 last:mb-0 active:scale-[0.98] transition-transform"
              style={{
                backgroundColor:
                  deliveryMode === opt.id
                    ? `${theme.primary}22`
                    : theme.card,
                border: `1px solid ${deliveryMode === opt.id ? theme.primary : theme.border}`,
              }}
            >
              <span className="text-xl">{opt.icon}</span>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold" style={{ color: theme.text }}>
                  {opt.label}
                </p>
                <p className="text-xs" style={{ color: theme.textMuted }}>
                  {opt.sub}
                </p>
              </div>
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={{
                  borderColor: deliveryMode === opt.id ? theme.primary : theme.border,
                }}
              >
                {deliveryMode === opt.id && (
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Payment */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: theme.cardAlt }}>
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: theme.primary }}
          >
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
                backgroundColor:
                  paymentMode === opt.id
                    ? `${theme.primary}22`
                    : theme.card,
                border: `1px solid ${paymentMode === opt.id ? theme.primary : theme.border}`,
                opacity: opt.disabled ? 0.4 : 1,
              }}
            >
              <span className="text-xl">{opt.icon}</span>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold" style={{ color: theme.text }}>
                  {opt.label}
                </p>
                <p className="text-xs" style={{ color: theme.textMuted }}>
                  {opt.sub}
                </p>
              </div>
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={{
                  borderColor: paymentMode === opt.id ? theme.primary : theme.border,
                }}
              >
                {paymentMode === opt.id && (
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Order summary */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: theme.cardAlt }}>
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: theme.primary }}
          >
            Récapitulatif
          </p>
          {cart.map((item) => (
            <div key={item.product.id} className="flex justify-between py-1.5">
              <p className="text-sm" style={{ color: theme.textMuted }}>
                {item.product.name} × {item.quantity}
              </p>
              <p className="text-sm font-semibold" style={{ color: theme.text }}>
                {item.product.price * item.quantity} DA
              </p>
            </div>
          ))}
          <div className="border-t mt-2 pt-2" style={{ borderColor: theme.border }}>
            <div className="flex justify-between">
              <p className="font-bold" style={{ color: theme.text }}>
                TOTAL
              </p>
              <p className="font-black" style={{ color: theme.primary }}>
                {total} DA
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm button */}
      <div
        className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4"
        style={{ background: theme.gradient, borderTop: `1px solid ${theme.border}` }}
      >
        <button
          onClick={() =>
            onConfirm({ nom, prenom, tel, address, deliveryMode, paymentMode })
          }
          disabled={!canSubmit}
          className="w-full py-4 rounded-2xl text-white font-bold text-base active:scale-[0.98] transition-transform disabled:opacity-50"
          style={{ backgroundColor: theme.primary }}
        >
          {submitting ? "Envoi en cours..." : "Confirmer la commande →"}
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
  const theme = BURGER_THEME;
  const steps = ["Commande reçue", "Préparation", "En livraison", "Livrée"];
  const currentStep = 1;

  return (
    <div
      className="flex flex-col min-h-full pb-24"
      style={{ background: theme.gradient }}
    >
      <div className="px-5 pt-12 pb-8 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: `${theme.primary}22` }}
        >
          <span className="text-3xl">✅</span>
        </div>
        <p className="font-black text-2xl" style={{ color: theme.text }}>
          Commande confirmée !
        </p>
        <p className="text-sm mt-2" style={{ color: theme.textMuted }}>
          Merci pour votre commande.
        </p>
        <div
          className="inline-block mt-3 px-4 py-1.5 rounded-full text-xs font-bold"
          style={{ backgroundColor: `${theme.primary}22`, color: theme.primary }}
        >
          Commande #{order.id}
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4">
        {/* Status tracker */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: theme.cardAlt }}>
          <p
            className="text-xs font-bold tracking-widest uppercase mb-5"
            style={{ color: theme.primary }}
          >
            Statut de la commande
          </p>
          {steps.map((step, i) => (
            <div key={step} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    backgroundColor: i <= currentStep ? theme.primary : theme.border,
                    color: i <= currentStep ? "#fff" : theme.textMuted,
                  }}
                >
                  {i < currentStep ? "✓" : i === currentStep ? "●" : "○"}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="w-0.5 h-6 my-1"
                    style={{
                      backgroundColor: i < currentStep ? theme.primary : theme.border,
                    }}
                  />
                )}
              </div>
              <div className="pb-4">
                <p
                  className="text-sm font-semibold"
                  style={{
                    color: i <= currentStep ? theme.text : theme.textMuted,
                  }}
                >
                  {step}
                </p>
                {i === currentStep && (
                  <p className="text-xs mt-0.5" style={{ color: theme.textMuted }}>
                    En cours...
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order details */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: theme.cardAlt }}>
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: theme.primary }}
          >
            Détail de la commande
          </p>
          {order.items.map((item) => (
            <div key={item.product.id} className="flex justify-between py-1.5">
              <p className="text-sm" style={{ color: theme.textMuted }}>
                {item.product.name} × {item.quantity}
              </p>
              <p className="text-sm font-semibold" style={{ color: theme.text }}>
                {item.product.price * item.quantity} DA
              </p>
            </div>
          ))}
          <div
            className="border-t mt-2 pt-2 flex justify-between"
            style={{ borderColor: theme.border }}
          >
            <p className="font-bold" style={{ color: theme.text }}>
              TOTAL
            </p>
            <p className="font-black" style={{ color: theme.primary }}>
              {order.total} DA
            </p>
          </div>
        </div>

        {/* Delivery info */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: theme.cardAlt }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">📍</span>
            <p className="text-sm font-semibold" style={{ color: theme.text }}>
              {order.address || "Retrait au restaurant"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">⏱</span>
            <p className="text-sm" style={{ color: theme.textMuted }}>
              Temps estimé :{" "}
              <strong style={{ color: theme.text }}>25–35 min</strong>
            </p>
          </div>
        </div>

        <button
          onClick={onHome}
          className="w-full py-4 rounded-2xl font-bold text-base active:scale-[0.98] transition-transform"
          style={{ backgroundColor: theme.cardAlt, color: theme.primary }}
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [prevScreen, setPrevScreen] = useState<Screen>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);


  function addToCart(product: Product, qty = 1) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  }

  function updateQty(id: string, qty: number) {
    setCart((prev) =>
      prev.map((i) => (i.product.id === id ? { ...i, quantity: qty } : i))
    );
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  }

  function toggleFav(id: string) {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function openProduct(product: Product) {
    setSelectedProduct(product);
    setPrevScreen(screen);
    setScreen("product");
  }

  function goNav(s: Screen) {
    setScreen(s);
  }

  async function handleCheckout(info: {
    nom: string;
    prenom: string;
    tel: string;
    address: string;
    deliveryMode: string;
    paymentMode: string;
  }) {
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
      customerName: `${info.prenom} ${info.nom}`,
    };

    setSubmitting(true);
    const { error } = await supabase.from("orders").insert({
      id: orderId,
      customer_name: order.customerName,
      phone: info.tel,
      address: info.address,
      delivery_mode: info.deliveryMode,
      payment_mode: info.paymentMode,
      items: cart.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
      total: order.total,
      status: "Préparation",
    });
    setSubmitting(false);

    if (error) {
      alert(
        "Erreur lors de l'enregistrement de la commande. Veuillez réessayer."
      );
      return;
    }

    setCurrentOrder(order);
    setCart([]);
    setScreen("confirmation");
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #d4b17d 0%, #a84435 100%)",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <div
        className="w-full h-full overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {screen === "home" && (
          <HomeScreen
            onNav={goNav}
            cart={cart}
            onAddToCart={addToCart}
            onOpenProduct={openProduct}
            favs={favs}
            onToggleFav={toggleFav}
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
            onBack={() => setScreen("home")}
          />
        )}
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
            submitting={submitting}
          />
        )}
        {screen === "confirmation" && currentOrder && (
          <ConfirmationScreen
            order={currentOrder}
            onHome={() => setScreen("home")}
          />
        )}
      </div>

    </div>
  );
}
