"use client";

const useCurrency = () => {
  const formatCurrency = (number: number): string => {
    // Format the number to IDR currency
    const formattedNumber = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);

    // Remove the last ",00" if it exists
    return formattedNumber.replace(/,00$/, "");
  };

  function numberToText(value: number) {
    const units = [
      "",
      "satu",
      "dua",
      "tiga",
      "empat",
      "lima",
      "enam",
      "tujuh",
      "delapan",
      "sembilan"
    ];
    const teens = [
      "",
      "sebelas",
      "dua belas",
      "tiga belas",
      "empat belas",
      "lima belas",
      "enam belas",
      "tujuh belas",
      "delapan belas",
      "sembilan belas"
    ];
    const tens = [
      "",
      "sepuluh",
      "dua puluh",
      "tiga puluh",
      "empat puluh",
      "lima puluh",
      "enam puluh",
      "tujuh puluh",
      "delapan puluh",
      "sembilan puluh"
    ];

    const numToString = (num: number) => {
      if (num === 0) return "";
      if (num < 10) return units[num];
      if (num < 20) return teens[num - 10];
      const digit = num % 10;
      const ten = Math.floor(num / 10);
      if (digit === 0) return tens[ten];
      return `${tens[ten]} ${units[digit]}`;
    };

    const numToTextHelper = (num: number) => {
      if (num === 0) return "";
      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      let text = "";
      if (hundred > 0) {
        text += `${units[hundred]} ratus `;
      }
      if (remainder > 0) {
        text += numToString(remainder);
      }
      return text;
    };

    const billion = Math.floor(value / 1000000000);
    const million = Math.floor((value % 1000000000) / 1000000);
    const thousand = Math.floor((value % 1000000) / 1000);
    const hundred = value % 1000;

    let result = "";
    if (billion > 0) {
      result += `${numToTextHelper(billion)} miliar `;
    }
    if (million > 0) {
      result += `${numToTextHelper(million)} juta `;
    }
    if (thousand > 0) {
      result += `${numToTextHelper(thousand)} ribu `;
    }
    if (hundred > 0) {
      result += numToTextHelper(hundred);
    }

    return result.trim() || "nol";
  }

  return { formatCurrency, numberToText };
};

export { useCurrency };
