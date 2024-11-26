import { useMemo } from "react";

const useDayTranslate = () => {
  const dayTranslations = useMemo(
    () => ({
      Monday: "Senin",
      Tuesday: "Selasa",
      Wednesday: "Rabu",
      Thursday: "Kamis",
      Friday: "Jumat",
      Saturday: "Sabtu",
      Sunday: "Minggu"
    }),
    []
  );

  const translateDay = (day: keyof typeof dayTranslations): string => {
    return dayTranslations[day] || day;
  };

  return { translateDay };
};

export default useDayTranslate;
