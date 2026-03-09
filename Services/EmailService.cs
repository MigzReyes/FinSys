using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

using FinSys.Services.Interfaces;

public class EmailService : IEmailService
{
    public async Task SendEmailAsync(string to, string subject, string body)
    {
        var email = new MimeMessage();

        email.From.Add(MailboxAddress.Parse("finsys.rosario.cavite@gmail.com"));
        email.To.Add(MailboxAddress.Parse(to));

        email.Subject = subject;

        email.Body = new TextPart("plain")
        {
            Text = body
        };

        using var smtp = new SmtpClient();

        await smtp.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);

        await smtp.AuthenticateAsync("finsys.rosario.cavite@gmail.com", "gcsr ddea gypu arrs"); // HARDCODED FOR NOW ** LESS SECURE 

        await smtp.SendAsync(email);

        await smtp.DisconnectAsync(true);
    }
    
}