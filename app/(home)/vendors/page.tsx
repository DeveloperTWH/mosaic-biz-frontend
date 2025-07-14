import SimilarProduct from "../products/[productid]/[id]/Component/SimilarProduct";
import HeroSection from "../services/components/HeroSection";
import VendorFilters from "./components/VendorFilters";
import VendorGrid from "./components/VendorGrid";


export default function VendorsPage() {
  return (
    <div className="min-h-screen bg-white">
      
        <HeroSection/>
      <div className="container px-4 py-10 mx-auto">
        <VendorGrid/>
        <div className="mt-12">
          <SimilarProduct/>
        </div>
      </div>
    </div>
  );
}
