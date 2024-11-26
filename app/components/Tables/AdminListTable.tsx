"use client";

import * as React from "react";
import {
  type MRT_ColumnDef,
  useMaterialReactTable,
  MaterialReactTable,
  MRT_TableOptions
} from "material-react-table";
import moment from "moment";

import { trpc } from "../../../client/trpc-client";
import { User } from "@prisma/client";
import {
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem
} from "@mui/material";
import DeleteForever from "@mui/icons-material/DeleteForever";
import Edit from "@mui/icons-material/Edit";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { enqueueSnackbar } from "notistack";
import { darken, lighten, useTheme } from "@mui/material/styles";
import RoundedButton from "@/app/@common/RoundedButton";

const AdminListTable = () => {
  const theme = useTheme();

  //light or dark green
  const baseBackgroundColor =
    theme.palette.mode === "dark" ? "rgb(26, 26, 46)" : "rgba(255,255,255, 1)";

  const utils = trpc.useUtils();
  const { data, isLoading, isRefetching } = trpc.getAllAdmin.useQuery();
  const updateAccountMutation = trpc.updateUser.useMutation({
    onSuccess: () => utils.invalidate()
  });
  const deleteAccountMutation = trpc.deleteSelection.useMutation({
    onSuccess: () => utils.invalidate()
  });

  const [validationErrors, setValidationErrors] = React.useState<
    Record<string, string | undefined>
  >({});
  const [isPasswordHidden, setPasswordHidden] = React.useState(true);
  const toggleHiddenPassword = (closeFn: () => void) => {
    setPasswordHidden(!isPasswordHidden);

    closeFn();
  };
  const columns: MRT_ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "ID",
      maxSize: 30,
      enableColumnActions: false,
      enableEditing: false
    },
    {
      accessorKey: "username",
      header: "Username",
      enableColumnActions: false
    },
    {
      accessorKey: "email",
      header: "Email",
      enableColumnActions: false,
      muiEditTextFieldProps: {
        disabled: true
      }
    },
    {
      accessorKey: "origin_password",
      header: "Password",
      Cell: ({ cell }) => {
        return (
          <input
            disabled
            className="border-none text-md bg-transparent"
            type={isPasswordHidden ? "password" : "text"}
            value={cell.getValue() as string}
            placeholder=""
          />
        );
      },
      renderColumnActionsMenuItems: ({
        internalColumnMenuItems,
        closeMenu
      }) => {
        return [
          ...internalColumnMenuItems,
          <Divider key="separate-actions" />,
          <MenuItem
            onClick={() => toggleHiddenPassword(closeMenu)}
            key="show-password"
          >
            <ListItemIcon>
              {isPasswordHidden ? <Visibility /> : <VisibilityOff />}
            </ListItemIcon>
            <ListItemText>
              {isPasswordHidden ? "Show Password" : "Hide Password"}
            </ListItemText>
          </MenuItem>
        ];
      }
    },
    {
      accessorKey: "role",
      header: "Role",
      editSelectOptions: [
        { value: "admin", label: "Admin" },
        { value: "user", label: "User" }
      ],
      muiEditTextFieldProps: {
        select: true,
        error: !!validationErrors?.state,
        helperText: validationErrors?.state
      }
    },
    {
      accessorKey: "last_seen",
      header: "Last Login",
      enableEditing: false,
      Cell: (table) => (
        <span>
          {moment(table.row.original.last_seen).isValid()
            ? moment(table.row.original.last_seen).format("DDD MM YYYY HH:mm a")
            : "This User not have record."}
        </span>
      )
    }
  ];

  const handleSaveEdit: MRT_TableOptions<User>["onEditingRowSave"] = ({
    values,
    exitEditingMode
  }) => {
    updateAccountMutation.mutate(values);

    exitEditingMode();
  };

  const adminData = React.useMemo(() => {
    const result = data || [];

    return result;
  }, [data]);

  const table = useMaterialReactTable({
    columns,
    data: adminData,
    enableRowSelection: true,
    enableRowVirtualization: true,
    enablePagination: false,
    enableHiding: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnFilters: false,
    enableRowActions: true,
    positionActionsColumn: "last",
    onEditingRowSave: handleSaveEdit,
    renderRowActions: ({ row, table }) => {
      return (
        <IconButton
          color="default"
          onClick={() => {
            table.setEditingRow(row);
          }}
        >
          <Edit sx={{ color: theme.palette.common.black }} />
        </IconButton>
      );
    },
    positionToolbarAlertBanner: "bottom",
    renderTopToolbarCustomActions: ({ table }) => {
      const selectedList = table.getSelectedRowModel();

      const doDelete = () => {
        if (selectedList.rows.length === 0) {
          enqueueSnackbar({
            variant: "warning",
            message: "Must be select account to delete",
            anchorOrigin: {
              horizontal: "right",
              vertical: "bottom"
            }
          });
        }

        deleteAccountMutation.mutate(
          selectedList.rows.map((row) => row.original.id)
        );

        table.resetRowSelection();
      };

      return (
        <RoundedButton
          color="error"
          disabled={!table.getIsSomeRowsSelected()}
          endIcon={<DeleteForever />}
          onClick={() => {
            const isConfirm = confirm(
              "Are you sure to delete selected account?"
            );

            if (isConfirm) {
              doDelete();
            }
          }}
          variant="contained"
        >
          Delete
        </RoundedButton>
      );
    },
    state: {
      isLoading: isLoading || isRefetching,
      showSkeletons: isLoading || isRefetching,
      density: "compact"
    },
    initialState: {
      showGlobalFilter: true
    },
    muiPaginationProps: {
      rowsPerPageOptions: [8, 10, 15],
      variant: "outlined"
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "0"
      }
    },
    muiTableBodyProps: {
      sx: (theme) => ({
        '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]) > td':
          {
            backgroundColor: darken(baseBackgroundColor, 0.1)
          },
        '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
          {
            backgroundColor: darken(baseBackgroundColor, 0.2)
          },
        '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]) > td':
          {
            backgroundColor: lighten(baseBackgroundColor, 0.1)
          },
        '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
          {
            backgroundColor: darken(baseBackgroundColor, 0.2)
          }
      })
    },

    mrtTheme: (theme) => ({
      baseBackgroundColor: baseBackgroundColor,
      draggingBorderColor: theme.palette.secondary.main
    }),

    muiTableContainerProps: {
      sx: { height: "500px", maxHeight: "620px" }
    }
  });

  return <MaterialReactTable table={table} />;
};

export default AdminListTable;
