"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { io } from "socket.io-client";

const PageClient = () => {
  const router = useRouter();
  useEffect(() => {
    console.log("PAGE CLIENT");

    const socket = io(process.env.NEXT_PUBLIC_IVMS_URL_SOCKET || "");
    socket.on("outputOrderUpdated", () => {
      console.log("ON EMIT OUTPUT ORDER UPDATE");
      router.refresh();
    });
    return () => {
      socket.off("outputOrderUpdated");
    };
  }, [router]);
  return null;
};

export default PageClient;
