"use client";
import { ArrowRight, Bike, UserCog, UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const roles = [
  {
    id:"admin",
    name: "Admin",
    icon: <UserCog size={28} />,
  },
  {
    id:"user",
    name: "User",
    icon: <UserIcon size={28} />,
  },
  {
    id:"deliveryBoy",
    name: "Delivery Boy",
    icon: <Bike size={28} />,
  },
];

const EditMobileRole = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [mobile, setMobile] = useState("");
  const router = useRouter();
  const handleSubmit =async () => {
 try {
  
    const response = await axios.post("/api/user/edit-role-mobile", {
      role:selectedRole,
      mobile:mobile
    });
    if(response.data.success){
      router.push("/")
    }
   
    
 } catch (error) {
  console.error("Error updating user role and mobile:", error);
  
 }
  };

  const isValid = selectedRole && mobile.length === 10;

  return (
    <div className="min-h-screen bg-[#f4faf4] flex flex-col items-center justify-center px-4 py-10 gap-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-600 mb-2 text-center"
      >
        Select Your Role
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-[360px] sm:max-w-md md:max-w-lg mb-4"
      >
        {roles.map((role, index) => {
          const isSelected = selectedRole === role.id;
          return (
            <motion.div
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                aspect-square w-full bg-white border rounded-3xl 
                flex flex-col items-center justify-center cursor-pointer 
                transition-all duration-300 shadow-sm
                ${
                  isSelected
                    ? "border-green-500 bg-green-50/50 shadow-md shadow-green-100/50"
                    : "border-gray-200 hover:border-green-300 hover:shadow hover:scale-105"
                }
              `}
            >
              <motion.div
                animate={
                  isSelected
                    ? {
                        scale: [1, 1.2, 1],
                      }
                    : {}
                }
                transition={{ duration: 0.4 }}
                className={isSelected ? "text-green-600" : "text-gray-800"}
              >
                {role.icon}
              </motion.div>

              <p
                className={`mt-2 text-xs sm:text-base font-semibold text-center transition-colors duration-300 ${
                  isSelected ? "text-green-700" : "text-gray-600"
                }`}
              >
                {role.name}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col items-center gap-4 w-full max-w-[450px]"
      >
        <motion.label
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-xl sm:text-2xl font-semibold text-gray-700 text-center"
          htmlFor="mobile"
        >
          Enter Your Mobile No.
        </motion.label>

        <motion.input
          id="mobile"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          value={mobile}
          onChange={(e) =>
            setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
          }
          type="text"
          placeholder="eg. 0000000000"
          className="w-full py-3 px-5 text-lg sm:text-xl bg-white border border-gray-200 rounded-2xl outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all text-center placeholder:text-gray-300"
        />

        {/* Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4}}
          whileHover={{ scale: isValid ? 1.05 : 1 }}
          whileTap={{ scale: isValid ? 0.95 : 1 }}
          disabled={!isValid}
          onClick={handleSubmit}
          className={`
            mt-6 flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 rounded-2xl 
            text-lg sm:text-xl font-medium shadow-md transition-all duration-300
            ${
              isValid
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-green-100 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          Go to Home
          <ArrowRight size={22} />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default EditMobileRole;

