package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.auto.dto.AutoDto;
import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.auto.repository.AutoRepository;
import com.itechart.trucking.company.dto.CompanyDto;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.company.repository.CompanyRepository;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.driver.repository.DriverRepository;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.stock.dto.StockDto;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.stock.repository.StockRepository;
import com.itechart.trucking.user.dto.UserDto;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.entity.UserRole;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.webmodule.model.util.EmailUtil;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_COMP_OWNER')")
@CrossOrigin
@RestController
@RequestMapping(value = "/api")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AutoRepository autoRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DriverRepository driverRepository;

    @GetMapping(value = "/users")
    public Object findUsers(@RequestParam(value = "page") int pageId) throws JSONException {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userRepository.findUserByUsername(name);

        Page<User> userPage = userRepository.findAllByCompany(userByEmail.getCompany(),PageRequest.of(pageId-1, 5));

        return userPage.map(user -> new UserDto(user));
    }

    @PostMapping(value = "/editCompany")
    public Object processEditingCompany(@Valid Company company, BindingResult bindingResult) throws JSONException {
        if (bindingResult.hasErrors()) {
            return getInvalidDataJsonMessage();
        }
        @Valid Company save = companyRepository.save(company);
        return new CompanyDto(save);
    }

    @PostMapping(value = "/editUser/{id}")
    @ResponseBody
    public Object processEditingUser(@PathVariable Long id, @Valid User user, BindingResult result) throws JSONException {
        if (result.hasErrors()) {
            return getInvalidDataJsonMessage();
        }
        @Valid User save = userRepository.save(user);
        return save != null ? new UserDto(user) : null;

    }

    @PostMapping(value = "/registerCompany")
    public Object processRegisteringCompany(@Valid Company company, BindingResult bindingResult) throws JSONException {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findUserByUsername(name);
        if (user.getCompany() == null) {
            if (!bindingResult.hasErrors()) {
                @Valid Company save = companyRepository.save(company);
                user.setCompany(save);
                User save1 = userRepository.save(user);
                return new UserDto(save1);
            }
        }
        return getInvalidDataJsonMessage();
    }

    @PostMapping(value = "/updateUser")
    public Object updateUser(@Valid UserDto userDto, String password) throws JSONException {
        JSONObject json = new JSONObject();
        User userById = userRepository.findUserById(userDto.getId());
        if (userById == null) {
            json.put("error", "no id attribute on formData object");
        } else {
            User userByUsername = userRepository.findUserByUsername(userDto.getUsername());
            if (userByUsername == null || !userByUsername.getId().equals(userDto.getId())) {

                json.put("error", "user with such username already exists");
            } else {
                if (password.length() > 5 && password.length() < 20) {
                    DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
                    userRepository.updateUser(userDto.getId(), userDto.getUsername(), userDto.getEmail(), passwordEncoder.encode(password), userDto.getUserRole().name(), userDto.getBirthDay(),
                            userDto.getFirstName(), userDto.getSecondName(), userDto.getThirdName(), userDto.getCountry(), userDto.getCity(),
                            userDto.getStreet(), userDto.getHouseNumber(), userDto.getFlatNumber());
                    json.put("username", userDto.getUsername());
                    json.put("email", userDto.getEmail());
                    json.put("birthDay", userDto.getBirthDay());
                    json.put("role", userDto.getUserRole());
                } else {
                    json.put("error", "password must be between 5 and 20 chars");
                }
            }
        }
        return json.toString();
    }

    @PostMapping(value = "/saveUser")
    public Object saveUser(@Valid UserDto userDto, String password, String passport, String birthDay) throws JSONException {
        JSONObject json = new JSONObject();
        User userByUsername = userRepository.findUserByUsername(userDto.getUsername());
        if (userByUsername == null) {
            if (password.length() > 5 && password.length() < 20) {
                User admin = userRepository.findUserByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
                LocalDateTime localDateTime = LocalDateTime.now(Clock.systemUTC());
                Timestamp timestamp = Timestamp.valueOf(localDateTime);

                userRepository.saveUser(userDto.getUsername(), userDto.getEmail(), passwordEncoder.encode(password), userDto.getUserRole().name(), admin.getCompany().getId(), userDto.getBirthDay(),
                        userDto.getFirstName(), userDto.getSecondName(), userDto.getThirdName(), userDto.getCountry(), userDto.getCity(), userDto.getStreet(),
                        userDto.getHouseNumber(), userDto.getFlatNumber(),timestamp);

                if (userDto.getUserRole().equals(UserRole.ROLE_DRIVER)){
                    User savedUser = userRepository.findUserByUsername(userDto.getUsername());
                    driverRepository.saveDriver(
                            String.format("%s %s", savedUser.getFirstName(), savedUser.getSecondName()),
                            passport,savedUser.getCompany().getId(),savedUser.getId()
                    );
                }
                json.put("username", userDto.getUsername());
                json.put("email", userDto.getEmail());
                json.put("birthDay", userDto.getBirthDay());
                json.put("role", userDto.getUserRole());
            } else {
                json.put("error", "password must be between 5 and 20 chars");
            }
        } else {
            json.put("error", "user with such username already exists");
        }
        return json.toString();

    }

    @PostMapping(value = "/sendEmail")
    public Object sendEmail(String email, String message, String type, @Value("${server.email}") String serverEmail, @Value("${server.password}") String serverPassword) throws JSONException {
        JSONObject json = new JSONObject();
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByUsername = userRepository.findUserByUsername(name);
        User byEmailAndCompany = userRepository.findUserByEmailAndCompany(email, userByUsername.getCompany());
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
        User userByUsername = userRepository.findUserByUsername(name);
        User byEmailAndCompany = userRepository.findUserByEmailAndCompany(email, userByUsername.getCompany());
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
        User userById = userRepository.findUserById(id);
        return new UserDto(userById);
    }

    @PutMapping(value = "/editStock/")
    @ResponseBody
    public Object processEditingStock(@Valid StockDto stockDto, BindingResult result) throws JSONException {
        if (result.hasErrors()) {
            return getInvalidDataJsonMessage();
        }
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByUsername = userRepository.findUserByUsername(name);

        Stock stock= stockRepository.findStockById(stockDto.getId());
        if(stock.getCompany().getId()==userByUsername.getCompany().getId()){
            if(!stockDto.getName().equals("")) stock.setName(stockDto.getName());
            if(!stockDto.getAddress().equals("")) stock.setAddress(stockDto.getAddress());
            stockRepository.save(stock);
        }
        return new StockDto(stock);
    }

    @GetMapping(value = "/getCompanyName")
    public String getCompanyName(){
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByUsername = userRepository.findUserByUsername(name);
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
        Company company = companyRepository.findCompanyByName(companyName);
        if(company!=null) return false;

        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByUsername = userRepository.findUserByUsername(name);
        company = null;
        company = userByUsername.getCompany();
        company.setName(companyName);
        companyRepository.save(company);
        return true;
    }

    @GetMapping(value = "/autos")
    public Object findAutos(@RequestParam(value = "page") int pageId) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userRepository.findUserByUsername(name);

        Page<Auto> autoPage = autoRepository.findAllByCompanyAndActive(userByEmail.getCompany(),true,PageRequest.of(pageId-1, 5));
        return autoPage.map(auto -> new AutoDto(auto));
    }

    @PostMapping(value = "/saveAuto")
    public AutoDto saveAuto(@Valid AutoDto autoDto) throws JSONException {
        if(autoDto==null) return null;
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userRepository.findUserByUsername(name);
        Auto auto = new Auto();
        auto.setName(autoDto.getName());
        auto.setCarNumber(autoDto.getCarNumber());
        auto.setFuelConsumption(autoDto.getFuelConsumption());
        auto.setType(autoDto.getType());
        auto.setCompany(userByEmail.getCompany());
        auto.setActive(true);
        autoRepository.save(auto);
        AutoDto autoDto1 = new AutoDto(auto);
        System.out.println(autoDto1);
        return autoDto1;

    }

    @PutMapping(value = "/auto/edit")
    @ResponseBody
    public AutoDto processEditingAuto(@Valid AutoDto autoDto) throws JSONException {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userRepository.findUserByUsername(name);

        Auto auto = autoRepository.findAutoById(autoDto.getId());
        if(auto.getCompany().getId()!=userByEmail.getCompany().getId()) return null;

        auto.setName(autoDto.getName());
        auto.setCarNumber(autoDto.getCarNumber());
        auto.setType(autoDto.getType());
        auto.setFuelConsumption(autoDto.getFuelConsumption());
        autoRepository.save(auto);
        return new AutoDto(auto);
    }

    @DeleteMapping(value = "/auto/")
    @ResponseBody
    public  List<AutoDto> processRemoveAuto(@RequestBody String idS) throws JSONException {
        final Long id = Long.parseLong(idS);
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userRepository.findUserByUsername(name);
        Auto auto = autoRepository.findAutoById(id);
        if(userByEmail.getCompany().getId()!=auto.getCompany().getId()) return null;
        auto.setActive(false);
        autoRepository.save(auto);
        List<Auto> autos = autoRepository.findAllByCompanyAndActive(userByEmail.getCompany(),true);
        List<AutoDto> autoDtos = Odt.AutoListToDtoList(autos);
        return autoDtos;
    }


    private JSONObject getInvalidDataJsonMessage() throws JSONException {
        JSONObject json = new JSONObject();
        json.put("error", "invalid data");
        return json;
    }


}