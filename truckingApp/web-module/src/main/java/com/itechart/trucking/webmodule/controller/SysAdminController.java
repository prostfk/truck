package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.company.repository.CompanyRepository;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.stock.repository.StockRepository;
import com.itechart.trucking.token.entity.Token;
import com.itechart.trucking.token.repository.TokenRepository;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.webmodule.model.util.EmailUtil;
import com.itechart.trucking.webmodule.model.util.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping(value = "/api")
public class SysAdminController {

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @PostMapping(value = "/createAdmin")
    @ResponseBody
    public Object processAdminAndSendRequestToEmail(@RequestParam String email, @Value("${server.email}") String username, @Value("${server.password}") String password, @Value("${email.html}") String html, HttpServletRequest request) {
        String token = TokenUtil.generateToken(40);
        try {
            EmailUtil.sendMail(username, password, email, "Registration",
                    String.format(html, request.getServerName(), request.getServerPort(), token)
            );
            if (tokenRepository.findTokenByTokenValue(token)==null){
                tokenRepository.save(new Token(email,token));
            }else{
                return HttpStatus.BAD_REQUEST;
            }
            return HttpStatus.OK;
        } catch (Exception e) {
            e.printStackTrace();
            return HttpStatus.BAD_REQUEST;
        }
    }

    //list of companys for sys admin
    @GetMapping(value = "/companys")
    public List<Company> gelallcompanies(){
        return companyRepository.findAllByOrderById();
    }

    @RequestMapping(value = "/companys/changestatus",method = RequestMethod.POST)
    public boolean changeactivestatus(@RequestBody String companyId){
        Long compId = Long.parseLong(companyId);
        if(companyId==null) return false;
        Company company = companyRepository.findCompanyById(compId);
        int isActive = company.getActive();
        if(isActive==1){
            company.setActive(0);
        } else company.setActive(1);
        companyRepository.save(company);
        return true;
    }
    @RequestMapping(value = "/companys/{companyId}",method = RequestMethod.GET)
    public Company getCompanyById(@PathVariable String companyId){
        System.out.println(companyId);
        Long compId = Long.parseLong(companyId);
        if(companyId==null) return null;
        return companyRepository.findCompanyById(compId);
    }


}
