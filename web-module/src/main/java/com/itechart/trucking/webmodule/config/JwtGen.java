package com.itechart.trucking.webmodule.config;

import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class JwtGen {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String generate(User user) {

        User base = userRepository.findUserByUsername(user.getUsername());
        if (base == null || user.getPassword() == null || !passwordEncoder.matches(user.getPassword(), base.getPassword())) {
            return null;
        }
        Claims claims = Jwts.claims()
                .setSubject(base.getId().toString());
        claims.put("username", String.valueOf(base.getUsername()));
        claims.put("role", base.getUserRole());


        return Jwts.builder()
                .setClaims(claims)
                .signWith(SignatureAlgorithm.HS512, "fenerbahce")
                .compact();
    }

}
