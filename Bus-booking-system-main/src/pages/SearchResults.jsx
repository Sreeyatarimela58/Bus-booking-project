"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import BusCard from "../components/layouts/bus-card"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { ArrowLeft, Filter, SortAsc, Calendar, MapPin, Search } from "lucide-react"

const SearchResults = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState("price")
  const [filterType, setFilterType] = useState("all")

  // Get search params from location state
  const searchParams = location.state || {
    from: "Bangalore",
    to: "Hyderabad",
    date: new Date().toISOString().split("T")[0],
  }

  useEffect(() => {
    fetchBuses()
  }, [])

  const fetchBuses = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `http://localhost:5000/api/buses/search?from=${searchParams.from}&to=${searchParams.to}&date=${searchParams.date}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch buses")
      }

      const data = await response.json()
      setBuses(data.buses || [])
    } catch (err) {
      setError(err.message)
      console.error("Error fetching buses:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleBusSelect = (bus) => {
    navigate("/seat-booking", {
      state: {
        bus,
        searchParams,
      },
    })
  }

  const handleBackToSearch = () => {
    navigate("/")
  }

  const sortBuses = (buses, sortBy) => {
    const sorted = [...buses]
    switch (sortBy) {
      case "price":
        return sorted.sort((a, b) => a.fare - b.fare)
      case "departure":
        return sorted.sort((a, b) => a.departureTime.localeCompare(b.departureTime))
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case "seats":
        return sorted.sort((a, b) => {
          const seatsA = a.totalSeats - (a.bookedSeats?.length || 0)
          const seatsB = b.totalSeats - (b.bookedSeats?.length || 0)
          return seatsB - seatsA
        })
      default:
        return sorted
    }
  }

  const filterBuses = (buses, filterType) => {
    if (filterType === "all") return buses
    return buses.filter((bus) => bus.type?.toLowerCase() === filterType.toLowerCase())
  }

  const processedBuses = sortBuses(filterBuses(buses, filterType), sortBy)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching for buses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <div className="text-red-500 mb-4">
            <Search className="w-12 h-12 mx-auto mb-2" />
            <h2 className="text-xl font-semibold">Search Error</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchBuses} className="mr-2">
            Try Again
          </Button>
          <Button variant="outline" onClick={handleBackToSearch}>
            Back to Search
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleBackToSearch}
            className="mb-4 flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Button>

          <Card className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold">{searchParams.from}</span>
                  <span className="text-gray-400">→</span>
                  <span className="font-semibold">{searchParams.to}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span>
                    {new Date(searchParams.date).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                {processedBuses.length} bus{processedBuses.length !== 1 ? "es" : ""} found
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Sort */}
        <div className="mb-6">
          <Card className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded px-3 py-1 text-sm"
                >
                  <option value="price">Price (Low to High)</option>
                  <option value="departure">Departure Time</option>
                  <option value="rating">Rating (High to Low)</option>
                  <option value="seats">Available Seats</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Filter:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border rounded px-3 py-1 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="ac">AC</option>
                  <option value="non-ac">Non-AC</option>
                  <option value="sleeper">Sleeper</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* Bus Results */}
        {processedBuses.length === 0 ? (
          <Card className="p-8 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No buses found</h3>
            <p className="text-gray-500 mb-4">
              No buses available for the selected route and date. Try searching for a different date or route.
            </p>
            <Button onClick={handleBackToSearch}>Search Again</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {processedBuses.map((bus) => (
              <BusCard key={bus._id || bus.number} bus={bus} onSelect={handleBusSelect} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResults
