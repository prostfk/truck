package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.company.dto.CompanyDto;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.company.repository.CompanyRepository;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.stock.dto.StockDto;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.stock.repository.StockRepository;
import com.itechart.trucking.user.dto.UserDto;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.entity.UserRole;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.webmodule.model.util.EmailUtil;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.beans.factory.annotation.Value;
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
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.List;

@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@CrossOrigin
@RestController
@RequestMapping(value = "/api")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @GetMapping(value = "/users")
    public List<UserDto> findUsers() {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userRepository.findUserByUsername(name);
        List<User> usersByCompany = userByEmail.getCompany().getCompanyUsers();
        List<UserDto> userDtos = Odt.UserListToDtoList(usersByCompany);
        return userDtos;
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
                    userRepository.updateUser(userDto.getId(), userDto.getUsername(), userDto.getEmail(), passwordEncoder.encode(password), userDto.getUserRole().name(), userDto.getBirthDay());
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
    public Object saveUser(@Valid UserDto userDto, String password, String birthDay) throws JSONException {
        JSONObject json = new JSONObject();
        User userByUsername = userRepository.findUserByUsername(userDto.getUsername());
        if (userByUsername == null) {
            if (password.length() > 5 && password.length() < 20) {
                User admin = userRepository.findUserByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
                userRepository.saveUser(userDto.getUsername(), userDto.getEmail(), passwordEncoder.encode(password), userDto.getUserRole().name(), admin.getCompany().getId(), userDto.getBirthDay());
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
    public HttpStatus sendEmail(String email, String message, String type, @Value("${server.email}") String serverEmail, @Value("${server.password}") String serverPassword) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByUsername = userRepository.findUserByUsername(name);
        User byEmailAndCompany = userRepository.findUserByEmailAndCompany(email, userByUsername.getCompany());
        try {
            EmailUtil.sendMail(serverEmail,serverPassword,email,type,message);
            return HttpStatus.OK;
        } catch (Exception e) {
            e.printStackTrace();
            return HttpStatus.NOT_FOUND;
        }

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


    private JSONObject getInvalidDataJsonMessage() throws JSONException {
        JSONObject json = new JSONObject();
        json.put("error", "invalid data");
        return json;
    }


}