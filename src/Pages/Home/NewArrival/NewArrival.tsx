
import SectionTitle from "../../../components/ui/SectionTitle";
import Button from '../../../components/ui/Button';
import NewArrivalCard from './NewArrivalCard';

const NewArrival = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-2">
      <SectionTitle 
        heading="New Arrival" 
        subheading="Best Selling Japan Used Cars" 
      />
      <NewArrivalCard />
<div className='text-center mt-8 size-lg   text-xl'>
<Button >View All Stock</Button>
</div>    </div>
  );
};

export default NewArrival;
