namespace SignalR.Shared.Contract;

public enum OrderStatus
{
    Pendiente,
    EnPreparacion,
    Enviado,
    Entregado
}

public sealed record OrderNotification(
    string OrderId,
    OrderStatus Status,
    DateTimeOffset ChangedAt);