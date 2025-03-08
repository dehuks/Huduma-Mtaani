using Microsoft.AspNetCore.Mvc;
using BACKEND.Data;
using BACKEND.Models;
using BACKEND.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace BACKEND.Controllers
{
    [Route("api/ratings")]
    [ApiController]
    public class RatingsController : ControllerBase
    {
        private readonly HudumaDbContext _context;

        public RatingsController(HudumaDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<Rating>> CreateRating(RatingDto ratingDto)
        {
            var rating = new Rating
            {
                CustomerId = ratingDto.CustomerId,
                Rate = ratingDto.Rate
            };

            _context.Ratings.Add(rating);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRating), new { ratingId = rating.RatingId }, rating);
        }

        [HttpGet("{ratingId}")]
        public async Task<ActionResult<Rating>> GetRating(int ratingId)
        {
            var rating = await _context.Ratings.FindAsync(ratingId);
            if (rating == null)
            {
                return NotFound();
            }

            return rating;
        }
    }
}
