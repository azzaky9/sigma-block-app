"use client";

import * as React from "react";
import {
  Avatar,
  Skeleton,
  ListItemText,
  Stack,
  IconButton
} from "@mui/material";
import { getSession, useSession } from "next-auth/react";
import { grey } from "@mui/material/colors";
import ModeEdit from "@mui/icons-material/ModeEdit";
import { useBoolean } from "usehooks-ts";
import UpdateProfileForm from "../../@components/Forms/UpdateProfileForm";
import { useQuery } from "react-query";

const PrimaryProfile = () => {
  const session = useSession();

  const { refetch, data, isLoading, isError } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await getSession();

      return res;
    }
  });

  const initialName = session.data?.user.name
    ? session.data.user.name.at(0)?.toUpperCase()
    : "A";
  const name = session.data?.user.name
    ? session.data.user.name
    : "Unauthorized";
  const mail = session.data?.user.email ? session.data.user.email : "";

  const {
    value: isEditMode,
    toggle,
    setFalse: closeEditor,
    setTrue: openEditor
  } = useBoolean();

  // const handleUpdateSession = () => {
  //   session.update(async () => {
  //     return {

  //     }
  //   })
  // }

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1.2}
      >
        <Stack
          direction="row"
          gap={1.2}
          justifyContent="center"
          alignItems="center"
        >
          {isEditMode ? (
            <UpdateProfileForm
              refetchProfile={refetch}
              closeEditor={closeEditor}
              session={session}
              initialValues={{
                username: name,
                email: mail
              }}
            />
          ) : (
            <Profile
              initialName={initialName || ""}
              name={name}
              mail={mail}
              sessionStatus={session.status}
            />
          )}
        </Stack>
        {!isEditMode && (
          <IconButton onClick={openEditor}>
            <ModeEdit />
          </IconButton>
        )}
      </Stack>
    </>
  );
};

type Props = {
  initialName: string;
  name: string;
  mail: string;
  sessionStatus: "authenticated" | "loading" | "unauthenticated";
};

const Profile = (props: Props) => {
  const { initialName, name, mail, sessionStatus } = props;

  return (
    <>
      <Avatar sx={{ bgcolor: grey["500"] }}>{initialName}</Avatar>
      <ListItemText
        primary={
          sessionStatus === "loading" ? (
            <Skeleton
              variant="text"
              sx={{ fontSize: "1rem", width: "80px" }}
            />
          ) : (
            name
          )
        }
        secondary={
          sessionStatus === "loading" ? (
            <Skeleton
              variant="text"
              sx={{ fontSize: "1rem", width: "89px" }}
            />
          ) : (
            mail
          )
        }
      />
    </>
  );
};

export default PrimaryProfile;
