package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.auto.repository.AutoRepository;
import com.itechart.trucking.auto.service.AutoService;
import com.itechart.trucking.auto.statistics.AutoStatisticsDto;
import com.itechart.trucking.company.dto.CompanyDto;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.company.repository.CompanyRepository;
import com.itechart.trucking.company.service.CompanyService;
import com.itechart.trucking.company.statistics.CompanyStatisticsDto;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.stock.repository.StockRepository;
import com.itechart.trucking.token.entity.Token;
import com.itechart.trucking.token.repository.TokenRepository;
import com.itechart.trucking.token.service.TokenService;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.user.service.UserService;
import com.itechart.trucking.user.statistics.UserStatisticsDto;
import com.itechart.trucking.webmodule.model.dto.SysAdminStatistics;
import com.itechart.trucking.webmodule.model.util.EmailUtil;
import com.itechart.trucking.webmodule.model.util.FileUtil;
import com.itechart.trucking.webmodule.model.util.TokenUtil;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
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
import org.stringtemplate.v4.ST;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.*;


@PreAuthorize("hasAuthority('ROLE_SYS_ADMIN')")
@CrossOrigin
@RestController
@RequestMapping(value = "/api")
public class SysAdminController {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserService userService;

    @Autowired
    private AutoService autoService;

    @Autowired
    private CompanyService companyService;

    @PostMapping(value = "/createAdmin")
    @ResponseBody
    public Object processAdminAndSendRequestToEmail(@RequestParam String email, @Value("${server.email}") String username, @Value("${server.password}") String password, HttpServletRequest request) throws JSONException {
        String token = TokenUtil.generateToken(40);
        JSONObject json = new JSONObject();
        try {
            ST st = new ST(FileUtil.readFile(new ClassPathResource("registration.stg").getFile().getAbsolutePath()));
            st.add("link", String.format("%s:%s/registration?token=%s",request.getServerName(), "3000", token));
            EmailUtil.sendMail(username, password, email, "Registration", st.render(new Locale("ru","ru")));
            tokenService.save(new Token(email, token));
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
        Company company = companyService.findCompanyById(compId);
        int isActive = company.getActive();
        if (isActive == 1) {
            company.setActive(0);
        } else {
            company.setActive(1);
            company.setLockerId(null);
            company.setLockDate(null);
            company.setLockComment(null);
        }
        return companyService.save(company) != null;
    }

    @PostMapping(value = "/companies/disable/{companyId}")
    public boolean disableCompany(@RequestBody String description, @PathVariable Long companyId) {
        Company company = companyService.findCompanyById(companyId);
        User sysAdmin = userService.findUserByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        company.setLockerId(sysAdmin);
        company.setLockComment(description);
        company.setActive(0);
        company.setLockDate(new java.sql.Date(Calendar.getInstance().getTimeInMillis()));
        return companyService.save(company) != null;
    }

    @GetMapping(value = "/companies/{companyId}")
    public CompanyDto getCompanyById(@PathVariable Long companyId) {
        Company companyById = companyService.findCompanyById(companyId);
        try {
            return Odt.CompanyListToDtoList(Collections.singletonList(companyById)).get(0);
        } catch (IndexOutOfBoundsException e) {
            return null;
        }
    }

    @GetMapping(value = "/statistics/getFull")
    public Object getUsersStat() {
        List<UserStatisticsDto> userStatisticsDtos = userService.getTotalUserStatistics();
        List<CompanyStatisticsDto> companyStatisticsDtos = companyService.getCompanyStatistics();
        List<AutoStatisticsDto> autoStatisticsDtos = autoService.getAutoStatistics();
        return new SysAdminStatistics(userStatisticsDtos,companyStatisticsDtos,autoStatisticsDtos);
    }


}
