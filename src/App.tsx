import { useState } from "react";
import { supabase } from "@/supabase";
import { PRODUCTS, type Product, type Category } from "@/menu";
import logo from "@/imports/logo.png.jpg";


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
  primary: "#d81f1f",
  primaryDark: "#b01414",
  accent: "#ffb703",
  gradient: "#f3f3f3",
  card: "#ffffff",
  cardAlt: "#f6f6f6",
  text: "#1b1b1b",
  textMuted: "#7d7d7d",
  border: "#e6e6e6",
  headerBg: "#d81f1f",
};

const COCKTAIL_THEME: Theme = {
  primary: "#1f8a4c",
  primaryDark: "#166b3a",
  accent: "#f2c230",
  gradient: "#f2f7f1",
  card: "#ffffff",
  cardAlt: "#eaf3e8",
  text: "#14261a",
  textMuted: "#6b7f70",
  border: "#d8e6d5",
  headerBg: "#1f8a4c",
};

function themeFor(category: Category): Theme {
  return category === "drinks" ? COCKTAIL_THEME : BURGER_THEME;
}

const CARD_SHADOW = "0 10px 28px rgba(0,0,0,0.10)";

// ─── Icons ────────────────────────────────────────────────────────────────────

function Icon({
  d,
  size = 22,
  color = "currentColor",
  strokeWidth = 2.2,
  fill = "none",
}: {
  d: string | string[];
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths.map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}

const ICONS = {
  menu: ["M4 7h16", "M4 12h16", "M4 17h16"],
  search: ["M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z", "M20 20l-3.5-3.5"],
  back: ["M19 12H5", "M11 18l-6-6 6-6"],
  home: ["M3 11l9-8 9 8", "M5 10v10h14V10", "M10 20v-6h4v6"],
  list: ["M8 6h13", "M8 12h13", "M8 18h13", "M3 6h.01", "M3 12h.01", "M3 18h.01"],
  basket: [
    "M3 10h18l-1.5 9a2 2 0 0 1-2 1.7H6.5a2 2 0 0 1-2-1.7L3 10z",
    "M8 10l3-6",
    "M16 10l-3-6",
    "M9 14v3",
    "M15 14v3",
  ],
  heart: [
    "M12 20.5s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 8a4.3 4.3 0 0 1 7.5 2.5c0 5.4-7.5 10-7.5 10z",
  ],
  plus: ["M12 5v14", "M5 12h14"],
  minus: ["M5 12h14"],
  close: ["M6 6l12 12", "M18 6L6 18"],
  check: ["M5 12l5 5L20 7"],
  clock: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M12 7v5l3 2"],
  pin: ["M12 21s-6-5.3-6-11a6 6 0 0 1 12 0c0 5.7-6 11-6 11z", "M12 10h.01"],
  burger: [
    "M4 10h16a8 8 0 0 0-16 0z",
    "M3 14h18",
    "M4 17h16a2 2 0 0 1-2 3H6a2 2 0 0 1-2-3z",
  ],
  cocktail: ["M4 4h16l-8 9-8-9z", "M12 13v7", "M8 20h8", "M8 8h8"],
  bike: [
    "M5.5 17a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
    "M18.5 17a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
    "M5.5 14.5L9 9h6l3.5 5.5",
    "M12 14.5L9 9",
  ],
  store: ["M3 9l1.5-5h15L21 9", "M3 9h18v11H3z", "M9 20v-6h6v6"],
  cash: ["M2 7h20v10H2z", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M6 12h.01", "M18 12h.01"],
  card: ["M2 6h20v12H2z", "M2 10h20", "M6 15h4"],
};

// ─── Small UI pieces ──────────────────────────────────────────────────────────

function RoundButton({
  onClick,
  children,
  size = 44,
  bg = "#ffffff",
  color = "#1b1b1b",
  shadow = true,
  label,
  className = "",
}: {
  onClick?: () => void;
  children: React.ReactNode;
  size?: number;
  bg?: string;
  color?: string;
  shadow?: boolean;
  label?: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`rounded-full flex items-center justify-center active:scale-90 transition-transform flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        color,
        boxShadow: shadow ? "0 6px 16px rgba(0,0,0,0.18)" : "none",
      }}
    >
      {children}
    </button>
  );
}

function LogoBubble({ size = 44 }: { size?: number }) {
  return (
    <div
      className="rounded-full overflow-hidden flex-shrink-0 bg-white"
      style={{
        width: size,
        height: size,
        boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
        border: "2px solid #ffffff",
      }}
    >
      <img
        src={logo}
        alt="Wood Pecker Burger"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

function RedHeader({
  theme,
  left,
  right,
  title,
  children,
  bottomPadding = "pb-8",
}: {
  theme: Theme;
  left?: React.ReactNode;
  right?: React.ReactNode;
  title?: string;
  children?: React.ReactNode;
  bottomPadding?: string;
}) {
  return (
    <div
      className={`relative px-5 pt-12 ${bottomPadding} text-white overflow-hidden`}
      style={{
        backgroundColor: theme.headerBg,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.16) 0 40px, transparent 41px), radial-gradient(circle at 85% 30%, rgba(255,255,255,0.12) 0 60px, transparent 61px), radial-gradient(circle at 60% 90%, rgba(255,255,255,0.10) 0 50px, transparent 51px)",
        }}
      />
      <div className="relative flex items-center justify-between">
        <div className="w-11">{left}</div>
        {title && (
          <p className="font-bold text-base tracking-wide">{title}</p>
        )}
        <div className="w-11 flex justify-end">{right}</div>
      </div>
      {children && <div className="relative">{children}</div>}
    </div>
  );
}

function BottomNav({
  active,
  onNav,
  cartCount,
  theme,
}: {
  active: Screen;
  onNav: (s: Screen) => void;
  cartCount: number;
  theme: Theme;
}) {
  const items: { id: Screen; icon: string[]; label: string }[] = [
    { id: "home", icon: ICONS.home, label: "Accueil" },
    { id: "menu", icon: ICONS.list, label: "Menu" },
    { id: "cart", icon: ICONS.basket, label: "Panier" },
  ];
  return (
    <nav
      aria-label="Navigation principale"
      className="absolute bottom-0 left-0 right-0 pt-7 pb-6 px-8 flex items-center justify-around"
      style={{
        backgroundColor: theme.primary,
        borderRadius: "50% 50% 0 0 / 34px 34px 0 0",
        boxShadow: "0 -6px 20px rgba(0,0,0,0.12)",
      }}
    >
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            className="relative rounded-full flex items-center justify-center active:scale-90 transition-all"
            style={{
              width: 52,
              height: 52,
              backgroundColor: isActive ? "#ffffff" : "transparent",
              color: isActive ? theme.primary : "#ffffff",
              boxShadow: isActive ? "0 6px 16px rgba(0,0,0,0.2)" : "none",
            }}
          >
            <Icon d={item.icon} size={24} strokeWidth={2.4} />
            {item.id === "cart" && cartCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center"
                style={{
                  backgroundColor: theme.accent,
                  color: "#1b1b1b",
                  border: `2px solid ${theme.primary}`,
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

function CategoryRow({
  active,
  onChange,
  theme,
}: {
  active: Category;
  onChange: (c: Category) => void;
  theme: Theme;
}) {
  const cats: { id: Category; label: string; icon: string[] }[] = [
    { id: "burgers", label: "Burgers", icon: ICONS.burger },
    { id: "drinks", label: "Cocktails", icon: ICONS.cocktail },
  ];
  return (
    <div
      className="flex gap-3 overflow-x-auto px-5"
      style={{ scrollbarWidth: "none" }}
    >
      {cats.map((cat) => {
        const isActive = active === cat.id;
        const catTheme = themeFor(cat.id);
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm active:scale-95 transition-all flex-shrink-0"
            style={{
              backgroundColor: isActive ? catTheme.primary : theme.card,
              color: isActive ? "#ffffff" : theme.text,
              boxShadow: isActive ? CARD_SHADOW : "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <Icon d={cat.icon} size={18} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
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
      className={`w-full ${heights[size]} rounded-2xl overflow-hidden relative`}
      style={{ backgroundColor: product.imageBg, boxShadow: CARD_SHADOW }}
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
    <div className="flex flex-col pt-10 min-w-0">
      <div
        className="rounded-3xl flex flex-col items-center px-3 pb-3 pt-0"
        style={{ backgroundColor: theme.card, boxShadow: CARD_SHADOW }}
      >
        <div
          className="relative cursor-pointer w-[88%] -mt-10"
          onClick={onOpen}
        >
          <ProductImage product={product} size="md" />
          <button
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center bg-white"
            style={{
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              color: isFav ? theme.primary : theme.textMuted,
            }}
            aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
            aria-pressed={isFav}
            onClick={(e) => {
              e.stopPropagation();
              onFav();
            }}
          >
            <Icon
              d={ICONS.heart}
              size={16}
              fill={isFav ? theme.primary : "none"}
            />
          </button>
        </div>
        <div className="w-full pt-3">
          <p
            className="font-bold text-sm leading-tight text-pretty"
            style={{ color: theme.text }}
          >
            {product.name}
          </p>
          <p
            className="text-[11px] mt-1 line-clamp-2 leading-snug"
            style={{ color: theme.textMuted }}
          >
            {product.shortIngredients}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="font-bold text-base" style={{ color: theme.text }}>
              <span className="text-[11px] mr-0.5" style={{ color: theme.primary }}>
                DA
              </span>
              {product.price}
            </span>
            <button
              onClick={onAdd}
              aria-label={`Ajouter ${product.name} au panier`}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
              style={{
                backgroundColor: theme.primary,
                boxShadow: `0 6px 14px ${theme.primary}55`,
              }}
            >
              <Icon d={ICONS.plus} size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────

function greetingForNow() {
  const h = new Date().getHours();
  if (h < 12) return "Bonjour !";
  if (h < 18) return "Bon après-midi !";
  return "Bonsoir !";
}

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
  const [query, setQuery] = useState("");
  const theme = themeFor(activeCategory);

  const burgers = PRODUCTS.filter((p) => p.category === "burgers");
  const drinks = PRODUCTS.filter((p) => p.category === "drinks");

  const q = query.trim().toLowerCase();
  const visible = (activeCategory === "burgers" ? burgers : drinks).filter(
    (p) =>
      q === "" ||
      p.name.toLowerCase().includes(q) ||
      p.shortIngredients.toLowerCase().includes(q)
  );

  return (
    <div
      className="flex flex-col min-h-full pb-32"
      style={{ background: theme.gradient }}
    >
      <RedHeader
        theme={theme}
        left={
          <RoundButton onClick={() => onNav("menu")} label="Ouvrir le menu">
            <Icon d={ICONS.menu} size={20} strokeWidth={2.6} />
          </RoundButton>
        }
        right={<LogoBubble />}
      >
        {/* Greeting */}
        <div className="mt-7">
          <p className="text-base font-medium opacity-95">
            {greetingForNow()} 🍔
          </p>
          <p className="font-black text-2xl leading-tight mt-0.5 text-balance">
            {activeCategory === "burgers"
              ? "C'est l'heure du burger !"
              : "C'est l'heure du cocktail !"}
          </p>
          {cartCount > 0 && (
            <button
              onClick={() => onNav("cart")}
              className="mt-2 text-xs font-semibold underline underline-offset-2 opacity-90"
            >
              {cartCount} article(s) dans le panier
            </button>
          )}
        </div>

        {/* Search */}
        <label
          className="mt-5 flex items-center gap-3 rounded-full bg-white px-4 py-3"
          style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}
        >
          <span style={{ color: theme.textMuted }}>
            <Icon d={ICONS.search} size={18} />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Trouvons-vous un bon burger..."
            className="flex-1 bg-transparent outline-none text-sm min-w-0"
            style={{ color: theme.text }}
          />
        </label>
      </RedHeader>

      {/* Category Row */}
      <div className="mt-6">
        <CategoryRow
          active={activeCategory}
          onChange={setActiveCategory}
          theme={theme}
        />
      </div>

      {/* Section title */}
      <div className="px-5 mt-6 flex items-center justify-between">
        <p className="font-black text-lg" style={{ color: theme.text }}>
          {activeCategory === "burgers" ? "Nos Burgers" : "Nos Cocktails"}
        </p>
        <button
          className="text-xs font-bold"
          style={{ color: theme.primary }}
          onClick={() => onNav("menu")}
        >
          Tout voir →
        </button>
      </div>

      {/* Products grid */}
      <div className="px-5 grid grid-cols-2 gap-x-4">
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
        {visible.length === 0 && (
          <p
            className="col-span-2 text-center text-sm py-10"
            style={{ color: theme.textMuted }}
          >
            Aucun produit ne correspond à votre recherche.
          </p>
        )}
      </div>

      {/* Horaires d'ouverture */}
      <div
        className="mx-5 mt-8 rounded-full py-3 px-5 flex items-center justify-center gap-2"
        style={{ backgroundColor: theme.card, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}
      >
        <span style={{ color: theme.primary }}>
          <Icon d={ICONS.clock} size={16} />
        </span>
        <p className="text-sm font-semibold" style={{ color: theme.text }}>
          Horaires d'ouverture : 11h - Minuit
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
  onBack,
}: {
  onAddToCart: (p: Product) => void;
  onOpenProduct: (p: Product) => void;
  favs: Set<string>;
  onToggleFav: (id: string) => void;
  onBack: () => void;
}) {
  const [activeCategory, setActiveCategory] = useState<Category>("burgers");
  const theme = themeFor(activeCategory);
  const filtered = PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <div
      className="flex flex-col min-h-full pb-32"
      style={{ background: theme.gradient }}
    >
      <RedHeader
        theme={theme}
        title="Menu"
        left={
          <RoundButton onClick={onBack} label="Retour">
            <Icon d={ICONS.back} size={20} strokeWidth={2.6} />
          </RoundButton>
        }
        right={<LogoBubble />}
      >
        <div className="mt-6">
          <p className="font-black text-2xl leading-tight">
            {activeCategory === "burgers" ? "Nos Burgers" : "Nos Cocktails"}
          </p>
          <p className="text-sm mt-1 opacity-90">
            {activeCategory === "burgers"
              ? "L'art du burger, la vitesse du fast."
              : "Fraîcheur et saveurs"}
          </p>
        </div>
      </RedHeader>

      {/* Tabs */}
      <div className="mt-6">
        <CategoryRow
          active={activeCategory}
          onChange={setActiveCategory}
          theme={theme}
        />
      </div>

      {/* Product grid */}
      <div className="px-5 mt-2 grid grid-cols-2 gap-x-4">
        {filtered.map((product) => (
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
    </div>
  );
}

// ─── Product Detail Screen ────────────────────────────────────────────────────

const REMOVABLE = [
  { key: "sauce", label: "Sauce", img: "/ingredients/sauce.png" },
  { key: "oignon", label: "Oignon", img: "/ingredients/oignon.png" },
  { key: "tomate", label: "Tomate", img: "/ingredients/tomate.png" },
];

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
  const isBurger = product.category === "burgers";

  return (
    <div
      className="flex flex-col min-h-full pb-36"
      style={{ background: theme.gradient }}
    >
      <RedHeader
        theme={theme}
        title="Détails"
        bottomPadding={isBurger ? "pb-52" : "pb-40"}
        left={
          <RoundButton onClick={onBack} label="Retour">
            <Icon d={ICONS.back} size={20} strokeWidth={2.6} />
          </RoundButton>
        }
        right={<LogoBubble />}
      />

      {/* Photo + removable ingredients, overlapping the red header */}
      <div className={`px-5 flex gap-3 items-start ${isBurger ? "-mt-48" : "-mt-36"}`}>
        <div
          className="flex-1 min-w-0 h-64 rounded-3xl overflow-hidden"
          style={{ backgroundColor: product.imageBg, boxShadow: CARD_SHADOW }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            style={{
              objectPosition: "82% center",
              transform: "translateX(-10%) scale(1.45)",
              transformOrigin: "82% center",
            }}
          />
        </div>

        {isBurger && (
          <div className="w-[76px] flex flex-col gap-2 flex-shrink-0">
            <p className="text-white text-[11px] font-bold leading-tight text-center">
              Retirer des ingrédients
            </p>
            {REMOVABLE.map((ing) => {
              const removed = preferences[ing.key] === "sans";
              return (
                <button
                  key={ing.key}
                  onClick={() =>
                    setPreferences((prev) => ({
                      ...prev,
                      [ing.key]: removed ? "avec" : "sans",
                    }))
                  }
                  aria-pressed={removed}
                  aria-label={`${removed ? "Remettre" : "Retirer"} ${ing.label}`}
                  className="relative rounded-2xl flex flex-col items-center justify-center gap-1 py-2 active:scale-95 transition-all"
                  style={{
                    backgroundColor: theme.card,
                    boxShadow: CARD_SHADOW,
                    opacity: removed ? 0.55 : 1,
                  }}
                >
                  <span
                    className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: removed ? theme.primary : theme.cardAlt,
                      color: removed ? "#fff" : theme.textMuted,
                    }}
                  >
                    <Icon d={ICONS.close} size={9} strokeWidth={3} />
                  </span>
                  <img
                    src={ing.img}
                    alt=""
                    className="w-9 h-9 object-contain"
                    style={{ filter: removed ? "grayscale(1)" : "none" }}
                  />
                  <span
                    className="text-[10px] font-semibold"
                    style={{
                      color: theme.text,
                      textDecoration: removed ? "line-through" : "none",
                    }}
                  >
                    {ing.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="px-5 mt-6">
        {/* Name + short + qty */}
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p
              className="font-black text-2xl leading-tight text-balance"
              style={{ color: theme.text }}
            >
              {product.name}
            </p>
            <p className="text-sm mt-1" style={{ color: theme.textMuted }}>
              {product.shortIngredients}
            </p>
          </div>
          <div
            className="flex items-center gap-3 px-2 py-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: theme.card, boxShadow: CARD_SHADOW }}
          >
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              aria-label="Diminuer la quantité"
              className="w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-transform"
              style={{
                border: `2px solid ${theme.primary}`,
                color: theme.primary,
                opacity: qty === 1 ? 0.4 : 1,
              }}
            >
              <Icon d={ICONS.minus} size={14} strokeWidth={3} />
            </button>
            <span
              className="font-bold text-base w-4 text-center"
              style={{ color: theme.text }}
            >
              {qty}
            </span>
            <button
              onClick={() => setQty(qty + 1)}
              aria-label="Augmenter la quantité"
              className="w-7 h-7 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
              style={{ backgroundColor: theme.primary }}
            >
              <Icon d={ICONS.plus} size={14} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Full description */}
        <p
          className="text-sm leading-relaxed mt-5"
          style={{ color: theme.textMuted }}
        >
          {product.ingredients}
        </p>

        {/* Customization (burgers only) */}
        {isBurger && (
          <div className="mt-6 flex flex-col gap-5">
            <div>
              <p
                className="text-xs font-bold tracking-widest uppercase mb-3"
                style={{ color: theme.text }}
              >
                Suppléments
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "kiri", label: "Kiri", price: 50 },
                  { key: "steak", label: "Steak", price: 100 },
                  { key: "frites", label: "Barquette de frites", price: 300 },
                ].map((opt) => {
                  const on = supplements[opt.key];
                  return (
                    <button
                      key={opt.key}
                      onClick={() =>
                        setSupplements((prev) => ({
                          ...prev,
                          [opt.key]: !prev[opt.key],
                        }))
                      }
                      aria-pressed={on}
                      className="flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-full text-sm font-semibold active:scale-95 transition-all"
                      style={{
                        backgroundColor: on ? theme.primary : theme.card,
                        color: on ? "#fff" : theme.text,
                        boxShadow: on ? `0 6px 14px ${theme.primary}55` : "0 2px 8px rgba(0,0,0,0.06)",
                      }}
                    >
                      <span>{opt.label}</span>
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: on ? "rgba(255,255,255,0.22)" : theme.cardAlt,
                          color: on ? "#fff" : theme.primary,
                        }}
                      >
                        +{opt.price} DA
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: theme.text }}
              >
                Épicé
              </p>
              <div
                className="flex gap-1 p-1 rounded-full"
                style={{ backgroundColor: theme.card, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              >
                {["oui", "non"].map((val) => (
                  <button
                    key={val}
                    onClick={() =>
                      setPreferences((prev) => ({ ...prev, epice: val }))
                    }
                    className="px-4 py-1 rounded-full text-xs font-bold capitalize transition-all active:scale-95"
                    style={{
                      backgroundColor:
                        preferences.epice === val ? theme.primary : "transparent",
                      color: preferences.epice === val ? "#fff" : theme.textMuted,
                    }}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar: total + order */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="px-5 pb-3 flex justify-center relative z-10">
          <button
            onClick={() => onAddToCart({ ...product, price: unitPrice }, qty)}
            className="w-full flex items-center gap-3 pl-2 pr-5 py-2 rounded-full bg-white active:scale-[0.98] transition-transform"
            style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.22)" }}
          >
            <span
              className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0"
              style={{ backgroundColor: theme.primary }}
            >
              <Icon d={ICONS.basket} size={22} />
            </span>
            <span className="flex-1 text-left leading-tight">
              <span className="block text-sm" style={{ color: theme.textMuted }}>
                Total :{" "}
                <strong style={{ color: theme.primary }}>{unitPrice * qty} DA</strong>
              </span>
              <span className="block font-black text-base" style={{ color: theme.text }}>
                COMMANDER
              </span>
            </span>
            <span
              className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
              style={{ backgroundColor: theme.primary }}
            >
              Ajouter
            </span>
          </button>
        </div>
        <div
          className="h-10"
          style={{
            backgroundColor: theme.primary,
            borderRadius: "50% 50% 0 0 / 30px 30px 0 0",
          }}
        />
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
      className="flex flex-col min-h-full pb-32"
      style={{ background: theme.gradient }}
    >
      <RedHeader
        theme={theme}
        title="Mon Panier"
        left={
          <RoundButton onClick={onBack} label="Retour">
            <Icon d={ICONS.back} size={20} strokeWidth={2.6} />
          </RoundButton>
        }
        right={<LogoBubble />}
      >
        <p className="mt-5 text-sm opacity-90">
          {cart.length === 0
            ? "Votre panier est vide"
            : `${cart.reduce((s, i) => s + i.quantity, 0)} article(s)`}
        </p>
      </RedHeader>

      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5 pt-16">
          <span style={{ color: theme.border }}>
            <Icon d={ICONS.basket} size={72} strokeWidth={1.5} />
          </span>
          <p className="text-center text-sm" style={{ color: theme.textMuted }}>
            Votre panier est vide.
            <br />
            Ajoutez des produits pour commander.
          </p>
        </div>
      ) : (
        <>
          <div className="px-5 mt-6 flex flex-col gap-3">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="rounded-3xl p-3 flex items-center gap-3"
                style={{ backgroundColor: theme.card, boxShadow: CARD_SHADOW }}
              >
                <div
                  className="w-20 h-20 rounded-2xl flex-shrink-0 overflow-hidden"
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
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className="font-bold text-sm leading-tight"
                      style={{ color: theme.text }}
                    >
                      {item.product.name}
                    </p>
                    <button
                      onClick={() => onRemove(item.product.id)}
                      aria-label={`Retirer ${item.product.name}`}
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform"
                      style={{ backgroundColor: theme.cardAlt, color: theme.textMuted }}
                    >
                      <Icon d={ICONS.close} size={11} strokeWidth={3} />
                    </button>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: theme.textMuted }}>
                    {item.product.price} DA / unité
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div
                      className="flex items-center gap-2 px-1.5 py-1 rounded-full"
                      style={{ backgroundColor: theme.cardAlt }}
                    >
                      <button
                        onClick={() =>
                          item.quantity === 1
                            ? onRemove(item.product.id)
                            : onUpdateQty(item.product.id, item.quantity - 1)
                        }
                        aria-label="Diminuer la quantité"
                        className="w-6 h-6 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                        style={{ border: `2px solid ${theme.primary}`, color: theme.primary }}
                      >
                        <Icon d={ICONS.minus} size={11} strokeWidth={3} />
                      </button>
                      <span
                        className="font-bold text-sm w-4 text-center"
                        style={{ color: theme.text }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQty(item.product.id, item.quantity + 1)
                        }
                        aria-label="Augmenter la quantité"
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
                        style={{ backgroundColor: theme.primary }}
                      >
                        <Icon d={ICONS.plus} size={11} strokeWidth={3} />
                      </button>
                    </div>
                    <p
                      className="font-bold text-sm"
                      style={{ color: theme.primary }}
                    >
                      {item.product.price * item.quantity} DA
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div
            className="mx-5 mt-5 rounded-3xl p-5"
            style={{ backgroundColor: theme.card, boxShadow: CARD_SHADOW }}
          >
            <div className="flex justify-between py-1.5">
              <p className="text-sm" style={{ color: theme.textMuted }}>
                Sous-total
              </p>
              <p className="text-sm font-semibold" style={{ color: theme.text }}>
                {subtotal} DA
              </p>
            </div>
            <div
              className="flex justify-between py-1.5 border-b border-dashed"
              style={{ borderColor: theme.border }}
            >
              <p className="text-sm" style={{ color: theme.textMuted }}>
                Livraison
              </p>
              <p className="text-sm font-semibold" style={{ color: theme.text }}>
                {delivery} DA
              </p>
            </div>
            <div className="flex justify-between items-center pt-3">
              <p className="font-bold" style={{ color: theme.text }}>
                Total
              </p>
              <p
                className="font-black text-xl"
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
              className="w-full py-4 rounded-full text-white font-bold text-base active:scale-[0.98] transition-transform"
              style={{
                backgroundColor: theme.primary,
                boxShadow: `0 10px 24px ${theme.primary}66`,
              }}
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

  const sectionTitle = "text-xs font-bold tracking-widest uppercase mb-4";

  function OptionRow({
    selected,
    onClick,
    icon,
    label,
    sub,
    disabled,
  }: {
    selected: boolean;
    onClick: () => void;
    icon: string[];
    label: string;
    sub: string;
    disabled?: boolean;
  }) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full flex items-center gap-3 p-3 rounded-2xl mb-2 last:mb-0 active:scale-[0.98] transition-transform"
        style={{
          backgroundColor: selected ? `${theme.primary}12` : theme.cardAlt,
          border: `1.5px solid ${selected ? theme.primary : "transparent"}`,
          opacity: disabled ? 0.4 : 1,
        }}
      >
        <span
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: selected ? theme.primary : theme.card,
            color: selected ? "#fff" : theme.textMuted,
          }}
        >
          <Icon d={icon} size={20} />
        </span>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold" style={{ color: theme.text }}>
            {label}
          </p>
          <p className="text-xs" style={{ color: theme.textMuted }}>
            {sub}
          </p>
        </div>
        <div
          className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
          style={{ borderColor: selected ? theme.primary : theme.border }}
        >
          {selected && (
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: theme.primary }}
            />
          )}
        </div>
      </button>
    );
  }

  return (
    <div
      className="flex flex-col min-h-full pb-32"
      style={{ background: theme.gradient }}
    >
      <RedHeader
        theme={theme}
        title="Commander"
        left={
          <RoundButton onClick={onBack} label="Retour">
            <Icon d={ICONS.back} size={20} strokeWidth={2.6} />
          </RoundButton>
        }
        right={<LogoBubble />}
      >
        <p className="mt-5 text-sm opacity-90">
          Encore une étape avant de déguster.
        </p>
      </RedHeader>

      <div className="px-5 mt-6 flex flex-col gap-4">
        {/* Customer info */}
        <div
          className="rounded-3xl p-5"
          style={{ backgroundColor: theme.card, boxShadow: CARD_SHADOW }}
        >
          <p className={sectionTitle} style={{ color: theme.primary }}>
            Vos informations
          </p>
          <input
            type="text"
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full px-4 py-3 rounded-full text-sm outline-none mb-3"
            style={fieldStyle}
          />
          <input
            type="text"
            placeholder="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            className="w-full px-4 py-3 rounded-full text-sm outline-none mb-3"
            style={fieldStyle}
          />
          <input
            type="tel"
            placeholder="Numéro de téléphone"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            className="w-full px-4 py-3 rounded-full text-sm outline-none mb-3"
            style={fieldStyle}
          />
          <input
            type="text"
            placeholder="Adresse de livraison"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-3 rounded-full text-sm outline-none"
            style={fieldStyle}
          />
        </div>

        {/* Delivery mode */}
        <div
          className="rounded-3xl p-5"
          style={{ backgroundColor: theme.card, boxShadow: CARD_SHADOW }}
        >
          <p className={sectionTitle} style={{ color: theme.primary }}>
            Mode de livraison
          </p>
          <OptionRow
            selected={deliveryMode === "livraison"}
            onClick={() => setDeliveryMode("livraison")}
            icon={ICONS.bike}
            label="Livraison à domicile"
            sub="+150 DA"
          />
          <OptionRow
            selected={deliveryMode === "retrait"}
            onClick={() => setDeliveryMode("retrait")}
            icon={ICONS.store}
            label="Retrait au restaurant"
            sub="Gratuit"
          />
        </div>

        {/* Payment */}
        <div
          className="rounded-3xl p-5"
          style={{ backgroundColor: theme.card, boxShadow: CARD_SHADOW }}
        >
          <p className={sectionTitle} style={{ color: theme.primary }}>
            Paiement
          </p>
          <OptionRow
            selected={paymentMode === "livraison"}
            onClick={() => setPaymentMode("livraison")}
            icon={ICONS.cash}
            label="Paiement à la livraison"
            sub="Cash ou carte"
          />
          <OptionRow
            selected={paymentMode === "online"}
            onClick={() => {}}
            icon={ICONS.card}
            label="Paiement en ligne"
            sub="Bientôt disponible"
            disabled
          />
        </div>

        {/* Order summary */}
        <div
          className="rounded-3xl p-5"
          style={{ backgroundColor: theme.card, boxShadow: CARD_SHADOW }}
        >
          <p className={sectionTitle} style={{ color: theme.primary }}>
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
          <div
            className="border-t border-dashed mt-2 pt-3 flex justify-between items-center"
            style={{ borderColor: theme.border }}
          >
            <p className="font-bold" style={{ color: theme.text }}>
              Total
            </p>
            <p className="font-black text-xl" style={{ color: theme.primary }}>
              {total} DA
            </p>
          </div>
        </div>
      </div>

      {/* Confirm button */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="px-5 pb-3 relative z-10">
          <button
            onClick={() =>
              onConfirm({ nom, prenom, tel, address, deliveryMode, paymentMode })
            }
            disabled={!canSubmit}
            className="w-full py-4 rounded-full text-white font-bold text-base active:scale-[0.98] transition-transform disabled:opacity-50"
            style={{
              backgroundColor: theme.primary,
              boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
            }}
          >
            {submitting ? "Envoi en cours..." : "Confirmer la commande →"}
          </button>
        </div>
        <div
          className="h-10"
          style={{
            backgroundColor: theme.primary,
            borderRadius: "50% 50% 0 0 / 30px 30px 0 0",
          }}
        />
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
      className="flex flex-col min-h-full pb-10"
      style={{ background: theme.gradient }}
    >
      <RedHeader theme={theme} bottomPadding="pb-10" right={<LogoBubble />}>
        <div className="mt-6 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-white"
            style={{ color: theme.primary, boxShadow: "0 6px 16px rgba(0,0,0,0.18)" }}
          >
            <Icon d={ICONS.check} size={30} strokeWidth={3} />
          </div>
          <p className="font-black text-2xl">Commande confirmée !</p>
          <p className="text-sm mt-1 opacity-90">Merci pour votre commande.</p>
          <div
            className="inline-block mt-3 px-4 py-1.5 rounded-full text-xs font-bold bg-white"
            style={{ color: theme.primary }}
          >
            Commande #{order.id}
          </div>
        </div>
      </RedHeader>

      <div className="px-5 mt-6 flex flex-col gap-4">
        {/* Status tracker */}
        <div
          className="rounded-3xl p-5"
          style={{ backgroundColor: theme.card, boxShadow: CARD_SHADOW }}
        >
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
                    backgroundColor: i <= currentStep ? theme.primary : theme.cardAlt,
                    color: i <= currentStep ? "#fff" : theme.textMuted,
                    border: i <= currentStep ? "none" : `1.5px solid ${theme.border}`,
                  }}
                >
                  {i < currentStep ? (
                    <Icon d={ICONS.check} size={12} strokeWidth={3} />
                  ) : i === currentStep ? (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  ) : null}
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
                  <p className="text-xs mt-0.5" style={{ color: theme.primary }}>
                    En cours...
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order details */}
        <div
          className="rounded-3xl p-5"
          style={{ backgroundColor: theme.card, boxShadow: CARD_SHADOW }}
        >
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
            className="border-t border-dashed mt-2 pt-3 flex justify-between items-center"
            style={{ borderColor: theme.border }}
          >
            <p className="font-bold" style={{ color: theme.text }}>
              Total
            </p>
            <p className="font-black text-xl" style={{ color: theme.primary }}>
              {order.total} DA
            </p>
          </div>
        </div>

        {/* Delivery info */}
        <div
          className="rounded-3xl p-5 flex flex-col gap-3"
          style={{ backgroundColor: theme.card, boxShadow: CARD_SHADOW }}
        >
          <div className="flex items-center gap-3">
            <span style={{ color: theme.primary }}>
              <Icon d={ICONS.pin} size={20} />
            </span>
            <p className="text-sm font-semibold" style={{ color: theme.text }}>
              {order.address || "Retrait au restaurant"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span style={{ color: theme.primary }}>
              <Icon d={ICONS.clock} size={20} />
            </span>
            <p className="text-sm" style={{ color: theme.textMuted }}>
              Temps estimé :{" "}
              <strong style={{ color: theme.text }}>25–35 min</strong>
            </p>
          </div>
        </div>

        <button
          onClick={onHome}
          className="w-full py-4 rounded-full font-bold text-base text-white active:scale-[0.98] transition-transform"
          style={{
            backgroundColor: theme.primary,
            boxShadow: `0 10px 24px ${theme.primary}66`,
          }}
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

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const showNav = screen === "home" || screen === "menu" || screen === "cart";

  return (
    <div
      className="w-full h-full flex justify-center"
      style={{ background: "#2b2b2b", fontFamily: "'Outfit', sans-serif" }}
    >
      <div
        className="relative w-full h-full max-w-[430px] overflow-hidden"
        style={{ background: BURGER_THEME.gradient }}
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
              onBack={() => setScreen("home")}
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

        {showNav && (
          <BottomNav
            active={screen}
            onNav={goNav}
            cartCount={cartCount}
            theme={BURGER_THEME}
          />
        )}
      </div>
    </div>
  );
}
