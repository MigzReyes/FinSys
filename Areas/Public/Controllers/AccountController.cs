using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using FinSys.Models;
using FinSys.Data;
using FinSys.DTO;
using Microsoft.EntityFrameworkCore;

namespace FinSys.Areas.Public.Controllers;

[Area("Public")]
public class AccountController : Controller
{
    private readonly ApplicationDbContext _context;

    private readonly ILogger<AccountController> _logger;

    public AccountController(ILogger<AccountController> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public IActionResult LogIn()
    {
        return View();
    }

    public IActionResult SignUp()
    {
        return View();
    }

    public IActionResult ForgotPass()
    {
        return View();
    }

    public IActionResult Verification()
    {
        return View();
    }

    public IActionResult ResetPass()
    {
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> SignUpClient([FromBody] ClientSignUpDto clientDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // COMPANY ID
        Random ran = new();
        var id = ran.Next(0, 100000).ToString("D6");

        var client = new Clients
        {
            FirstName = clientDto.FirstName,
            LastName = clientDto.LastName,
            Email = clientDto.Email,
            Phone = clientDto.Phone,
            Password = clientDto.Password,
            Country = clientDto.Country,
            CompanyId = int.Parse(id),
            IsPayed = false,
            Position = "Owner",
            Role = "Admin"
        };

        _context.Clients.Add(client);
        await _context.SaveChangesAsync();

        return Ok( new { client, success = true, message = "Client signed up", redirect = "/Public/Account/LogIn"});
    } 

    [HttpPost]
    public async Task<IActionResult> GetClientEmail([FromBody] ClientEmailVerifDtto emailDto) 
    {
        var Client = await _context.Clients.FirstOrDefaultAsync(u => u.Email == emailDto.Email);

        if (Client == null)
        {
            return Ok( new { message = "Client have not signed in yet", signedIn = false});
        } 
        else
        {
            return Ok( new { message = "Client have signed in", signedIn = true});
        }
    }
}