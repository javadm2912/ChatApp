namespace ChatAppApi.Entity;

public class User
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public bool IsOnline { get; set; }
    public string? ConnectionId { get; set; }
    public List<Message> Messages { get; set; } = new();

    public record Message(Guid From, Guid To, string Text);


    public void OfflineUser()
    { 
        IsOnline = false;
    }

    public void OnlineUser()
    {
        IsOnline = true;
    }

    public void AddMessage(Guid from, Guid to, string text)
    {
        lock (Messages)
        {
            Messages.Add(new Message(from, to, text));
        }
    }
}