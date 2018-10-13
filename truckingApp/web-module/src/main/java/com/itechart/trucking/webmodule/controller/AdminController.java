package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.entity.UserRole;
import com.itechart.trucking.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping(value = "/addUser")
    public String addUser(){
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userRepository.findUserByEmail(name);
        if (userByEmail==null || !userByEmail.getUserRole().equals(UserRole.ROLE_ADMIN)){
            return "redirect:/error";
        }
        return "addUserByAdmin";
    }

}
