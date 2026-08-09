type JsonLdNode = Record<string, unknown>;

type ExtractedRecipe = {
  ingredients: string;
  steps: string;
};

export function isInstagramUrl(url: string): boolean {
  try {
    return new URL(url).hostname.includes("instagram.com");
  } catch {
    return false;
  }
}

export function getDomain(url: string): string {
  const hostname = new URL(url).hostname;
  return hostname.startsWith("www.") ? hostname.slice(4) : hostname;
}

export async function extractRecipeFromUrl(url: string): Promise<ExtractedRecipe | null> {
  let html: string;
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      },
    });
    if (!res.ok) {
      return null;
    }
    html = await res.text();
  } catch {
    return null;
  }

  const recipeNode = findRecipeNode(html);
  if (!recipeNode) {
    return null;
  }

  const ingredients = extractIngredients(recipeNode);
  const steps = extractSteps(recipeNode);

  if (!ingredients && !steps) {
    return null;
  }

  return { ingredients, steps };
}

function findRecipeNode(html: string): JsonLdNode | null {
  const scriptRegex =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;

  while ((match = scriptRegex.exec(html)) !== null) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(match[1].trim());
    } catch {
      continue;
    }

    const candidates: JsonLdNode[] = [];
    collectCandidates(parsed, candidates);

    const recipe = candidates.find(isRecipeNode);
    if (recipe) {
      return recipe;
    }
  }

  return null;
}

function collectCandidates(value: unknown, out: JsonLdNode[]): void {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectCandidates(item, out);
    }
    return;
  }
  if (value && typeof value === "object") {
    const node = value as JsonLdNode;
    out.push(node);
    if (Array.isArray(node["@graph"])) {
      collectCandidates(node["@graph"], out);
    }
  }
}

function isRecipeNode(node: JsonLdNode): boolean {
  const type = node["@type"];
  if (typeof type === "string") {
    return type === "Recipe";
  }
  if (Array.isArray(type)) {
    return type.includes("Recipe");
  }
  return false;
}

function extractIngredients(node: JsonLdNode): string {
  const raw = node["recipeIngredient"] ?? node["ingredients"];
  if (!Array.isArray(raw)) {
    return "";
  }
  return raw
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .join("\n");
}

function extractSteps(node: JsonLdNode): string {
  const raw = node["recipeInstructions"];
  if (!raw) {
    return "";
  }
  const lines: string[] = [];
  flattenInstructions(raw, lines);
  return lines.filter(Boolean).join("\n");
}

function flattenInstructions(value: unknown, out: string[]): void {
  if (typeof value === "string") {
    out.push(value.trim());
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      flattenInstructions(item, out);
    }
    return;
  }
  if (value && typeof value === "object") {
    const node = value as JsonLdNode;
    if (typeof node.text === "string") {
      out.push(node.text.trim());
      return;
    }
    if (Array.isArray(node.itemListElement)) {
      flattenInstructions(node.itemListElement, out);
    }
  }
}
