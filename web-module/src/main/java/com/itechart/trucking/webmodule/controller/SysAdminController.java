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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@PreAuthorize("hasAuthority('ROLE_SYS_ADMIN')")
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
    public Object processAdminAndSendRequestToEmail(@RequestParam String email, @Value("${server.email}") String username, @Value("${server.password}") String password, HttpServletRequest request) {
        String token = TokenUtil.generateToken(40);
        try {
            EmailUtil.sendMail(username, password, email, "Registration",
                    String.format("<h1>Welcome to our system!</h1><br/><h4>To complete registration you need to add your account in our system. Please, visit this link to finish </h4><br/><p>%s:%s/registration?token=%s</p>", request.getServerName(), "3000", token)
            );
            tokenRepository.save(new Token(email,token));
            return HttpStatus.OK;
        } catch (Exception e) {
            e.printStackTrace();
            return HttpStatus.BAD_REQUEST;
        }
    }

    @GetMapping(value = "/companies")
    public List<Company> findAllCompanies(){
        return companyRepository.findAllByOrderById();
    }

    @PostMapping(value = "/companies/changeStatus")
    public boolean changeActiveStatus(@RequestBody String companyId){
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

    @PostMapping(value = "/companies/disable/{companyId}")
    public boolean disableCompany(@RequestBody String description, @PathVariable Long companyId){
        Company company = companyRepository.findCompanyById(companyId);
        company.setLockComment(description);
        company.setActive(0);
        company.setLockDate(new java.sql.Date(Calendar.getInstance().getTimeInMillis()));
        companyRepository.save(company);
        return true;
    }

    @GetMapping(value = "/companies/{companyId}")
    public Company getCompanyById(@PathVariable Long companyId) {
        return companyRepository.findCompanyById(companyId);
    }
}
