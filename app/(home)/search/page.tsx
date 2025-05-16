import BannerSection from "./Component/BannerSection";
import FilterSidebar from "./Component/filters/FilterSidebar";
import ProductGrid from "./Component/products/ProductGrid";

export default function SearchPage() {
    return (
        <>
            <BannerSection />
            <div className="flex flex-col md:flex-row gap-6 mx-auto">
                <FilterSidebar />
                <div className="flex-1">
                    <ProductGrid/>
                </div>
            </div>
        </>
    );
}
