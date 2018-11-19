package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.company.repository.CompanyRepository;
import com.itechart.trucking.token.entity.Token;
import com.itechart.trucking.token.repository.TokenRepository;
import com.itechart.trucking.user.dto.UserDto;
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
import java.sql.Timestamp;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
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
    public Object processAdminRegistration(@Valid UserDto userDto, String password, String companyName, String token, BindingResult bindingResult) throws JSONException {
        JSONObject jsonObject = new JSONObject();
        userDto.setUserRole(UserRole.ROLE_COMP_OWNER);
        Token tokenByTokenValue = tokenRepository.findTokenByTokenValue(token);
        if (tokenByTokenValue == null) {
            jsonObject.put("error", "Invalid link!");
            return jsonObject.toString();
        }
        userDto.setEmail(tokenByTokenValue.getEmail());
        if (!bindingResult.hasErrors() && userRepository.findUserByUsername(userDto.getUsername()) == null && companyRepository.findCompanyByName(companyName) == null) {
            if (userDto.getEmail().equals(tokenByTokenValue.getEmail())) {
                Company savedCompany = companyRepository.save(new Company(companyName, 1));
                userDto.setCompany(savedCompany);
                LocalDateTime localDateTime = LocalDateTime.now(Clock.systemUTC());
                Timestamp timestamp = Timestamp.valueOf(localDateTime);
                userRepository.saveUser(
                        userDto.getUsername(), userDto.getEmail(), passwordEncoder.encode(password), userDto.getUserRole().name(),
                        userDto.getCompany().getId(), userDto.getBirthDay(), userDto.getFirstName(), userDto.getSecondName(), userDto.getThirdName(),
                        userDto.getCountry(), userDto.getCity(), userDto.getStreet(), userDto.getHouseNumber(), userDto.getFlatNumber(),timestamp
                );
                tokenRepository.delete(tokenByTokenValue);
                jsonObject.put("status", "success");
                return jsonObject.toString();
            }
        }
        jsonObject.put("error", "Invalid data!");
        return jsonObject.toString();
    }

    @GetMapping(value = "/anon/tokenValidation")
    public Object validate(@RequestParam String token) throws JSONException {
        Token tokenByTokenValue = tokenRepository.findTokenByTokenValue(token);
        JSONObject json = new JSONObject();
        if (tokenByTokenValue != null) {
            json.put("message", "token exists");
        } else {
            json.put("error", "no such token");
        }
        return json.toString();
    }

    @GetMapping(value = "/checkCompanyName")
    public Object checkNameForExisting(@RequestParam String name) throws JSONException {
        Company companyByName = companyRepository.findCompanyByName(name);
        JSONObject json = new JSONObject();
        if (companyByName != null) {
            json.put("error", "such company already exists");
        } else {
            json.put("message", "all fine");
        }
        return json.toString();
    }

}
