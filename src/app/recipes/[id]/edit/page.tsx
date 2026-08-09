import { notFound } from "next/navigation";
import { getRecipeById } from "@/app/actions/recipes";
import { EditRecipeForm } from "@/components/EditRecipeForm";

export default async function EditRecipePage(props: PageProps<"/recipes/[id]/edit">) {
  const { id } = await props.params;
  const recipe = await getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold">レシピを編集</h1>
      <EditRecipeForm recipe={recipe} />
    </div>
  );
}
