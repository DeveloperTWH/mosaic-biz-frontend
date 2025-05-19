import ProductCard from "./ProductCard";

const sampleProducts = [
  {
    id: "1",
    brand: "Levi's",
    title: "Men Slim Fit Printed Spread Collar Casual Shirt",
    price: 799,
    image: "/products/image.png",
    rating: 4.2,
    ratingCount: 234,
  },
  {
    id: "2",
    brand: "U.S. POLO ASSN.",
    title: "Men Slim Fit Checked Spread Collar Casual Shirt",
    price: 899,
    image: "/products/image 1.png",
    rating: 4.0,
    ratingCount: 180,
  },
  {
    id: "3",
    brand: "S.M.",
    title: "Men Slim Fit Checked Spread Collar Casual T-Shirt",
    price: 745,
    image: "/products/image 2.png",
    rating: 4.0,
    ratingCount: 180,
  },
  // add more as needed
];

const ProductGrid = () => {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
      {sampleProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
};

export default ProductGrid;
