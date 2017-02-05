using System;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Elixr.Api.Filters
{
    public class ExceptionFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            if(context.GetType() == typeof(InvalidTokenException))
            {
                context.HttpContext.Response.StatusCode = 401;
            }
            else
            {
                context.HttpContext.Response.StatusCode = 500;
            }
        }
    }
}