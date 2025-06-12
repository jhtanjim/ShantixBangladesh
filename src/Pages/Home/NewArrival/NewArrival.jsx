import { useState } from 'react';
import SectionTitle from "../../../components/ui/SectionTitle";
import Card from '../../../components/card/Card';
import Button from '../../../components/ui/Button';
import { useAllCars } from '../../../hooks/useCars';
import { useShop } from '../../../Context/ShopContext';
import { Link } from 'react-router-dom';

const NewArrival = () => {

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
  // Sort by latest year (descending) and take top 9
  const latestCars = [...(carsResponse || [])]
    .sort((a, b) => b.year - a.year)
    .slice(0, 9);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-2">
      <SectionTitle 
        heading="New Arrival" 
        subheading="Best Selling Japan Used Cars" 
      />

      {isLoading && <div className="text-center py-8">Loading...</div>}
      {error && <div className="text-center text-red-500 py-8">Error loading cars.</div>}

      {!isLoading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {latestCars.map((car) => (
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
        </Link>
      </div>
    </div>
  );
};

export default NewArrival;
