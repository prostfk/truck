package com.itechart.trucking.webmodule.model.entity;

import com.itechart.trucking.user.entity.UserRole;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.List;

public class JwtAuthToken extends UsernamePasswordAuthenticationToken {

    private String token;
    private String username;
    private String role;

    public JwtAuthToken(String token) {
        super(null, null);
        this.token = token;
    }

    public JwtAuthToken(String token, Object principal, Object credentials, List<GrantedAuthority> grantedAuthorities) {
        super(principal, credentials, grantedAuthorities);
        role = credentials instanceof UserRole ? ((UserRole) credentials).name() : credentials.toString();
        username = (String) principal;
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public Object getCredentials() {
        return role;
    }

    @Override
    public Object getPrincipal() {
        return username;
    }

}
