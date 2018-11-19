package com.itechart.trucking.webmodule.service;

import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CommonService {
    @Autowired
    private UserRepository userRepository;

    public User getCurrentUser(){
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByName = userRepository.findUserByUsername(name);
        return userByName;
    }
}
