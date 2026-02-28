using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using FinSys.Models;
using FinSys.Data;

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
}