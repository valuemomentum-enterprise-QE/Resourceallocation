/**
 * Resolves API paths for local Express proxy and GitHub Pages static JSON.
 * Dev (proxy):   /api/executive
 * Pages build:   /Resourceallocation/capacitylens/api/executive.json
 */
export async function api(path) {
  const clean = path.replace(/^\/api\//, "").replace(/\/$/, "");
  const base = import.meta.env.BASE_URL || "/";
  // Prefer explicit flag; also detect Pages base so static hosting never calls Express.
  const useStatic =
    import.meta.env.VITE_STATIC_API === "true" ||
    base.includes("/Resourceallocation/");

  const url = useStatic ? `${base}api/${clean}.json` : `/api/${clean}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`API ${url} failed (${res.status})`);
  return res.json();
}
