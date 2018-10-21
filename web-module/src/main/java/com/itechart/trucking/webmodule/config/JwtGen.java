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

    public String generate(User jwtUser) {

        User base = userRepository.findUserByIdAndUsername(jwtUser.getId(), jwtUser.getUsername());
        if (base == null || jwtUser.getPassword() == null || !passwordEncoder.matches(jwtUser.getPassword(), base.getPassword())) {
            return null;
        }
        Claims claims = Jwts.claims()
                .setSubject(base.getUserRole().name());
        claims.put("userId", String.valueOf(base.getId()));
        claims.put("role", base.getUserRole());


        return Jwts.builder()
                .setClaims(claims)
                .signWith(SignatureAlgorithm.HS512, "fenerbahce")
                .compact();
    }

}
