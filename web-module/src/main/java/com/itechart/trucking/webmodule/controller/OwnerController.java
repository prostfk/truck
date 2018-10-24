package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.webmodule.model.util.ExcelUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Date;
import java.util.Optional;

@Controller
public class OwnerController {

    private static final Logger LOGGER = LoggerFactory.getLogger(OwnerController.class);

    @Autowired
    private UserRepository Repository;



    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String mainPage() {
        LOGGER.debug("'get' request on index page");
        return "index";
    }

//    TEST

    @GetMapping(value = "/xls")//check xls method
    @ResponseBody
    public String createXls(@Value("${excel.path}")String path){
        Optional<User> byId = Repository.findById(1L);
        User user = byId.get();
        try {
            new ExcelUtil().writeInExcel(path, user,new Date(),new Date(),"","","");
            return "Success";
        } catch (IOException e) {
            return "Fail";
        }
    }

}
