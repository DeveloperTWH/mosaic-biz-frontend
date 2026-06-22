'use client';

import Link from 'next/link';
import PublicPageHero from '../../../Components/PublicPageHero';
import MarketEmptyState from '../../../Components/MarketEmptyState';

/**
 * Legacy mock restaurant detail route — kept for URL stability.
 * Live food vendor storefronts use /vendor-profile/food-vendor/[foodId].
 */
export default function RestaurantDetailPage() {
  return (
    <>
      <PublicPageHero
        title="Restaurant detail"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Food & Grocery', href: '/foods' },
          { label: 'Restaurant' },
        ]}
        imageUrl="/bgdetailpage.png"
      />
      <div className="container-page market-content-safe-bottom py-10">
        <MarketEmptyState
          title="Restaurant profiles are coming soon"
          description="This preview route used sample content. Browse live food vendors on Food & Grocery or visit a vendor storefront from search results."
          ctaLabel="Browse food & grocery"
          ctaHref="/foods"
        />
        <p className="mt-6 text-center font-montserrat text-xs text-market-muted">
          Need a specific vendor?{' '}
          <Link href="/search" className="text-market-teal underline hover:text-market-gold">
            Search the marketplace
          </Link>
        </p>
      </div>
    </>
  );
}
