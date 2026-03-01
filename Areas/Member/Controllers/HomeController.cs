using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using FinSys.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;

namespace FinSys.Areas.Member.Controllers;

[Authorize]
[Area("Member")]
public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Dashboard()
    {
        return View();
    }

    public IActionResult FinancialTransactions()
    {
        return View();
    }

    public IActionResult Employees()
    {
        return View();
    }
    
    public IActionResult Reports()
    {
        return View();
    }

    
    public IActionResult Settings()
    {
        return View();
    }

    [HttpGet]
    public IActionResult GetClientInfo()
    {
        return Ok(new
        {
            email = User.FindFirst("Email")?.Value,
            firstName = User.FindFirst("FirstName")?.Value,
            lastName = User.FindFirst("LastName")?.Value
        });
    }

    [HttpPost]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync("UserSession");
        return Ok();
    }
}