package com.itechart.trucking.webmodule.config;

import com.itechart.trucking.webmodule.model.entity.JwtAuthToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtAuthFilter extends AbstractAuthenticationProcessingFilter {
    protected JwtAuthFilter() {
        super("/rest/index**");
    }

    private static final Logger LOGGER = LoggerFactory.getLogger(JwtAuthFilter.class);

    @Override
    public Authentication attemptAuthentication(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws AuthenticationException, IOException, ServletException {
        String header = httpServletRequest.getHeader("Auth-token");
        if (header == null) {
            LOGGER.warn("No token in header");
            return null;
        }
        String authenticationToken = header.substring(6);
        JwtAuthToken token = new JwtAuthToken(authenticationToken);
        return getAuthenticationManager().authenticate(token);
    }
}
