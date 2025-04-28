
import SectionTitle from "../../../components/ui/SectionTitle";
import FixedPriceStockCard from './FixedPriceStockCard';
import Button from '../../../components/ui/Button';

const FixedPriceStock = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
      <SectionTitle 
        heading="Fixed Price Stock" 
        subheading="Find from Large Number of Stock" 
      />
      <FixedPriceStockCard />
<div className='text-center mt-8 size-lg   text-xl'>
<Button >View All Stock</Button>
</div>    </div>
  );
};

export default FixedPriceStock;
