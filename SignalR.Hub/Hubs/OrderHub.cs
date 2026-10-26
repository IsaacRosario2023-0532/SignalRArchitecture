using Microsoft.AspNetCore.SignalR;
using SignalR.Shared.Contract;

namespace SignalR.HubServer.Hubs;

public sealed class OrderHub : Microsoft.AspNetCore.SignalR.Hub
{
    public async Task UpdateOrderStatus(string orderId, OrderStatus status)
    {
        if (string.IsNullOrWhiteSpace(orderId))
        {
            throw new HubException("El número de pedido es obligatorio.");
        }

        orderId = orderId.Trim();

        if (orderId.Length > 40)
        {
            throw new HubException("El número de pedido supera el límite permitido.");
        }

        if (!Enum.IsDefined(status))
        {
            throw new HubException("El estado del pedido no es válido.");
        }

        var notification = new OrderNotification(
            orderId,
            status,
            DateTimeOffset.UtcNow);

        await Clients.All.SendAsync("OrderStatusChanged", notification);
    }
}