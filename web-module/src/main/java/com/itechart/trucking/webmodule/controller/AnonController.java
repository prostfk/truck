package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.token.entity.Token;
import com.itechart.trucking.token.repository.TokenRepository;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.entity.UserRole;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.webmodule.config.JwtGen;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@Controller
public class AnonController {

//    @Autowired
//    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtGen jwtGen;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping(value = "/regAdmin")//redo for rest
    public String startRegistration(@RequestParam String token) {
        Token tokenByTokenValue = tokenRepository.findTokenByTokenValue(token);
        if (tokenByTokenValue != null) {
            return "registrationUserAdminPage";
        } else {
            return "redirect:/error";
        }
    }

    @PostMapping(value = "/auth")//auth rest
    @ResponseBody
    public String getToken(@ModelAttribute final User user) throws JSONException {
        JSONObject json = new JSONObject();
        String generate = jwtGen.generate(user);
        if (generate == null) {
            json.put("error", "Invalid data");
        } else {
            json.put("status", 200);
            json.put("token", generate);
        }
        return json.toString();

    }

//    @PostMapping(value = "/regAdmin")//redo for rest
//    @ResponseBody
//    public Object processAdminRegistration(@Valid User user, @RequestParam String token, BindingResult bindingResult) {
//        user.setUserRole(UserRole.ROLE_ADMIN);
//        Token tokenByTokenValue = tokenRepository.findTokenByTokenValue(token);
//        user.setEmail(tokenByTokenValue.getEmail());
//        if (!bindingResult.hasErrors()) {
//            System.out.println("OK");
//            if (user.getEmail().equals(tokenByTokenValue.getEmail())) {
//                user.setPassword(passwordEncoder.encode(user.getPassword()));
//                @Valid User save = userRepository.save(user);
//                if (save!=null){
//                    tokenRepository.delete(tokenByTokenValue);
//                }
//            }
//        }
//        System.out.println("ERROR");
//        Map<Object, Object> objectObjectHashMap = new HashMap<>();
//        objectObjectHashMap.put("error", "check data");
//        return objectObjectHashMap;
//    }


}
