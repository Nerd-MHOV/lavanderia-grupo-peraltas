'use client'
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export interface FaceReader {
    id: string,
    datetime: string,
    date: string,
    time: string,
    success: string,
    device_id: string,
    device_name: string,
    name: string,
    g_person: string,
    direction: string,
}
const useFaceReader = (dependences: React.DependencyList = []) => {
    const [resultReader, setResultReader] = useState<FaceReader | null>(null);
    const onFind = (data: FaceReader) => {
        console.log()
        if (data.device_name === "Lavanderia - leitor de faces")
            setResultReader(data); console.log(data.name, 'LEITOR DE FACES')
    }
    const clear = () => { setResultReader(null) }
    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_IVMS_URL_SOCKET || '')
        socket.on('ivms', onFind);
        return () => {
            socket.off('ivms', onFind);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependences);


    return { resultReader, clear };
}

export default useFaceReader