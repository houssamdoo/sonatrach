using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AccountsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Account>>> GetAccounts()
    {
        return await _context.Accounts.OrderBy(a => a.Id).ToListAsync();
    }

    [HttpPost("transfer")]
    public async Task<IActionResult> Transfer([FromBody] TransferRequest request)
    {
        if (request.Amount <= 0)
        {
            return BadRequest(new { message = "Transfer amount must be positive." });
        }
        
        if (request.FromAccountId == request.ToAccountId)
        {
            return BadRequest(new { message = "Cannot transfer money to the same account." });
        }

        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var fromAccount = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == request.FromAccountId);
            var toAccount = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == request.ToAccountId);

            if (fromAccount == null || toAccount == null)
            {
                return NotFound(new { message = "One or both accounts not found." });
            }

            if (fromAccount.Balance < request.Amount)
            {
                return BadRequest(new { message = "Insufficient funds." });
            }

            fromAccount.Balance -= request.Amount;
            toAccount.Balance += request.Amount;

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new { message = "Transfer successful!" });
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, new { message = "An internal error occurred during the transaction." });
        }
    }
}
