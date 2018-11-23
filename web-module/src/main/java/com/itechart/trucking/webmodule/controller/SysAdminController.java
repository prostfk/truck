package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.company.dto.CompanyDto;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.company.repository.CompanyRepository;
import com.itechart.trucking.company.service.CompanyService;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.stock.repository.StockRepository;
import com.itechart.trucking.token.entity.Token;
import com.itechart.trucking.token.repository.TokenRepository;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.webmodule.model.util.EmailUtil;
import com.itechart.trucking.webmodule.model.util.TokenUtil;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
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
import java.util.*;


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
    @Autowired
    private CompanyService companyService;

    @PostMapping(value = "/createAdmin")
    @ResponseBody
    public Object processAdminAndSendRequestToEmail(@RequestParam String email, @Value("${server.email}") String username, @Value("${server.password}") String password, HttpServletRequest request) throws JSONException {
        String token = TokenUtil.generateToken(40);
        JSONObject json = new JSONObject();
        try {
            EmailUtil.sendMail(username, password, email, "Registration",
                    String.format("<h1>Welcome to our system!</h1><br/><h4>To complete registration you need to add your account in our system. Please, visit this link to finish </h4><br/><p>%s:%s/registration?token=%s</p>", request.getServerName(), "3000", token)
            );
            tokenRepository.save(new Token(email, token));
            json.put("status", "send");
        } catch (Exception e) {
            json.put("error", "incorrect email");
        }
        return json.toString();
    }

    @GetMapping(value = "/companies")
    public  Object findAllCompanies(@RequestParam(name = "page") String page) {
        Page<Company> companies = companyService.findCompaniesByPage(page);
        return companies.map(company -> new CompanyDto(company));
    }

    @PostMapping(value = "/companies/changeStatus")
    public boolean changeActiveStatus(@RequestBody String companyId) {
        Long compId = Long.parseLong(companyId);
        Company company = companyRepository.findCompanyById(compId);
        int isActive = company.getActive();
        if (isActive == 1) {
            company.setActive(0);
        } else {
            company.setActive(1);
            company.setLockerId(null);
            company.setLockDate(null);
            company.setLockComment(null);
        }
        return companyRepository.save(company) != null;
    }

    @PostMapping(value = "/companies/disable/{companyId}")
    public boolean disableCompany(@RequestBody String description, @PathVariable Long companyId) {
        Company company = companyRepository.findCompanyById(companyId);
        User sysAdmin = userRepository.findUserByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        company.setLockerId(sysAdmin);
        company.setLockComment(description);
        company.setActive(0);
        company.setLockDate(new java.sql.Date(Calendar.getInstance().getTimeInMillis()));
        return companyRepository.save(company) != null;
    }

    @GetMapping(value = "/companies/{companyId}")
    public CompanyDto getCompanyById(@PathVariable Long companyId) {
        Company companyById = companyRepository.findCompanyById(companyId);
        try {
            return Odt.CompanyListToDtoList(Collections.singletonList(companyById)).get(0);
        } catch (IndexOutOfBoundsException e) {
            return null;
        }
    }
}
