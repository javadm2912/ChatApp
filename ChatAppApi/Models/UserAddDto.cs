using System.ComponentModel.DataAnnotations;

namespace ChatAppApi.Models;

public class UserAddDto
{
    [StringLength(15 , MinimumLength = 3, ErrorMessage = "Name must be at least {2}, and minimum {1} characters")]
    public required string Name { get; set; }
}