"use client"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { Clock, MapPin, Users, Star, Wifi, Zap, Droplets, Shield } from "lucide-react"

const BusCard = ({ bus, onSelect }) => {
  const formatTime = (time) => {
    if (!time) return "N/A"
    return time
  }

  const formatDate = (date) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  const getAmenityIcon = (amenity) => {
    switch (amenity?.toLowerCase()) {
      case "wifi":
        return <Wifi className="w-4 h-4" />
      case "charging point":
        return <Zap className="w-4 h-4" />
      case "water bottle":
        return <Droplets className="w-4 h-4" />
      case "ac":
        return <Shield className="w-4 h-4" />
      default:
        return <Shield className="w-4 h-4" />
    }
  }

  const getBusTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "ac":
        return "bg-blue-100 text-blue-800"
      case "sleeper":
        return "bg-purple-100 text-purple-800"
      case "non-ac":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const availableSeats = bus.totalSeats - (bus.bookedSeats?.length || 0)

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Bus Info Section */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-xl font-bold text-gray-900">{bus.name || "Bus Service"}</h3>
            <span className="text-sm text-gray-500">({bus.number || "N/A"})</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBusTypeColor(bus.type)}`}>
              {bus.type || "Standard"}
            </span>
          </div>

          {/* Route Info */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-900">{bus.from}</span>
              <span className="text-gray-400">→</span>
              <span className="font-medium text-gray-900">{bus.to}</span>
            </div>
          </div>

          {/* Time Info */}
          <div className="flex items-center gap-6 mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Departure:</span>
              <span className="font-medium">{formatTime(bus.departureTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Arrival:</span>
              <span className="font-medium">{formatTime(bus.arrivalTime)}</span>
            </div>
          </div>

          {/* Date and Seats */}
          <div className="flex items-center gap-6 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Date:</span>
              <span className="font-medium">{formatDate(bus.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{availableSeats} seats available</span>
            </div>
          </div>

          {/* Amenities */}
          {bus.amenities && bus.amenities.length > 0 && (
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm text-gray-600">Amenities:</span>
              <div className="flex gap-2">
                {bus.amenities.slice(0, 4).map((amenity, index) => (
                  <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                    {getAmenityIcon(amenity)}
                    <span className="text-xs text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rating */}
          {bus.rating && (
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium">{bus.rating}</span>
              <span className="text-sm text-gray-500">rating</span>
            </div>
          )}
        </div>

        {/* Price and Action Section */}
        <div className="flex flex-col items-end gap-3 lg:min-w-[200px]">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">₹{bus.fare}</div>
            <div className="text-sm text-gray-500">per person</div>
          </div>

          <Button
            onClick={() => onSelect(bus)}
            className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            disabled={availableSeats === 0}
          >
            {availableSeats === 0 ? "Sold Out" : "Select Seats"}
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default BusCard
