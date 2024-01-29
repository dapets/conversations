"use client";

import {
  AbortError,
  HubConnection,
  HubConnectionBuilder,
} from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { Message } from "./Message";
import { HistoryEntity } from "utils/types/dbEntities";

export function RealtimeHistory({
  loggedInUserId,
}: {
  loggedInUserId: number;
}) {
  const [realtimeHistory, setRealtimeHistory] = useState<HistoryEntity[]>([]);
  // const [lastMessage, setlastMessage] = useState<string>("");

  useEffect(() => {
    let localConn = new HubConnectionBuilder()
      .withUrl("http://localhost:3001" + "/chatHub")
      .withAutomaticReconnect()
      .build();

    localConn
      .start()
      .catch((reason) => {
        //this happens in dev mode because effects are executed twice
        if (reason instanceof AbortError) {
          console.info(
            "Connection was aborted while still trying to connect to the server."
          );
        } else {
          console.error(reason);
        }
      })
      .then(() =>
        localConn.on("ReceiveMessage", (information) => {
          console.log(information);
          setRealtimeHistory((history) => [
            ...history,
            {
              author: {
                firstName: "Sophie",
                lastName: "Mertz",
                id: 177,
              },
              id: Math.random(),
              message: information,
              sentOn: new Date(),
            },
          ]);
        })
      );
    return () => {
      localConn.stop();
    };
  }, [setRealtimeHistory]);

  return (
    <>
      {realtimeHistory.map((h) => h.message)}
      {/* {realtimeHistory.map((h) => (
        <Message history={h} key={h.id} loggedInUserId={loggedInUserId} />
      ))} */}
    </>
  );
}
