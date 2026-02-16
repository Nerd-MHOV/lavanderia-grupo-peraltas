'use client'
import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";

export interface RfidTag {
    epc: string;
    antenna: number;
    pc: string;
    rssi: number;
    frequency: number;
    timestamp: number;
}

const useRfidReader = (dependences: React.DependencyList = []) => {
    const [tags, setTags] = useState<RfidTag[]>([]);
    const [lastTag, setLastTag] = useState<RfidTag | null>(null);
    const [isReading, setIsReading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const clear = useCallback(() => {
        setTags([]);
        setLastTag(null);
    }, []);

    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_RFID_URL_SOCKET || '');

        socket.on('rfid', (tag: RfidTag) => {
            setLastTag(tag);
            setTags((prev) => {
                const exists = prev.some((t) => t.epc === tag.epc);
                if (exists) return prev;
                return [...prev, tag];
            });
        });

        socket.on('rfid:connected', () => {
            setIsConnected(true);
        });

        socket.on('rfid:disconnected', () => {
            setIsConnected(false);
            setIsReading(false);
        });

        socket.on('status', (status: { connected: boolean; reading: boolean }) => {
            setIsConnected(status.connected);
            setIsReading(status.reading);
        });

        socket.on('rfid:inventoryEnd', () => {
            setIsReading(false);
        });

        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        return () => {
            socket.off('rfid');
            socket.off('rfid:connected');
            socket.off('rfid:disconnected');
            socket.off('rfid:inventoryEnd');
            socket.off('status');
            socket.off('connect');
            socket.off('disconnect');
            socket.disconnect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependences);

    return { tags, lastTag, isReading, isConnected, clear };
}

export default useRfidReader;
