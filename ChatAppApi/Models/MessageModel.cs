namespace ChatAppApi.Models;

public class MessageModel
{
    public string? SenderName { get; set; }
    public required Guid From { get; set; }
    public required Guid To { get; set; }
    public required string Message { get; set; }
}