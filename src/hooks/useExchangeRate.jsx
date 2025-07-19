import { useCallback, useEffect, useState } from "react";

const useExchangeRate = () => {
  const [exchangeRate, setExchangeRate] = useState(142.08); // Default fallback rate
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Function to fetch exchange rate from API
  const fetchExchangeRate = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Using a free exchange rate API
      const response = await fetch(
        "https://api.exchangerate-api.com/v4/latest/USD"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch exchange rate");
      }

      const data = await response.json();

      if (data.rates && data.rates.JPY) {
        setExchangeRate(data.rates.JPY);
        setLastUpdated(new Date());

        // Cache the rate in localStorage with timestamp
        localStorage.setItem(
          "exchangeRate",
          JSON.stringify({
            rate: data.rates.JPY,
            timestamp: new Date().getTime(),
          })
        );
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching exchange rate:", err);
      setError(err.message);

      // Try to use cached rate if available
      const cachedRate = getCachedRate();
      if (cachedRate) {
        setExchangeRate(cachedRate.rate);
        setLastUpdated(new Date(cachedRate.timestamp));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to get cached exchange rate
  const getCachedRate = useCallback(() => {
    try {
      const cached = localStorage.getItem("exchangeRate");
      if (cached) {
        const parsedCache = JSON.parse(cached);
        const now = new Date().getTime();
        const cacheAge = now - parsedCache.timestamp;

        // Use cached rate if it's less than 1 hour old
        if (cacheAge < 3600000) {
          // 1 hour in milliseconds
          return parsedCache;
        }
      }
    } catch (error) {
      console.error("Error reading cached exchange rate:", error);
    }
    return null;
  }, []);

  // Function to convert USD to JPY
  const convertToJPY = useCallback(
    (usdAmount) => {
      if (!usdAmount || !exchangeRate) return 0;
      return Math.round(usdAmount * exchangeRate);
    },
    [exchangeRate]
  );

  // Function to convert JPY to USD
  const convertToUSD = useCallback(
    (jpyAmount) => {
      if (!jpyAmount || !exchangeRate) return 0;
      return Math.round((jpyAmount / exchangeRate) * 100) / 100; // Round to 2 decimal places
    },
    [exchangeRate]
  );

  // Function to format currency
  const formatCurrency = useCallback((amount, currency = "JPY") => {
    if (currency === "JPY") {
      return new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } else if (currency === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }
    return amount;
  }, []);

  // Function to manually refresh rate
  const refreshRate = useCallback(() => {
    fetchExchangeRate();
  }, [fetchExchangeRate]);

  // Load cached rate on mount and fetch fresh rate
  useEffect(() => {
    const cachedRate = getCachedRate();
    if (cachedRate) {
      setExchangeRate(cachedRate.rate);
      setLastUpdated(new Date(cachedRate.timestamp));
    }

    // Fetch fresh rate
    fetchExchangeRate();
  }, [fetchExchangeRate, getCachedRate]);

  // Auto-refresh every hour
  useEffect(() => {
    const interval = setInterval(fetchExchangeRate, 3600000); // 1 hour
    return () => clearInterval(interval);
  }, [fetchExchangeRate]);

  return {
    exchangeRate,
    loading,
    error,
    lastUpdated,
    convertToJPY,
    convertToUSD,
    formatCurrency,
    refreshRate,
  };
};

export default useExchangeRate;
