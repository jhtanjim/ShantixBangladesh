import { Link } from "react-router-dom";
import Card from "../../../components/card/Card";
import Button from "../../../components/ui/Button";
import SectionTitle from "../../../components/ui/SectionTitle";
import { useShop } from "../../../Context/ShopContext";
import { useAllCars } from "../../../hooks/useCars";

const FixedPriceStock = () => {
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

  // Get and sort cars by price (lowest first)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle
        heading="Fixed Price Stock"
        subheading="Find from Large Number of Stock"
      />

      {isLoading && <p className="text-center py-8">Loading...</p>}

      {error && (
        <p className="text-center py-8 text-red-500">Error loading cars.</p>
      )}

      {!isLoading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {carsResponse?.slice(0, 10).map((car) => (
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

      <div className="text-center mt-8">
        <Link to={"/allCars"}>
          <Button>View All Stock</Button>
        </Link>{" "}
      </div>
    </div>
  );
};

export default FixedPriceStock;
