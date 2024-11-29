import CreateProduct from "@/components/Actions/CreateProduct";
import CreateLocations from "@/components/Actions/CreateLocations";

export default function StockTableAction() {
  return (
    <div className="my-4 w-full grid place-content-end">
      <div className="flex gap-1 w-fit">
        <CreateLocations />
        <CreateProduct />
      </div>
    </div>
  );
}
