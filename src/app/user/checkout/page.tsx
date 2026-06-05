"use client";

import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";

import {
  ArrowLeft,
  Landmark,
  LocationEdit,
  MapPin,
  Navigation,
  Phone,
  Pin,
  Search,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

    const iconMarker = new L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/2776/2776067.png",
    iconSize: [35, 35],
    iconAnchor: [18, 35],
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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setpositions([position.coords.latitude, position.coords.longitude]);
      }, (error) => {
        console.log("location error",error);
      },{
        enableHighAccuracy:true
      }
    )
    }
  }, []);

  console.log("positions", positions);

  useEffect(() => {
    if (userData) {
      setaddress((prev) => ({
        ...prev,
        fullName: userData.name,
        mobile: userData.mobile,
      }));
    }
  }, [userData]);

  return (
    <div className=" max-w-5xl w-[90%] md:w-[80%] relative mx-auto flex">
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

      {/* map and form  */}

      <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-8 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-6 border-gray-100"
        >
          {/*delivey address  */}
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <MapPin />
            Delivery Address
          </h2>
          <div className="space-y-4">
            <div className="flex w-full border border-gray-200 focus:border-green-500 px-2 py-1 rounded-md gap-2 items-center ">
              <User className="h-4 w-4 text-green-600" />
              <input
                type="text"
                value={address.fullName}
                onChange={(e) =>
                  setaddress((prev) => ({ ...prev, fullName: e.target.value }))
                }
                placeholder="Full Name"
                className="outline-none w-full"
              />
            </div>
            <div className="flex w-full border border-gray-200 focus:border-green-500 px-2 py-1 rounded-md gap-2 items-center ">
              <Phone className="h-4 w-4 text-green-600" />
              <input
                type="text"
                value={address.mobile}
                onChange={(e) =>
                  setaddress((prev) => ({ ...prev, mobile: e.target.value }))
                }
                placeholder="Mobile Number"
                className="outline-none w-full"
              />
            </div>
            <div className="flex w-full border border-gray-200 focus:border-green-500 px-2 py-1 rounded-md gap-2 items-center ">
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
                className="outline-none w-full"
              />
            </div>
            {/* city,state,pincode in one row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex border border-gray-200 focus:border-green-500 px-2 py-1 rounded-md gap-2 items-center ">
                <MapPin className="h-4 w-4 text-green-600" />
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) =>
                    setaddress((prev) => ({ ...prev, city: e.target.value }))
                  }
                  placeholder="City"
                  className="outline-none w-full"
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
                  className="outline-none w-full"
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
                  className="outline-none w-full"
                />
              </div>
            </div>
            {/* input for custopm search */}
            <div>
              <div className="flex  border border-gray-200 focus:border-green-500 px-2 py-1 rounded-md gap-2 items-center ">
                <Search className="h-4 w-4 text-green-600" />
                <input
                  type="text"
                  placeholder="search city or area"
                  className="outline-none w-full"
                />
                <button className="px-2 py-1 rounded-md bg-green-600 text-white">
                  Search
                </button>
              </div>
            </div>
            <div className="h-84 w-full shadow-lg shadow-gray-200 border border-gray-50 rounded-lg">
               <MapContainer
      center={positions as LatLngExpression}
      zoom={13}
      scrollWheelZoom={true}
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "12px",
        zIndex: 0,
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
       position={positions as LatLngExpression} 
       icon={iconMarker} 
       draggable={true}
       eventHandlers={{
        dragend: (e:L.LeafletEvent) => {
          const marker = e.target as L.Marker;
          const { lat,lng} = marker.getLatLng();
          setpositions([lat,lng]);
        },
       }}
       />
    </MapContainer>
              
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
