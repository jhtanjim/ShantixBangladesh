import { useState } from "react"
import SelectField from "../../../components/ui/SelectField"
import Button from "../../../components/ui/Button"

const CarSearchForm = () => {
  const [searchParams, setSearchParams] = useState({
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
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(searchParams)
  }

  const handleReset = () => {
    setSearchParams({
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
    })
  }

  const makeOptions = [
    { value: "toyota", label: "Toyota" },
    { value: "honda", label: "Honda" },
    { value: "nissan", label: "Nissan" },
    { value: "mazda", label: "Mazda" },
    { value: "suzuki", label: "Suzuki" },
  ]

  const modelOptions = [
    { value: "alphard", label: "Alphard" },
    { value: "corolla", label: "Corolla" },
    { value: "camry", label: "Camry" },
    { value: "rav4", label: "RAV4" },
    { value: "land-cruiser", label: "Land Cruiser" },
  ]

  const yearOptions = Array.from({ length: 10 }, (_, i) => ({
    value: `${2015 + i}`,
    label: `${2015 + i}`,
  }))

  return (
    <div className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-4xl font-bold uppercase text-red-600 mb-6 md:text-start text-center">Find Japanese Used Cars</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
            {/* Form Fields */}
            <SelectField id="make" name="make" value={searchParams.make} onChange={handleChange} options={makeOptions} placeholder="Select Make" />
            <SelectField id="model" name="model" value={searchParams.model} onChange={handleChange} options={modelOptions} placeholder="All Model" />
            <SelectField id="modelCode" name="modelCode" value={searchParams.modelCode} onChange={handleChange} options={[]} placeholder="All Model Code" />
            <SelectField id="yearFrom" name="yearFrom" value={searchParams.yearFrom} onChange={handleChange} options={yearOptions} placeholder="Year From" />
            <SelectField id="yearTo" name="yearTo" value={searchParams.yearTo} onChange={handleChange} options={yearOptions} placeholder="Year To" />
            <SelectField id="priceFrom" name="priceFrom" value={searchParams.priceFrom} onChange={handleChange} options={[]} placeholder="Price From" />
            <SelectField id="priceTo" name="priceTo" value={searchParams.priceTo} onChange={handleChange} options={[]} placeholder="Price To" />
            <SelectField id="type" name="type" value={searchParams.type} onChange={handleChange} options={[]} placeholder="Select Type" />
            <SelectField id="engineCC" name="engineCC" value={searchParams.engineCC} onChange={handleChange} options={[]} placeholder="Select Engine CC" />
            <SelectField id="fuel" name="fuel" value={searchParams.fuel} onChange={handleChange} options={[]} placeholder="Select Fuel" />
            <SelectField id="mileageFrom" name="mileageFrom" value={searchParams.mileageFrom} onChange={handleChange} options={[]} placeholder="Mileage From" />
            <SelectField id="mileageTo" name="mileageTo" value={searchParams.mileageTo} onChange={handleChange} options={[]} placeholder="Mileage To" />
            <SelectField id="country" name="country" value={searchParams.country} onChange={handleChange} options={[]} placeholder="By Country" />
            <SelectField id="region" name="region" value={searchParams.region} onChange={handleChange} options={[]} placeholder="Select Region" />
            <SelectField id="color" name="color" value={searchParams.color} onChange={handleChange} options={[]} placeholder="Select Color" />
            <SelectField id="drive" name="drive" value={searchParams.drive} onChange={handleChange} options={[]} placeholder="Select Drive" />
            <SelectField id="transmission" name="transmission" value={searchParams.transmission} onChange={handleChange} options={[]} placeholder="Transmission" />
            <SelectField id="stock" name="stock" value={searchParams.stock} onChange={handleChange} options={[]} placeholder="Stock" />
            
            <input
              type="text"
              name="keywords"
              value={searchParams.keywords}
              onChange={handleChange}
              placeholder="Search by Keywords"
              className="border p-2 rounded w-full bg-white"
            />
            
            <button
              type="button"
              className="bg-gray-200 text-black font-medium py-2 px-4 rounded hover:bg-gray-300 w-full"
            >
              Best Offers
            </button>
          </div>

          {/* Buttons Section */}
          <div className="flex flex-wrap gap-4 items-center justify-center mt-6 p-4">
            <div className="bg-gray-300 text-black font-medium py-2 px-10 rounded">
              <h1 className="text-xl font-bold">All</h1>
            </div>
            
            <div className="text-gray-600 font-medium">Show Results</div>
            
            <Button 
            >
              Search
            </Button>
            
            <div>or</div>
            
            <button
              type="button"
              onClick={handleReset}
              className="text-red-600 font-medium hover:text-red-700"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CarSearchForm
