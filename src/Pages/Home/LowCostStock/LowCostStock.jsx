import { useState } from 'react';
import SectionTitle from "../../../components/ui/SectionTitle";
import Card from '../../../components/card/Card';
import Button from '../../../components/ui/Button';
import { useAllCars } from '../../../hooks/useCars';

const LowCostStock = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: carsResponse,
    isLoading,
    error,
  } = useAllCars({
    page: currentPage,
    limit: 20,
  });

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
          {sortedCars.map((car) => (
            <Card
              key={car.id}
              imageUrl={car.mainImage}
              imageAlt={car.title}
              year={car.year}
              title={car.title}
              price={car.price}
              priceLabel="USD"
              engineCC="N/A"
              transmission="N/A"
            />
          ))}
        </div>
      )}

      <div className="text-center mt-8 text-xl">
        <Button>View All Stock</Button>
      </div>
    </div>
  );
};

export default LowCostStock;
