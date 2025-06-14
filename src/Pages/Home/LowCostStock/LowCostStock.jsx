import { useState } from 'react';
import SectionTitle from "../../../components/ui/SectionTitle";
import Card from '../../../components/card/Card';
import Button from '../../../components/ui/Button';
import { useAllCars } from '../../../hooks/useCars';
import { useShop } from '../../../Context/ShopContext';
import { Link } from 'react-router-dom';

const LowCostStock = () => {
  const [currentPage, setCurrentPage] = useState(1);

   const {
      data: carsResponse,
      isLoading,
      error,
    } = useAllCars({
      page: 1,
      limit: 20,
    });
  
    const { addToCart, addToWishlist, isInCart, isInWishlist } = useShop();
  
    const handleAddToCart = (car) => {
      addToCart(car);
    };
  
    const handleAddToWishlist = (car) => {
      addToWishlist(car);
    };
  // Safely sort cars by price (Low to High)
  const sortedCars = [...(carsResponse || [])].sort((a, b) => a.price - b.price);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <SectionTitle 
        heading="Low Cost High Quality" 
        subheading="Latest Arrivals - unbeatable range of Used Cars" 
      />

      {isLoading && (
        <p className="text-center py-8">Loading...</p>
      )}

      {error && (
        <p className="text-center text-red-500 py-8">Failed to load cars.</p>
      )}

      {!isLoading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {sortedCars.slice(0, 10).map((car) => (
            <Card
              key={car.id}
              id={car.id}
              imageUrl={car.mainImage}
              imageAlt={car.title}
              year={car.year}
              title={car.title}
              price={car.price}
              priceLabel="USD"
              fuel={car.fuel}
              exteriorColor={car.exteriorColor}
              seats={car.seats}
              onAddToCart={() => handleAddToCart(car)}
              onAddToWishlist={() => handleAddToWishlist(car)}
              isInCart={isInCart(car.id)}
              isInWishlist={isInWishlist(car.id)}
            />
          ))}
        </div>
      )}

      <div className="text-center mt-8 text-xl">
<Link to={"/allCars"}>
          <Button>View All Stock</Button>
        </Link>      </div>
    </div>
  );
};

export default LowCostStock;
