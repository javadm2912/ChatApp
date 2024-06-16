using ChatAppApi.Models;
using ChatAppApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChatAppApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController(ChatAppService chatAppService) : ControllerBase
{
    [HttpPost("[action]")]
    public IActionResult RegisterUser(UserAddDto userAddDto)
    {
        var result = chatAppService.AddUser(userAddDto.Name);
        if (result is null)
        {
            return BadRequest("This name is taken plz take another name");
        }

        return Ok(result.ToString());
    }

    [HttpGet("[action]/{from}/{to}")]
    public IActionResult GetPrivateChats(Guid from, Guid to)
    {
        var result = chatAppService.GetUserMessages(from, to);
        return Ok(result);
    }
}