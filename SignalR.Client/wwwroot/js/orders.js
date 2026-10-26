"use strict";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7001/orderHub")
    .withAutomaticReconnect()
    .build();

const updateButton = document.getElementById("updateButton");
const status = document.getElementById("status");
const ordersList = document.getElementById("ordersList");

const labels = {
    Pendiente: "Pendiente",
    EnPreparacion: "En preparación",
    Enviado: "Enviado",
    Entregado: "Entregado"
};

connection.on("OrderStatusChanged", (notification) => {
    const hora = new Date(notification.changedAt).toLocaleTimeString();
    const item = document.createElement("li");
    item.textContent =
        `[${hora}] Pedido ${notification.orderId}: ${labels[notification.status] ?? notification.status}`;
    ordersList.appendChild(item);
});

connection.onreconnecting(() => {
    status.textContent = "Reconectando...";
    updateButton.disabled = true;
});

connection.onreconnected(() => {
    status.textContent = "Conectado";
    updateButton.disabled = false;
});

connection.onclose(() => {
    status.textContent = "Desconectado";
    updateButton.disabled = true;
});

async function startConnection() {
    try {
        await connection.start();
        status.textContent = "Conectado";
        updateButton.disabled = false;
    } catch (error) {
        status.textContent = "Error de conexión";
        console.error(error);
    }
}

updateButton.addEventListener("click", async () => {
    const orderId = document.getElementById("orderInput").value.trim();
    const newStatus = document.getElementById("statusSelect").value;

    if (!orderId) {
        alert("Escribe el número de pedido.");
        return;
    }

    if (connection.state !== signalR.HubConnectionState.Connected) {
        alert("No existe una conexión activa.");
        return;
    }

    try {
        await connection.invoke("UpdateOrderStatus", orderId, newStatus);
    } catch (error) {
        console.error("No se pudo actualizar el pedido:", error);
        alert(error.message);
    }
});

startConnection();