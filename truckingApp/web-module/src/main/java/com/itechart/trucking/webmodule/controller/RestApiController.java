package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.entity.UserRole;
import com.itechart.trucking.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

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
        user.setUserRole(UserRole.ROLE_USER);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @GetMapping("/checkRole")
    @ResponseBody
    public Map<String, String> checkRole(){
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userRepository.findUserByEmail(name);
        Map<String, String> map = new HashMap<>();
        map.put("role", userByEmail!=null ? userByEmail.getUserRole().name() : UserRole.ROLE_USER.name());
        return map;
    }

    private Map<String, String> throwError(String message){
        Map<String, String> map = new HashMap<>();
        map.put("error", message);
        return map;
    }

}
