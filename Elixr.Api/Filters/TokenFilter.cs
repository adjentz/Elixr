using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;
using Elixr.Api.Services;
using Elixr.Api.Models;
using System;
using Elixr.Api.ApiModels;
using Microsoft.Extensions.Primitives;

namespace Elixr.Api.Filters
{
    public class TokenFilter : IActionFilter
    {
        private readonly UserSession userSession;
        private readonly Utilities utilities;
        public TokenFilter(UserSession session, Utilities utilities)
        {
            userSession = session;
            this.utilities = utilities;
        }
        public void OnActionExecuted(ActionExecutedContext context)
        {
            //
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {

            string authTokenJSON = null;
            StringValues headerValue;
            if(context.HttpContext.Request.Headers.TryGetValue("authToken", out headerValue))
            {
                authTokenJSON = headerValue.FirstOrDefault();
            }

            if (!string.IsNullOrWhiteSpace(authTokenJSON))
            {
                var token = Newtonsoft.Json.JsonConvert.DeserializeObject<AuthToken>(authTokenJSON);
                if (token != null)
                {
                    userSession.Player = new Player
                    {
                        Name = token.PlayerName,
                        Id = token.PlayerId
                    };
                    if (token.Signature != utilities.HashText(userSession.Player.StrToHash))
                    {
                        context.HttpContext.Response.StatusCode = 401;
                        userSession.Player = null;
                        throw new InvalidTokenException();
                    }
                    return; //we have a valid token.
                }
            }
            //need to see if the method allows anonymous users.
        }
    }
}