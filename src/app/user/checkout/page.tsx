"use client";

import { RootState } from "@/redux/store";
import axios from "axios";
import { motion } from "framer-motion";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import {
  ArrowLeft,
  Landmark,
  Loader2,
  LocateFixed,
  LocationEdit,
  MapPin,
  Navigation,
  Phone,
  Search,
  User,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 text-sm">
      Loading map...
    </div>
  ),
});

const Checkout = () => {
  const { userData } = useSelector((state: RootState) => state.user);
  const [address, setaddress] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    pinCode: "",
    fullAddress: "",
  });
  const router = useRouter();

  const [positions, setpositions] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  //search query handler
  const searchQueryHandler = async () => {
    setSearchLoading(true);
    if (searchQuery.trim().length == 0) {
      setSearchLoading(false);
      return;
    }
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: searchQuery });
    setSuggestions(results);
    setShowSuggestions(true);
    setSearchLoading(false);
  };

  //handle click suggestion
  const handleSuggestionClick = (suggestion: any) => {
    setpositions([suggestion.y, suggestion.x]);
    setShowSuggestions(false);
    setSearchQuery("");
  };
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setpositions([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log("location error", error);
        },
        { enableHighAccuracy: true },
      );
    }
  }, []);

  useEffect(() => {
    if (userData) {
      setaddress((prev) => ({
        ...prev,
        fullName: userData.name,
        mobile: userData.mobile,
      }));
    }
  }, [userData]);

  useEffect(() => {
    const fetchAdsress = async () => {
      if (!positions) return;
      try {
        const result = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${positions[0]}&lon=${positions[1]}&format=jsonv2&`,
        );
        setaddress((prev) => ({
          ...prev,
          city: result.data.address.county || result.data.address.city,
          state: result.data.address.state || "",
          pinCode: result.data.address.postcode || "",
          fullAddress: result.data.display_name || "",
        }));
      } catch (error) {
        console.log(error);
      }
    };

    fetchAdsress();
  }, [positions]);

  return (
    <div className="max-w-5xl w-[90%] md:w-[80%] relative mx-auto flex">
      <motion.div
        initial={{ opacity: 0, x: 10, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        onClick={() => router.back()}
        className="flex items-center justify-center gap-2 text-green-600 absolute top-4 left-4 cursor-pointer"
      >
        <ArrowLeft />
        Back to Cart
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center text-green-600 text-2xl font-bold absolute top-4 left-1/2 -translate-x-1/2"
      >
        Checkout
      </motion.h1>

      <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-8 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-4 border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <MapPin />
            Delivery Address
          </h2>
          <div className="space-y-3">
            <div className="flex w-full border border-gray-200 focus:border-green-500 px-2 py-1 rounded-md gap-2 items-center">
              <User className="h-4 w-4 text-green-600" />
              <input
                type="text"
                value={address.fullName}
                onChange={(e) =>
                  setaddress((prev) => ({ ...prev, fullName: e.target.value }))
                }
                placeholder="Full Name"
                className="outline-none w-full text-sm"
              />
            </div>
            <div className="flex w-full border border-gray-200 focus:border-green-500 px-2 py-1 rounded-md gap-2 items-center">
              <Phone className="h-4 w-4 text-green-600" />
              <input
                type="text"
                value={address.mobile}
                onChange={(e) =>
                  setaddress((prev) => ({ ...prev, mobile: e.target.value }))
                }
                placeholder="Mobile Number"
                className="outline-none w-full text-sm"
              />
            </div>
            <div className="flex w-full border border-gray-200 focus:border-green-500 px-2 py-1 rounded-md gap-2 items-center">
              <Landmark className="h-4 w-4 text-green-600" />
              <input
                type="text"
                value={address.fullAddress}
                onChange={(e) =>
                  setaddress((prev) => ({
                    ...prev,
                    fullAddress: e.target.value,
                  }))
                }
                placeholder="Full Address"
                className="outline-none w-full text-sm"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex border border-gray-200 focus:border-green-500 px-2 py-1 rounded-md gap-2 items-center">
                <MapPin className="h-4 w-4 text-green-600" />
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) =>
                    setaddress((prev) => ({ ...prev, city: e.target.value }))
                  }
                  placeholder="City"
                  className="outline-none w-full text-sm"
                />
              </div>
              <div className="flex border border-gray-200 focus:border-green-500 px-2 py-1 rounded-md gap-2 items-center">
                <Navigation className="h-4 w-4 text-green-600" />
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) =>
                    setaddress((prev) => ({ ...prev, state: e.target.value }))
                  }
                  placeholder="State"
                  className="outline-none w-full text-sm"
                />
              </div>
              <div className="flex border border-gray-200 focus:border-green-500 px-2 py-1 rounded-md gap-2 items-center">
                <LocationEdit className="h-4 w-4 text-green-600" />
                <input
                  type="text"
                  value={address.pinCode}
                  onChange={(e) =>
                    setaddress((prev) => ({ ...prev, pinCode: e.target.value }))
                  }
                  placeholder="Pincode"
                  className="outline-none w-full text-sm"
                />
              </div>
            </div>
            <div>
              <div className="flex border border-gray-200 focus:border-green-500 px-2 py-1 rounded-md gap-2 items-center">
                <Search className="h-4 w-4 text-green-600" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city or area"
                  className="outline-none w-full text-sm"
                />
                <button
                  onClick={searchQueryHandler}
                  className="px-2 py-1 rounded-md bg-green-600 text-white"
                >
                  {searchLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </button>
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <div>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        handleSuggestionClick(suggestion);
                        setSearchQuery(suggestion.label);

                      }}
                      className="p-2 border-b border-gray-200 hover:bg-green-100 cursor-pointer"
                    >
                      <p>{suggestion.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ✅ Only render map once we have GPS coordinates */}
            <div className="relative h-72 w-full shadow-lg shadow-gray-200 border border-gray-50 rounded-lg">
              {positions ? (
                <LeafletMap
                  positions={positions}
                  onPositionChange={(lat, lng) => setpositions([lat, lng])}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 text-sm">
                  Fetching your location...
                </div>
              )}
              {/* go to current loaction button */}
              <motion.button
               whileHover={{scale:1.1}}
               whileTap={{scale:0.9}}
                onClick={() =>
                  navigator.geolocation.getCurrentPosition((position) =>{
                    setpositions([
                      position.coords.latitude,
                      position.coords.longitude,
                    ]);
                    setSearchQuery('')
                  }
                  )
                }
                className="p-2 rounded-full bg-green-600 text-white absolute top-4 right-4 z-10"
              >
                <LocateFixed className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
