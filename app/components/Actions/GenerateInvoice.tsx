import React from "react";
import FileDownload from "@mui/icons-material/FileDownload";
import { CircularProgress, ListItemIcon, MenuItem } from "@mui/material";
import { useMutation } from "react-query";
import axios from "axios";
import { RequestGenerateInvoice } from "@/types/types";
import { trpc } from "@/utils/trpc-client";
import { shortenAlert } from "@/components/Alert/alert";

type Props = {
  orderId: string;
  closeHandler: () => void;
};

export type DocumentCreatedResponse = { downloadedURL: string };

const GenerateInvoice = ({ closeHandler, orderId }: Props) => {
  const downloadedURLAnchorTag = React.useRef<HTMLAnchorElement | null>(null);

  const {
    data: invoiceData,
    isLoading: isLoadDocument,
    isError: isErrorGetData
  } = trpc.getInvoiceData.useQuery(orderId);

  const {
    mutateAsync,
    isLoading,
    isError,
    data: response
  } = useMutation({
    mutationKey: ["generate-invoice"],
    mutationFn: async (type: "invoice" | "shippingLetter") => {
      try {
        if (invoiceData) {
          const url = process.env.NEXT_PUBLIC_INVOICE_GENERATOR_URL;
          const requestUrl = `${url}invoice?dType=${type}`;
          const response = await axios.post(
            requestUrl,
            invoiceData as RequestGenerateInvoice
          );
          const data = response.data as DocumentCreatedResponse;

          if (!!downloadedURLAnchorTag && downloadedURLAnchorTag.current) {
            downloadedURLAnchorTag.current.href = data.downloadedURL;
            downloadedURLAnchorTag.current.click();
          }

          // ("🚀 ~ mutationFn: ~ data:", data);
        }

        throw new Error(
          "No document found during generating, you can try again later"
        );
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    },
    onError: (err) => {
      if (err instanceof Error) {
        console.error(err.message);

        shortenAlert(
          "error",
          "Error during generate invoice, try again later.."
        );
      }
    }
  });

  const handleClick = async () => {
    await mutateAsync("invoice");

    closeHandler();
  };

  return (
    <MenuItem onClick={handleClick}>
      <ListItemIcon>
        {isLoadDocument ? (
          <CircularProgress
            color="info"
            size={16}
          />
        ) : (
          <FileDownload />
        )}
      </ListItemIcon>
      Invoice
      <a
        target="_blank"
        ref={downloadedURLAnchorTag}
        style={{ position: "absolute", opacity: 0 }}
      />
    </MenuItem>
  );
};

export default GenerateInvoice;
