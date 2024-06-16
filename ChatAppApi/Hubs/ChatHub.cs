using ChatAppApi.Models;
using ChatAppApi.Services;
using Microsoft.AspNetCore.SignalR;

namespace ChatAppApi.Hubs;

public class ChatHub(ChatAppService chatAppService) : Hub
{
    public override async Task OnConnectedAsync()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, "RegalChat");
        await Clients.Caller.SendAsync("UserConnected");
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        // await Groups.RemoveFromGroupAsync(Context.ConnectionId, "RegalChat");
        var userId = chatAppService.GetUserByConnectionId(Context.ConnectionId);
        if (userId != null)
        {
            chatAppService.OfflineUser((Guid)userId);
            await DisplayOnlineUsers();
        }

        await base.OnDisconnectedAsync(exception);
    }

    public async Task AddUserConnectionId(Guid userId)
    { 
        chatAppService.AddUserConnectionId(userId, Context.ConnectionId);
        await DisplayOnlineUsers();
    }

    public async Task ReceiveMessage(MessageModel message)
    {
        // await Clients.Groups("RegalChat").SendAsync("NewMessage", message);
    }

    public async Task SendPrivateMessage(MessageModel message)
    {
        var privateGroupName = chatAppService.GetPrivateGroupName(message.From.ToString(), message.To.ToString());
        await Groups.AddToGroupAsync(Context.ConnectionId, privateGroupName);
        chatAppService.AddMessageToUserMessages(message);

        var toConnectionId = chatAppService.GetConnectionIdByUser(message.To!);
        if (toConnectionId != null)
        {
            await Groups.AddToGroupAsync(toConnectionId, privateGroupName);
            await Clients.Client(toConnectionId).SendAsync("NewPrivateMessage", message);
        }
    }

    public async Task ReceivePrivateMessage(MessageModel message)
    {
        var privateGroupName = chatAppService.GetPrivateGroupName(message.From.ToString(), message.To.ToString());
        chatAppService.AddMessageToUserMessages(message);
        await Clients.Groups(privateGroupName).SendAsync("NewPrivateMessage", message);
    }

    public async Task RemovePrivateChat(Guid from, Guid to)
    {
        var privateGroupName = chatAppService.GetPrivateGroupName(from.ToString(), to.ToString());
        await Clients.Groups(privateGroupName).SendAsync("ClosePrivateChat");

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, privateGroupName);
        var toConnectionId = chatAppService.GetConnectionIdByUser(to);

        if (toConnectionId != null)
        {
            await Groups.RemoveFromGroupAsync(toConnectionId, privateGroupName);
        }
    }

    private async Task DisplayOnlineUsers()
    {
        var onlineUsers = chatAppService.GetContacts();
        await Clients.Groups("RegalChat").SendAsync("OnlineUsers", onlineUsers);
    }
}