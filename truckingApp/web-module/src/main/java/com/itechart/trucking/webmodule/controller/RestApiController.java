package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(value = "/rest")
public class RestApiController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping(value = "/registration")
    public Object addNewUserToDatabase(@Valid User user, BindingResult bindingResult){
        if (bindingResult.hasErrors()){
            return throwError("Check your data");
        }
        User userByUsernameOrEmail = userRepository.findUserByUsernameOrEmail(user.getUsername(), user.getEmail());
        if (userByUsernameOrEmail!=null){
            if (user.getEmail().equals(userByUsernameOrEmail.getEmail())){
                return throwError("User with such email already exists");
            }else if (user.getUsername().equals(userByUsernameOrEmail.getUsername())){
                return throwError("User with such username already exists");
            }
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        System.out.println(user);
        return userRepository.save(user);
    }


    private Map<String, String> throwError(String message){
        Map<String, String> map = new HashMap<>();
        map.put("error", message);
        return map;
    }

}
