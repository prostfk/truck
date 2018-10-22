package com.itechart.trucking.webmodule.config;

import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.entity.UserRole;
import com.itechart.trucking.webmodule.controller.MainController;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.apache.commons.codec.binary.Base64;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class JwtVal {

    private static final Logger LOGGER = LoggerFactory.getLogger(JwtVal.class);

    public User validate(String token) {

        User jwtUser = null;
        try {
            String[] split = token.split("\\.");
            Base64 base64 = new Base64();
            byte[] decode = base64.decode(split[1]);
            String s = new String(decode);
            System.err.println(s);
            jwtUser = initUserFromToken(s);
        } catch (Exception e) {
            LOGGER.warn("Exception in token validation(Maybe, no such user): e");
        }
        return jwtUser;
    }

    private User initUserFromToken(String token) throws JSONException {
        JSONObject j = new JSONObject(token);
        return new User(j.get("username").toString(), "dto", "dto", UserRole.valueOf(j.get("role").toString()), null, null);

    }

}
