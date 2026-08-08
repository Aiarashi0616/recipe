import { RecipeForm } from "@/components/RecipeForm";

export default function NewRecipePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold">レシピを登録</h1>
      <RecipeForm />
    </div>
  );
}
