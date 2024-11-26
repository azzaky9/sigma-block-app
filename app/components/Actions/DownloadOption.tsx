import { MRT_Row } from "material-react-table";
import PopupState from "material-ui-popup-state";

import { OrderTableData } from "@/types/types";
import FileDownload from "@mui/icons-material/FileDownload";
import LocalPrintshop from "@mui/icons-material/LocalPrintshop";
import { bindMenu, bindTrigger } from "material-ui-popup-state/hooks";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";

import GenerateInvoice from "./GenerateInvoice";

type DownloadOptionProps = {
  clickRowData: MRT_Row<OrderTableData>;
  onLetterButtonClick: () => void;
};

const DownloadOption = ({
  clickRowData,
  onLetterButtonClick
}: DownloadOptionProps) => {
  return (
    <PopupState
      variant="popover"
      popupId="demo-popup-menu"
    >
      {(popupState) => (
        <>
          <IconButton
            {...bindTrigger(popupState)}
            color="default"
          >
            <LocalPrintshop color="info" />
          </IconButton>
          <Menu {...bindMenu(popupState)}>
            <GenerateInvoice
              closeHandler={popupState.close}
              orderId={clickRowData.original.id}
            />
            <MenuItem onClick={onLetterButtonClick}>
              <ListItemIcon>
                <FileDownload />
              </ListItemIcon>
              Surat Jalan
            </MenuItem>
          </Menu>
        </>
      )}
    </PopupState>
  );
};

export default DownloadOption;
