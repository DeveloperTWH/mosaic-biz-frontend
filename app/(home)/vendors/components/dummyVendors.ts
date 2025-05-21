export const dummyVendors = Array.from({ length: 100 }, (_, i) => {
  const companies = [
    'Raymond', 'Ray-Ban', 'Allen Solly', 'FILA', 'Reebok', 'Puma', 'Pepe Jeans',
    'Jack & Jones', 'U.S. Polo Assn.', 'Peter England', 'H&M', "Levi's",
    'Zara', 'Nike', 'Adidas', 'Gucci', 'Prada', 'Calvin Klein', 'Tommy Hilfiger',
    'Versace', 'Burberry', 'Under Armour', 'Lacoste', 'New Balance', 'Asics'
  ];

  const categories = ['Fashion', 'Electronics', 'Beauty', 'Home', 'Footwear'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];

  const imageNumber = (i % 10) + 1; // from 1 to 10
  const imageName = `image ${imageNumber}.png`;

  return {
    name: `${companies[i % companies.length]} ${i + 1}`,
    logo: `/vendors/${imageName}`,
    category: categories[i % categories.length],
    city: cities[i % cities.length],
  };
});
