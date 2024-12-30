import React from "react";
import { io } from "socket.io-client";

const page = () => {
  const socket = io(process.env.NEXT_PUBLIC_IVMS_URL_SOCKET || "");
  socket.emit("outputOrderUpdated", "updated");
  console.log();
  return <div>page</div>;
};

export default page;
