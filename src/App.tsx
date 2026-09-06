import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/supabase";
import { PRODUCTS, type Product, type Category } from "@/menu";
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

  const burgers = PRODUCTS.filter((p) => p.category === "burgers");
  const drinks = PRODUCTS.filter((p) => p.category === "drinks");

  const visible = activeCategory === "burgers" ? burgers : drinks;

  return (
    <div
      className="flex flex-col min-h-full pb-20"
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
          className="font-bold text-lg leading-tight italic"
          style={{ color: theme.text }}
        >
          "L'art du burger, la vitesse du fast."
        </p>
      </div>

      {/* Hero Banner */}
      <div
        className="mx-5 rounded-2xl mb-5 relative overflow-hidden"
        style={{ backgroundColor: theme.card, minHeight: "125px" }}
      >
        <img
          src={couverture}
          alt="Couverture Wood Pecker Burger"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center", opacity: 0.85 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(20,12,10,0.72), rgba(20,12,10,0.04) 70%)",
          }}
        />
        <div className="absolute bottom-4 left-5 z-10">
          <button
            className="text-white text-xs font-bold px-4 py-2 rounded-xl active:scale-95 transition-transform"
            style={{ backgroundColor: theme.primary }}
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

      {/* Order CTA */}
      <div
        className="mx-5 mt-6 rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform cursor-pointer"
        style={{ backgroundColor: theme.card }}
        onClick={() => onNav("cart")}
      >
        <span className="text-3xl">🔥</span>
        <div className="flex-1">
          <p className="font-bold text-sm" style={{ color: theme.text }}>
            Commandez maintenant
          </p>
          <p className="text-xs" style={{ color: theme.textMuted }}>
            Livraison rapide, paiement à la livraison
          </p>
        </div>
        <span className="font-bold text-lg" style={{ color: theme.primary }}>
          →
        </span>
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
      className="flex flex-col min-h-full pb-20"
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
              style={{ backgroundColor: product.imageBg }}
              onClick={() => onOpenProduct(product)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain bg-black"
                style={{ objectPosition: "center" }}
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
        <ProductImage product={product} size="lg" />
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
            style={{ color: theme.primary }}
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

        {/* Customization placeholder (for future) */}
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
                style={{ borderColor: theme.border }}
              >
                <p className="text-sm" style={{ color: theme.textMuted }}>
                  {opt}
                </p>
                <span
                  className="text-xs px-2 py-0.5 rounded-full border"
                  style={{
                    borderColor: theme.border,
                    color: theme.textMuted,
                  }}
                >
                  Bientôt
                </span>
              </div>
            ))}
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
          onClick={() => onAddToCart(product, qty)}
          className="w-full py-4 rounded-2xl text-white font-bold text-base active:scale-[0.98] transition-transform"
          style={{ backgroundColor: theme.primary }}
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
  const theme = BURGER_THEME;
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const delivery = cart.length > 0 ? 150 : 0;
  const total = subtotal + delivery;

  return (
    <div
      className="flex flex-col min-h-full pb-20"
      style={{ background: theme.gradient }}
    >
      <div className="px-5 pt-12 pb-5">
        <p className="font-black text-2xl" style={{ color: theme.text }}>
          Mon Panier
        </p>
        <p className="text-sm mt-1" style={{ color: theme.textMuted }}>
          {cart.length === 0
            ? "Votre panier est vide"
            : `${cart.reduce((s, i) => s + i.quantity, 0)} article(s)`}
        </p>
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

// ─── Profile Screen ───────────────────────────────────────────────────────────

function ProfileScreen({
  orders,
  loading,
}: {
  orders: Order[];
  loading: boolean;
}) {
  const theme = BURGER_THEME;
  const [tab, setTab] = useState<"profile" | "history">("history");

  return (
    <div
      className="flex flex-col min-h-full pb-20"
      style={{ background: theme.gradient }}
    >
      <div className="px-5 pt-12 pb-5">
        <p className="font-black text-2xl" style={{ color: theme.text }}>
          Mon Profil
        </p>
      </div>

      {/* Avatar */}
      <div className="px-5 mb-6 flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl"
          style={{ backgroundColor: theme.primary, color: "#fff" }}
        >
          U
        </div>
        <div>
          <p className="font-bold text-base" style={{ color: theme.text }}>
            Utilisateur
          </p>
          <p className="text-xs" style={{ color: theme.textMuted }}>
            Client WOOD PECKER BURGER
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="mx-5 mb-5 p-1 rounded-2xl flex"
        style={{ backgroundColor: theme.cardAlt }}
      >
        {[
          { id: "profile", label: "Profil" },
          { id: "history", label: "Commandes" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
            style={{
              backgroundColor: tab === t.id ? theme.primary : "transparent",
              color: tab === t.id ? "#fff" : theme.textMuted,
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
            <div
              key={field.label}
              className="rounded-2xl p-4"
              style={{ backgroundColor: theme.cardAlt }}
            >
              <p
                className="text-xs font-bold tracking-widest uppercase mb-2"
                style={{ color: theme.primary }}
              >
                {field.label}
              </p>
              <div className="flex items-center gap-3">
                <span>{field.icon}</span>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: theme.text }}
                />
              </div>
            </div>
          ))}
          <button
            className="w-full py-4 rounded-2xl text-white font-bold text-base active:scale-[0.98] transition-transform"
            style={{ backgroundColor: theme.primary }}
          >
            Sauvegarder
          </button>
        </div>
      ) : (
        <div className="px-5 flex flex-col gap-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div
                className="w-8 h-8 rounded-full border-3 border-t-transparent animate-spin"
                style={{ borderColor: theme.primary, borderTopColor: "transparent" }}
              />
              <p style={{ color: theme.textMuted }}>Chargement des commandes...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <span className="text-5xl opacity-20">📋</span>
              <p style={{ color: theme.textMuted }}>Aucune commande pour le moment.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl p-4"
                style={{ backgroundColor: theme.cardAlt }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-sm" style={{ color: theme.text }}>
                      Commande #{order.id}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: theme.textMuted }}>
                      {order.date}
                    </p>
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor:
                        order.status === "Livrée"
                          ? "rgba(34,197,94,0.15)"
                          : `${theme.primary}22`,
                      color: order.status === "Livrée" ? "#22C55E" : theme.primary,
                    }}
                  >
                    {order.status}
                  </span>
                </div>
                {order.items.map((item) => (
                  <p
                    key={item.product.id}
                    className="text-xs py-0.5"
                    style={{ color: theme.textMuted }}
                  >
                    {item.product.name} × {item.quantity}
                  </p>
                ))}
                <div
                  className="flex justify-between mt-3 pt-3 border-t"
                  style={{ borderColor: theme.border }}
                >
                  <p className="text-sm" style={{ color: theme.textMuted }}>
                    Total
                  </p>
                  <p className="font-bold text-sm" style={{ color: theme.primary }}>
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [prevScreen, setPrevScreen] = useState<Screen>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const loadOrders = useCallback(async () => {
    setLoadingOrders(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to load orders:", error.message);
    } else if (data) {
      const mapped: Order[] = data.map((row: Record<string, unknown>) => {
        const items = (row.items as Array<Record<string, unknown>>).map(
          (it) => {
            const product = PRODUCTS.find((p) => p.id === it.id);
            return {
              product:
                product ?? ({
                  id: it.id as string,
                  name: it.name as string,
                  price: it.price as number,
                  category: "burgers" as Category,
                  shortIngredients: "",
                  ingredients: "",
                  imageBg: "#000",
                  image: "",
                } satisfies Product),
              quantity: it.quantity as number,
            };
          }
        );
        return {
          id: row.id as string,
          date: new Date(row.created_at as string).toLocaleDateString("fr-FR"),
          items,
          total: row.total as number,
          status: row.status as Order["status"],
          address: (row.address as string) ?? "",
          customerName: (row.customer_name as string) ?? "",
        };
      });
      setOrders(mapped);
    }
    setLoadingOrders(false);
  }, []);

  useEffect(() => {
    if (screen === "profile") {
      loadOrders();
    }
  }, [screen, loadOrders]);

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
          />
        )}
        {screen === "profile" && (
          <ProfileScreen orders={orders} loading={loadingOrders} />
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

      {showBottomNav && (
        <BottomNav screen={screen} onNav={goNav} cartCount={cartCount} />
      )}
    </div>
  );
}
