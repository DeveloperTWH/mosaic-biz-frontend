import { redirect } from 'next/navigation'

type FoodShopPageProps = {
  params: Promise<{ id: string }>
}

export default async function FoodShopPage({ params }: FoodShopPageProps) {
  const { id } = await params
  redirect(`/vendor-profile/food-vendor/${encodeURIComponent(id)}`)
}
