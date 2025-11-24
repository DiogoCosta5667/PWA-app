import { io } from "socket.io-client";
import { useEffect, useRef } from "react";

const socket = io();
let listenerConfiguredRef = { current: false };

export const initSocket = () => {
    console.log("Inicializando socket...");

    if(socket.connected) {
        console.log("Estou conectado");
    } else {
        console.log("Tentando conectar...");
    }

    socket.on('connect', () => {
        console.log("Conectado ao servidor:", socket.id);
    });

    socket.on('disconnect', () => {
        console.log("Desconectado do servidor");
    });

    return socket;
};

export const socketAddListener = (listener = "", callback = () => {}) => {
    socket.on(listener, callback);
}

export const socketRemoveListener = (listener = "", callback = () => {}) => {
    socket.off(listener, callback);
}

// Hook useEffect para configurar o socket
export const useSocketEffect = (newNotification) => {
    useEffect(() => {
        initSocket();
        if (!listenerConfiguredRef.current) {
            console.log("Configurando ouvinte pela primeira vez");

            const handleNotification = (data) => {
                newNotification(data);
            };

            socketAddListener("admin_notifications", handleNotification);

            listenerConfiguredRef.current = true;
        } else {
            console.log("Ouvinte já configurado. Ignorando....");
        }

        return (handleNotification) => {
            socketRemoveListener("admin_notifications", handleNotification);
        };
    }, []);
};