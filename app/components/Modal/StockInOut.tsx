import FilterDate from "@/components/Date/FilterDate";
import BaseModalChildren from "@/components/Modal/BaseModalChildren";
import { useSearchParams } from "@remix-run/react";

interface StockInOutProps {
  setTrue: () => void;
  setFalse: () => void;
  isViewMonitoring: boolean;
}

export default function StockInOut({
  isViewMonitoring,
  setFalse,
  setTrue
}: StockInOutProps) {
  const [, setSearchParams] = useSearchParams();

  const handleClose = () => {
    setSearchParams(
      (prev) => {
        prev.delete("from");
        prev.delete("to");
        return prev;
      },
      { preventScrollReset: true }
    );

    setFalse();
  };

  return (
    <BaseModalChildren
      title="Monitoring"
      isOpen={isViewMonitoring}
      onClose={handleClose}
      onOpen={setTrue}
    >
      <div className="max-w-[550px] w-screen h-[430px] py-4">
        <FilterDate />
      </div>
    </BaseModalChildren>
  );
}
