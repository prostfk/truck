package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.auto.dto.AutoDto;
import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.auto.service.AutoService;
import com.itechart.trucking.company.dto.CompanyDto;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.company.repository.CompanyRepository;
import com.itechart.trucking.company.service.CompanyService;
import com.itechart.trucking.driver.repository.DriverRepository;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.stock.dto.StockDto;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.stock.repository.StockRepository;
import com.itechart.trucking.stock.service.StockService;
import com.itechart.trucking.user.dto.UserDto;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.user.service.UserService;
import com.itechart.trucking.webmodule.model.util.EmailUtil;
import com.itechart.trucking.webmodule.service.CommonService;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;


@PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_COMP_OWNER')")
@CrossOrigin
@RestController
@RequestMapping(value = "/api")
public class AdminController {

    @Autowired
    private CommonService commonService;

    @Autowired
    private UserService userService;

    @Autowired
    private AutoService autoService;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private StockService stockService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DriverRepository driverRepository;

    @GetMapping(value = "/users")
    public Object findUsers(@RequestParam(value = "page") int pageId) throws JSONException {
        User user = commonService.getCurrentUser();
        Page<User> userPage = userService.findAllByCompany(user.getCompany(),PageRequest.of(pageId-1, 5));

        return userPage.map(UserDto::new);
    }

    @PostMapping(value = "/editCompany")
    public Object processEditingCompany(@Valid Company company, BindingResult bindingResult) throws JSONException {
        if (bindingResult.hasErrors() || company.getId()!=commonService.getCurrentUser().getCompany().getId()) {
            return getInvalidDataJsonMessage();
        }

        @Valid Company save = companyService.save(company);
        return new CompanyDto(save);
    }

    @PostMapping(value = "/editUser/{id}")
    @ResponseBody
    public Object processEditingUser(@PathVariable Long id, @Valid User user, BindingResult result) throws JSONException {
        if (result.hasErrors()  || user.getCompany().getId()!=commonService.getCurrentUser().getCompany().getId()) {
            return getInvalidDataJsonMessage();
        }
        @Valid User save = userService.save(user);

        return save != null ? new UserDto(user) : null;
    }

    @PostMapping(value = "/registerCompany")
    public Object processRegisteringCompany(@Valid Company company, BindingResult bindingResult) throws JSONException {
        User user = commonService.getCurrentUser();
        if (user.getCompany() == null) {
            if (!bindingResult.hasErrors()) {
                @Valid Company save = companyService.save(company);
                user.setCompany(save);
                User save1 = userService.save(user);
                return new UserDto(save1);
            }
        }
        return getInvalidDataJsonMessage();
    }

    @PostMapping(value = "/updateUser")
    public Object updateUser(@Valid UserDto userDto, String password) throws JSONException {
        return userService.updateUser(userDto,password).toString();
    }

    @PostMapping(value = "/saveUser")
    public Object saveUser(@Valid UserDto userDto, String password, String passport) throws JSONException {
        return userService.saveUser(userDto, password, passport);
    }

    @PostMapping(value = "/sendEmail")
    public Object sendEmail(String email, String message, String type, @Value("${server.email}") String serverEmail, @Value("${server.password}") String serverPassword) throws JSONException {
        JSONObject json = new JSONObject();
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByUsername = userService.findUserByUsername(name);
        User byEmailAndCompany = userService.findUserByEmailAndCompany(email, userByUsername.getCompany());
        if (byEmailAndCompany!=null){
            try {
                EmailUtil.sendMail(serverEmail,serverPassword,email,type,message);
                json.put("status", "success");
            } catch (Exception e) {
                e.printStackTrace();
                json.put("error", "Something went wrong with email. Check mail, maybe it is incorrect");
            }
        }else{
            json.put("error", "Something went wrong with email. Check mail, maybe it is incorrect");
        }
        return json.toString();

    }

    @GetMapping(value = "/checkEmail")
    public Object checkEmailInBaseAndInCurrentCompany(@RequestParam String email) throws JSONException {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByUsername = userService.findUserByUsername(name);
        User byEmailAndCompany = userService.findUserByEmailAndCompany(email, userByUsername.getCompany());
        JSONObject json = new JSONObject();
        if (byEmailAndCompany != null) {
            json.put("status", "ok");
        } else {
            json.put("error", "no such email in your company");
        }
        return json.toString();
    }

    @GetMapping(value = "/user/{id}")
    public UserDto findUserById(@PathVariable Long id) {
        User userById = userService.findUserById(id);
        if(commonService.getCurrentUser().getCompany().getId()!=userById.getCompany().getId()) return null;
        return new UserDto(userById);
    }

    @PutMapping(value = "/editStock/")
    @ResponseBody
    public Object processEditingStock(@Valid StockDto stockDto, BindingResult result) throws JSONException {
        if (result.hasErrors()) {
            return getInvalidDataJsonMessage();
        }
        User userByUsername = commonService.getCurrentUser();
        Stock stock= stockService.findStockById(stockDto.getId());
        if(stock.getCompany().getId()==userByUsername.getCompany().getId()){
            if(!stockDto.getName().equals("")) stock.setName(stockDto.getName());
            if(!stockDto.getAddress().equals("")) stock.setAddress(stockDto.getAddress());
            stockService.save(stock);
        }
        return new StockDto(stock);
    }

    @GetMapping(value = "/getCompanyName")
    public String getCompanyName(){
        User userByUsername = commonService.getCurrentUser();
        JSONObject json = new JSONObject();
        try {
            json.put("companyName",userByUsername.getCompany().getName());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return json.toString();
    }

    @PutMapping(value = "/changeCompanyName")
    public boolean changeCompanyName(@RequestBody String companyName) {
        if(companyName.equals("")) return false;
        Company company =commonService.getCurrentUser().getCompany();
        if(company==null) return false;
        company.setName(companyName);
        companyService.save(company);
        return true;
    }

    @GetMapping(value = "/autos")
    public Object findAutos(@RequestParam(value = "page") int pageId) {
        User userByEmail = commonService.getCurrentUser();
        Page<Auto> autoPage = autoService.findAllByCompanyAndActive(userByEmail.getCompany(),true,PageRequest.of(pageId-1, 5));
        return autoPage.map(AutoDto::new);
    }

    @PostMapping(value = "/saveAuto")
    public AutoDto saveAuto(@Valid AutoDto autoDto) throws JSONException {
        User userByEmail = commonService.getCurrentUser();
        return autoService.saveAuto(autoDto,userByEmail);
    }

    @PutMapping(value = "/auto/edit")
    @ResponseBody
    public AutoDto processEditingAuto(@Valid AutoDto autoDto) throws JSONException {
        User userByEmail = commonService.getCurrentUser();
        return autoService.processEditingAuto(autoDto,userByEmail);
    }

    @DeleteMapping(value = "/auto/")
    @ResponseBody
    public  List<AutoDto> processRemoveAuto(@RequestBody String idS) throws JSONException {
        final Long id = Long.parseLong(idS);
        User userByEmail = commonService.getCurrentUser();
        return autoService.processRemoveAuto(id,userByEmail);
    }


    private JSONObject getInvalidDataJsonMessage() throws JSONException {
        JSONObject json = new JSONObject();
        json.put("error", "invalid data");
        return json;
    }


}