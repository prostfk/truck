package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.webmodule.model.util.BirthDayCongratulations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;

import javax.annotation.PostConstruct;

@Controller
public class UserController {


    @Autowired
    public UserController(BirthDayCongratulations bdc){
        bdc.congratulate();
    }

}
