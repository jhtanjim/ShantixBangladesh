
import Card from '../../../components/card/Card';

const LowCostStockCard = () => {
  const cars = Array(10).fill({
    imageUrl: "https://i.ibb.co.com/n8Z1cbfC/eb4e98ce47207f48f662d0c29c9532fc191176c6.jpg",
    imageAlt: "X-Trail",
    year: "2015",
    title: "X-Trail",
    price: "7,599 USD",
    priceLabel: "FOB",
    engineCC: "1,700 CC",
    transmission: "FAT"
  });

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {cars.map((car, index) => (
        <Card
          key={index}
          imageUrl={car.imageUrl}
          imageAlt={car.imageAlt}
          year={car.year}
          title={car.title}
          price={car.price}
          priceLabel={car.priceLabel}
          engineCC={car.engineCC}
          transmission={car.transmission}
        />
      ))}
    </div>
  );
};

export default LowCostStockCard;
