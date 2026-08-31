import { useMemo, useState } from "react";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import recipes from "./data/recipes.json";

const MEALS = ["Breakfast", "Lunch", "Dinner", "Snack"];

function RecipePhoto({ recipe, tall }) {
  const className = `photo ${tall ? "tall" : ""} meal-${recipe.meal.toLowerCase()}`;
  if (recipe.image) {
    return (
      <div className={className}>
        <img src={recipe.image} alt={recipe.title} />
      </div>
    );
  }
  return (
    <div className={className}>
      <span>{recipe.meal}</span>
    </div>
  );
}

export default function App() {
  const [list, setList] = useState([]);
  const [active, setActive] = useState(null);

  const add = (recipe) => {
    setList((current) =>
      current.some((item) => item.id === recipe.id) ? current : [...current, recipe]
    );
  };

  const remove = (id) => setList((current) => current.filter((item) => item.id !== id));

  return (
    <div className="wrap">
      <header className="topbar">
        <Link to="/" className="brand">
          Pantry <span>Ledger</span>
        </Link>
        <nav>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Recipes
          </NavLink>
          <NavLink to="/list" className={({ isActive }) => (isActive ? "active" : "")}>
            Shopping list
            {list.length > 0 && <span className="count-pill">{list.length}</span>}
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={<Catalog onOpen={setActive} onAdd={add} selected={list} />}
        />
        <Route path="/list" element={<ShoppingList items={list} onRemove={remove} />} />
      </Routes>

      {active && (
        <Modal
          recipe={active}
          onClose={() => setActive(null)}
          onAdd={add}
          added={list.some((item) => item.id === active.id)}
        />
      )}
    </div>
  );
}

function Catalog({ onOpen, onAdd, selected }) {
  const [query, setQuery] = useState("");
  const [meal, setMeal] = useState("All");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return recipes.filter((recipe) => {
      if (meal !== "All" && recipe.meal !== meal) return false;
      if (!needle) return true;
      const hay = `${recipe.title} ${recipe.ingredients.join(" ")}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [query, meal]);

  const sections = (meal === "All" ? MEALS : [meal]).filter((label) =>
    visible.some((recipe) => recipe.meal === label)
  );

  return (
    <section>
      <div className="hero">
        <h1>High-protein recipes.</h1>
        <p>
          Breakfast, lunch, dinner, and smoothies. Open a card for ingredients and
          steps. Content lives in JSON so you can edit a recipe without touching the UI.
        </p>
      </div>

      <div className="controls">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search recipes or ingredients"
          aria-label="Search recipes"
        />
        <select value={meal} onChange={(event) => setMeal(event.target.value)} aria-label="Meal">
          <option>All</option>
          {MEALS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      {sections.length === 0 ? (
        <p className="empty">No recipes match that search.</p>
      ) : (
        sections.map((label) => (
          <MealRow
            key={label}
            label={label}
            items={visible.filter((recipe) => recipe.meal === label)}
            onOpen={onOpen}
            onAdd={onAdd}
            selected={selected}
          />
        ))
      )}
    </section>
  );
}

function MealRow({ label, items, onOpen, onAdd, selected }) {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const maxPage = Math.max(0, Math.ceil(items.length / perPage) - 1);
  const start = page * perPage;
  const visibleCards = items.slice(start, start + perPage);

  const prev = () => setPage((current) => Math.max(0, current - 1));
  const next = () => setPage((current) => Math.min(maxPage, current + 1));

  return (
    <section className="meal-block">
      <h2>{label} recipes</h2>
      <div className="slider">
        <button className="slider-btn" onClick={prev} disabled={page === 0} aria-label="Previous">
          ‹
        </button>
        <div className="slider-track">
          {visibleCards.map((recipe) => (
            <article className="card" key={recipe.id}>
              <RecipePhoto recipe={recipe} />
              <h3>{recipe.title}</h3>
              <p className="meta">
                {recipe.calories} cal · {recipe.protein}g protein
              </p>
              <button className="primary wide" onClick={() => onOpen(recipe)}>
                View recipe
              </button>
            </article>
          ))}
        </div>
        <button className="slider-btn" onClick={next} disabled={page === maxPage} aria-label="Next">
          ›
        </button>
      </div>
      <div className="dots" aria-hidden="true">
        {Array.from({ length: maxPage + 1 }).map((_, index) => (
          <button
            key={index}
            className={index === page ? "dot on" : "dot"}
            onClick={() => setPage(index)}
          />
        ))}
      </div>
    </section>
  );
}

function Modal({ recipe, onClose, onAdd, added }) {
  return (
    <div className="modal-back" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <h2 id="recipe-title">{recipe.title}</h2>
         
        </div>
        <div className="modal-grid">
          <RecipePhoto recipe={recipe} tall />
          <div>
            <h3>Ingredients</h3>
            <ul>
              {recipe.ingredients.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <h3>Instructions</h3>
            <ol>
              {recipe.steps.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>
            <p><b>Prep Time:</b> {recipe.prepTime || "—"}</p>
            <p><b>Cook Time:</b> {recipe.cookTime || "—"}</p>
            <p><b>Protein:</b> {recipe.protein}g</p>
            <p><b>Calories:</b> {recipe.calories}</p>
          </div>
        </div>
        <div className="modal-foot">
          <button className="ghost" onClick={onClose}>
            Close
          </button>
          <button className="primary" onClick={() => onAdd(recipe)}>
            {added ? "Already on the list" : "Add to shopping list"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ShoppingList({ items, onRemove }) {
  const lines = items.flatMap((recipe) =>
    recipe.ingredients.map((ingredient) => ({ recipe: recipe.title, ingredient }))
  );

  return (
    <section className="list-page">
      <div className="hero">
        <h1>Shopping list</h1>
        <p>Built from recipes you add. Local state only — no account.</p>
      </div>
      {items.length === 0 ? (
        <p className="empty">
          Nothing here yet. <Link to="/">Add a recipe.</Link>
        </p>
      ) : (
        <>
          <ul>
            {lines.map((line) => (
              <li key={`${line.recipe}-${line.ingredient}`}>
                <span>
                  {line.ingredient}
                  <div className="meta">{line.recipe}</div>
                </span>
              </li>
            ))}
          </ul>
          {items.map((recipe) => (
            <p key={recipe.id}>
              <button className="ghost" onClick={() => onRemove(recipe.id)}>
                Remove {recipe.title}
              </button>
            </p>
          ))}
        </>
      )}
    </section>
  );
}
