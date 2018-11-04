package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.company.repository.CompanyRepository;
import com.itechart.trucking.token.entity.Token;
import com.itechart.trucking.token.repository.TokenRepository;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.entity.UserRole;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.webmodule.config.JwtGen;
import com.itechart.trucking.webmodule.config.JwtVal;
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
//    private PasswordEncoder passwordEncoder; refresh token

    @Autowired
    private JwtGen jwtGen;

    @Autowired
    private JwtVal jwtVal;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CompanyRepository companyRepository;

    @PostMapping(value = "/auth")
    @ResponseBody
    public String getToken(@ModelAttribute final User user) throws JSONException {
        JSONObject json = new JSONObject();
        String generate = jwtGen.generate(user);
        User validate = jwtVal.validate(generate);
        if (generate == null) {
            json.put("error", "Invalid data");
        } else {
            json.put("status", 200);
            json.put("token", generate);
            json.put("role", validate.getUserRole().name());
        }
        return json.toString();

    }

    @PostMapping(value = "/registration")
    @ResponseBody
    public Object processAdminRegistration(@Valid User user, String companyName, String token, BindingResult bindingResult) throws JSONException {
        JSONObject jsonObject = new JSONObject();
        user.setUserRole(UserRole.ROLE_ADMIN);
        Token tokenByTokenValue = tokenRepository.findTokenByTokenValue(token);
        if (tokenByTokenValue==null){
            jsonObject.put("error", "Invalid link!");
            return jsonObject.toString();
        }
        user.setEmail(tokenByTokenValue.getEmail());
        if (!bindingResult.hasErrors() && userRepository.findUserByUsername(user.getUsername())==null && companyRepository.findCompanyByName(companyName)==null) {
            if (user.getEmail().equals(tokenByTokenValue.getEmail())) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                Company save1 = companyRepository.save(new Company(companyName, 1));
                user.setCompany(save1);
                @Valid User save = userRepository.save(user);
                if (save!=null){
                    tokenRepository.delete(tokenByTokenValue);
                    jsonObject.put("status", "success");
                    return jsonObject;
                }
            }
        }
        jsonObject.put("error", "Invalid data!");
        return jsonObject.toString();
    }


}
