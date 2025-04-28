import React from 'react';
import SectionTitle from "../../../components/ui/SectionTitle";
import LowCostStockCard from './LowCostStockCard';
import Button from '../../../components/ui/Button';

const LowCostStock = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <SectionTitle 
        heading="Low Cost High Quality" 
        subheading="Latest Arrivals - unbeatable range of Used Cars" 
      />
      <LowCostStockCard />
<div className='text-center mt-8 size-lg   text-xl'>
<Button >View All Stock</Button>
</div>    </div>
  );
};

export default LowCostStock;
