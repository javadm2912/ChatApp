using ChatAppApi.Entity;
using ChatAppApi.Models;

namespace ChatAppApi.Services;

public class ChatAppService
{
    private static readonly List<User> Users = new();
    public Guid? AddUser(string username)
    {
        lock (Users)
        {
            var user = Users.SingleOrDefault(u => string.Equals(u.Name, username, StringComparison.CurrentCultureIgnoreCase));
            if (user != null)
            {
                return user.Id;
            }

            user = new User { Id = Guid.NewGuid(), Name = username };
            Users.Add(user);
            return user.Id;
        }
    }

    public void AddUserConnectionId(Guid userId, string connectionId)
    {
        lock (Users)
        {
            var user = Users.SingleOrDefault(u => u.Id == userId);
            if (user != null)
            {
                user.ConnectionId = connectionId;
                user.OnlineUser();
            }
        }
    }

    public Guid? GetUserByConnectionId(string connectionId)
    {
        lock (Users)
        {
            return Users.SingleOrDefault(u => u.ConnectionId == connectionId)?.Id;
        }
    }

    public string? GetConnectionIdByUser(Guid userId)
    {
        lock (Users)
        {
            return Users.SingleOrDefault(u => u.Id == userId)?.ConnectionId;
        }
    }

    public void OfflineUser(Guid userId){
        lock (Users)
        {
            var user = Users.SingleOrDefault(u => u.Id == userId);
            user?.OfflineUser();
        }
    }

    public void OnlineUser(Guid userId)
    {
        lock (Users)
        {
            var user = Users.SingleOrDefault(u => u.Id == userId);
            user?.OnlineUser();
        }
    }

    public User[] GetContacts()
    {
        lock (Users)
        {
            return Users.OrderBy(u => u.Name).ToArray();
        }
    }

    public List<MessageModel> GetUserMessages(Guid from, Guid to)
    {
        lock (Users)
        {
            var user = Users.Single(u => u.Id == from);
            return user.Messages.Where(m => (m.From == from && m.To == to) || (m.From == to && m.To == from)).Select(
                m => new MessageModel
                {
                    SenderName = Users.Single(u => u.Id == m.From).Name,
                    From = m.From,
                    To = m.To,
                    Message = m.Text
                }).ToList();
        }
    }

    public void AddMessageToUserMessages(MessageModel message) 
    {
        lock (Users)
        {
            var sender = Users.Single(u => u.Id == message.From);
            sender.AddMessage(message.From, message.To, message.Message);

            var receiver = Users.Single(u => u.Id == message.To);
            receiver.AddMessage(message.From, message.To, message.Message);

            message.SenderName = Users.Single(u => u.Id == message.From).Name;
        }
    }

    public string GetPrivateGroupName(string from, string to)
    {
        var stringCompare = string.CompareOrdinal(from, to) > 0;
        return stringCompare ? $"{from}-{to}" : $"{to}-{from}";
    }
}