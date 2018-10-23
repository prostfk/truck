package com.itechart.trucking.webmodule.config;

import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.webmodule.model.entity.JwtAuthToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtSuccessHandler implements AuthenticationSuccessHandler {



    @Override
    public void onAuthenticationSuccess(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication) throws IOException, ServletException {
        System.out.println("Successfully authenticated....");
        String token = httpServletRequest.getHeader("Auth-token");
//        System.out.println(token);
        User validate = new JwtVal().validate(token);
        JwtAuthToken jwtAuthToken = new JwtAuthToken(token, validate.getUsername(),validate.getUserRole());
        SecurityContextHolder.getContext().setAuthentication(jwtAuthToken);

    }
}
