import dbConnect from "@/lib/db";
import CategorySlider from "./CategorySlider";
import HeroSection from "./HeroSection";
import PopularProducts from "./PopularProducts";
import Grocery from "@/models/grocery.model";

const UserDashboard = async () => {
  await dbConnect();
  const groceryItems = await Grocery.find({}).limit(10);
  return (
    <>
      <HeroSection />
      <CategorySlider />
      <PopularProducts groceryItems={JSON.parse(JSON.stringify(groceryItems))} />
    </>
  );
};

export default UserDashboard;
