package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.company.repository.CompanyRepository;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.stock.repository.StockRepository;
import com.itechart.trucking.token.entity.Token;
import com.itechart.trucking.token.repository.TokenRepository;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@Secured("ROLE_SYS_ADMIN")
public class SysAdminController {

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @GetMapping(value = "/createAdmin")
    public String addNewAdmin() {
        return "addAdminPageBySysAdmin";//input email to send link
    }

    @GetMapping(value = "/regAdmin")
    public String startRegistration(@RequestParam String token, HttpServletRequest request) {
        Token tokenByTokenValue = tokenRepository.findTokenByTokenValue(token);
        if (tokenByTokenValue != null) {
            request.getSession().setAttribute("token", token);
            return "registrationUserAdminPage";
        } else {
            return "redirect:/error";
        }
    }

    @PostMapping(value = "/regAdmin")
    @ResponseBody
    public Object processAdminRegistration(@Valid User user, @RequestParam String token, BindingResult bindingResult){
        if (!bindingResult.hasErrors()){
            Token tokenByTokenValue = tokenRepository.findTokenByTokenValue(token);
            if (user.getEmail().equals(tokenByTokenValue.getEmail())){
                return userRepository.save(user);
            }
        }
        Map<Object, Object> objectObjectHashMap = new HashMap<>();
        objectObjectHashMap.put("error", "check data");
        return objectObjectHashMap;
    }

    @GetMapping(value = "/registerCompany")
    public String registerCompany(){
        return "registerCompany";
    }

    @PostMapping(value = "/registerCompany")
    @ResponseBody
    public Object processRegister(@Valid Company company, BindingResult bindingResult){
        if (bindingResult.hasErrors()){
            return "{message: 'check your data'}";
        }
        @Valid Company save = companyRepository.save(company);
        return save;
    }




}
