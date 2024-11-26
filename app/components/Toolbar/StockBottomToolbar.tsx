import CreateProduct from "@/components/Actions/CreateProduct";
import CreateLocations from "@/components/Actions/CreateLocations";

const StockBottomToolbar = () => {
  return (
    <div className="mb-2 w-full grid place-content-end">
      <div className="flex gap-1 w-fit">
        <CreateLocations />
        <CreateProduct />
      </div>
    </div>
  );
};

export default StockBottomToolbar;
