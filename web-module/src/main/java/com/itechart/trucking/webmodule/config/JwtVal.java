package com.itechart.trucking.webmodule.config;

import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.entity.UserRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Component;

@Component
public class JwtVal {

    public User validate(String token) {

        User jwtUser = null;
        try {
            String secret = "fenerbahce";
            Claims body = Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(token)
                    .getBody();

            jwtUser = new User();

            jwtUser.setUsername(body.getSubject());
            jwtUser.setId(Long.parseLong((String) body.get("userId")));
            jwtUser.setUserRole(UserRole.valueOf((String)body.get("role")));
        } catch (Exception e) {
            System.out.println(e);
        }

        return jwtUser;
    }

}
