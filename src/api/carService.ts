import axios from "./axios"

export interface CarFeature {
  id?: string // Only present in responses
  type: string
  name: string
  carId?: string // Only present in responses
  createdAt?: string // Only present in responses
  updatedAt?: string // Only present in responses
}

// Add a separate interface for creating/updating features
export interface CarFeatureInput {
  type: string
  name: string
}

export interface Car {
  id?: string // Changed from _id to id
  title: string
  mainImage: string
  gallery: string[]
  year: number
  fuel: string
  exteriorColor: string
  seats: number
  price: number
  isActive: boolean
  features: CarFeature[]
  createdAt?: string
  updatedAt?: string
}

export interface CarInput {
  title: string
  mainImage: string
  gallery: string[]
  year: number
  fuel: string
  exteriorColor: string
  seats: number
  price: number
  isActive: boolean
  features: CarFeatureInput[]
}

export interface CarFilters {
  search?: string
  minPrice?: number
  maxPrice?: number
  minYear?: number
  maxYear?: number
  fuel?: string
  color?: string
  sort?: "asc" | "desc"
  sortBy?: string
  page?: number
  limit?: number
}

export interface ApiResponse {
  data: Car[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Get all active cars (Public)
export const getAllCars = async (filters: CarFilters = {}): Promise<ApiResponse> => {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString())
    }
  })

  const response = await axios.get(`/cars?${params.toString()}`)
  return response.data
}

// Get all cars including inactive (Admin only)
export const getAllCarsAdmin = async (filters: CarFilters = {}): Promise<ApiResponse> => {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString())
    }
  })

  const response = await axios.get(`/cars/admin?${params.toString()}`)
  return response.data
}

// Get car by ID (Public)
export const getCarById = async (id: string): Promise<Car> => {
  const response = await axios.get(`/cars/${id}`)
  return response.data
}

// Create new car (Admin only)
export const createCar = async (carData: Omit<CarInput, "id" | "createdAt" | "updatedAt">): Promise<Car> => {
  const response = await axios.post("/cars", carData)
  return response.data
}

// Update car (Admin only)
export const updateCarById = async (id: string, data: Partial<CarInput>): Promise<Car> => {
  const response = await axios.put(`/cars/${id}`, data)
  return response.data
}

// Delete car (Admin only)
export const deleteCarById = async (id: string): Promise<void> => {
  const response = await axios.delete(`/cars/${id}`)
  return response.data
}

// Activate car (Admin only)
export const activateCarById = async (id: string): Promise<Car> => {
  const response = await axios.patch(`/cars/${id}/activate`)
  return response.data
}

// Deactivate car (Admin only)
export const deactivateCarById = async (id: string): Promise<Car> => {
  const response = await axios.patch(`/cars/${id}/deactivate`)
  return response.data
}

// Import cars (Admin only)
export const importCars = async (carsData: CarInput[]): Promise<ApiResponse> => {
  const response = await axios.post("/cars/import", carsData)
  return response.data
}
