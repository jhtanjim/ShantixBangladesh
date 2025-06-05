import { useState, useMemo } from "react";
import SelectField from "../../../components/ui/SelectField";
import Button from "../../../components/ui/Button";
import { useAllCars } from "../../../hooks/useCars";
import Card from "../../../components/card/Card";

// Constants
const initialSearchParams = {
  make: "",
  model: "",
  modelCode: "",
  yearFrom: "",
  yearTo: "",
  priceFrom: "",
  priceTo: "",
  type: "",
  engineCC: "",
  fuel: "",
  mileageFrom: "",
  mileageTo: "",
  country: "",
  region: "",
  color: "",
  drive: "",
  transmission: "",
  stock: "",
  keywords: ""
};

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: currentYear - 1979 }, (_, i) => {
    const year = (currentYear - i).toString();
    return { value: year, label: year };
  });
};

const getPriceOptions = () =>
  Array.from({ length: 200 }, (_, i) => {
    const price = (500 + i * 500).toString();
    return { value: price, label: `$${price}` };
  });

const CarSearchForm = () => {
  const [searchParams, setSearchParams] = useState(initialSearchParams);
  const [query, setQuery] = useState("");
  const { data: results = [], refetch, isLoading } = useAllCars(searchParams);

  const dynamicOptions = useMemo(() => {
    if (!results?.length) return {};

    const extractOptions = (field, numeric = false) => {
      const unique = Array.from(
        new Set(results.map(car => car[field]).filter(Boolean))
      );

      return unique
        .sort(numeric ? (a, b) => a - b : undefined)
        .map((value) => ({ value: value.toString(), label: value.toString() }));
    };

    return {
      make: extractOptions("make"),
      model: extractOptions("model"),
      modelCode: extractOptions("modelCode"),
      type: extractOptions("type"),
      fuel: extractOptions("fuel"),
      country: extractOptions("country"),
      region: extractOptions("region"),
      color: extractOptions("color"),
      drive: extractOptions("drive"),
      transmission: extractOptions("transmission"),
      stock: extractOptions("stock"),
      engineCC: extractOptions("engineCC", true),
      mileage: extractOptions("mileage", true)
    };
  }, [results]);

  const filteredModels = useMemo(() => {
    if (!searchParams.make) return dynamicOptions.model || [];

    const models = Array.from(
      new Set(
        results
          .filter((car) => car.make === searchParams.make)
          .map((car) => car.model)
          .filter(Boolean)
      )
    ).sort();

    return models.map((model) => ({ value: model, label: model }));
  }, [searchParams.make, results, dynamicOptions.model]);

  const filteredModelCodes = useMemo(() => {
    if (!searchParams.make) return dynamicOptions.modelCode || [];

    let filtered = results.filter((car) => car.make === searchParams.make);
    if (searchParams.model) {
      filtered = filtered.filter((car) => car.model === searchParams.model);
    }

    const modelCodes = Array.from(
      new Set(filtered.map((car) => car.modelCode).filter(Boolean))
    ).sort();

    return modelCodes.map((code) => ({ value: code, label: code }));
  }, [searchParams.make, searchParams.model, results, dynamicOptions.modelCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...searchParams, [name]: value };

    if (name === "make") {
      updated.model = "";
      updated.modelCode = "";
    } else if (name === "model") {
      updated.modelCode = "";
    }

    setSearchParams(updated);
    if (name === "keywords") setQuery(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    refetch();
  };

  const handleReset = () => {
    setSearchParams(initialSearchParams);
    setQuery("");
    refetch();
  };

  return (
    <div className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-4xl font-bold uppercase text-red-600 mb-6 text-center md:text-start">
          Find Japanese Used Cars
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
            <SelectField name="make" value={searchParams.make} onChange={handleChange} options={dynamicOptions.make || []} placeholder="Select Make" />
            <SelectField name="model" value={searchParams.model} onChange={handleChange} options={filteredModels} placeholder="All Model" />
            <SelectField name="modelCode" value={searchParams.modelCode} onChange={handleChange} options={filteredModelCodes} placeholder="All Model Code" />
            <SelectField name="yearFrom" value={searchParams.yearFrom} onChange={handleChange} options={getYearOptions()} placeholder="Year From" />
            <SelectField name="yearTo" value={searchParams.yearTo} onChange={handleChange} options={getYearOptions()} placeholder="Year To" />
            <SelectField name="priceFrom" value={searchParams.priceFrom} onChange={handleChange} options={getPriceOptions()} placeholder="Price From" />
            <SelectField name="priceTo" value={searchParams.priceTo} onChange={handleChange} options={getPriceOptions()} placeholder="Price To" />
            <SelectField name="type" value={searchParams.type} onChange={handleChange} options={dynamicOptions.type || []} placeholder="Select Type" />
            <SelectField name="engineCC" value={searchParams.engineCC} onChange={handleChange} options={dynamicOptions.engineCC || []} placeholder="Select Engine CC" />
            <SelectField name="fuel" value={searchParams.fuel} onChange={handleChange} options={dynamicOptions.fuel || []} placeholder="Select Fuel" />
            <SelectField name="mileageFrom" value={searchParams.mileageFrom} onChange={handleChange} options={dynamicOptions.mileage || []} placeholder="Mileage From" />
            <SelectField name="mileageTo" value={searchParams.mileageTo} onChange={handleChange} options={dynamicOptions.mileage || []} placeholder="Mileage To" />
            <SelectField name="country" value={searchParams.country} onChange={handleChange} options={dynamicOptions.country || []} placeholder="By Country" />
            <SelectField name="region" value={searchParams.region} onChange={handleChange} options={dynamicOptions.region || []} placeholder="Select Region" />
            <SelectField name="color" value={searchParams.color} onChange={handleChange} options={dynamicOptions.color || []} placeholder="Select Color" />
            <SelectField name="drive" value={searchParams.drive} onChange={handleChange} options={dynamicOptions.drive || []} placeholder="Select Drive" />
            <SelectField name="transmission" value={searchParams.transmission} onChange={handleChange} options={dynamicOptions.transmission || []} placeholder="Transmission" />
            <SelectField name="stock" value={searchParams.stock} onChange={handleChange} options={dynamicOptions.stock || []} placeholder="Stock" />
            <input type="text" name="keywords" value={searchParams.keywords} onChange={handleChange} placeholder="Search by Keywords" className="border p-2 rounded w-full bg-white" />
            <button type="button" className="bg-gray-200 text-black font-medium py-2 px-4 rounded hover:bg-gray-300 w-full">Best Offers</button>
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-center mt-6 p-4">
            <div className="bg-gray-300 text-black font-medium py-2 px-10 rounded">
              <h1 className="text-xl font-bold">All ({results.length})</h1>
            </div>
            <div className="text-gray-600 font-medium">Show Results</div>
            <Button type="submit">Search</Button>
            <Button type="button" onClick={handleReset}>Reset</Button>
          </div>
        </form>

        {isLoading ? (
          <p className="text-center mt-6">Loading cars...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {results.map((car, index) => (
              <Card key={index} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarSearchForm;
