package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.company.repository.CompanyRepository;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.stock.repository.StockRepository;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.entity.UserRole;
import com.itechart.trucking.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
import java.util.List;

@PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_DISPATHCER')")
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

    @PostMapping(value = "/admin/saveUser")
    public Object saveNewUser(User user){
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByUsername = userRepository.findUserByUsername(name);
        user.setCompany(userByUsername.getCompany());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User save = userRepository.save(user);
        System.out.println(save);
        return save;
    }

    @GetMapping(value = "/getCompanyUsers")
    public List<User> findUsersByCompany(){
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByUsername = userRepository.findUserByUsername(name);
        return userRepository.findUsersByCompany(userByUsername.getCompany());
    }

    @GetMapping(value = "/stocks")
    @ResponseBody
    public List<Stock> stocks() {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userRepository.findUserByUsername(name);
        return stockRepository.findStocksByCompany(userByEmail.getCompany());
    }

    @RequestMapping(value = "/stocks",method = RequestMethod.POST)
    public boolean createStock(@ModelAttribute Stock stock){
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userRepository.findUserByUsername(name);
        stock.setCompany(userByEmail.getCompany());
        stockRepository.save(stock);
        return true;
    }

    @GetMapping(value = "/users")
    @ResponseBody
    public List<User> findUsers() {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userRepository.findUserByUsername(name);
        return userRepository.findUsersByCompany(userByEmail.getCompany());
    }

    @PostMapping(value = "/editCompany")
    @ResponseBody
    public Object processEditingCompany(@Valid Company company, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "{error: 'Check your data'}";
        }
        return companyRepository.save(company);
    }

    @PostMapping(value = "/editUser/{id}")
    @ResponseBody
    public Object processEditingUser(@PathVariable Long id, @Valid User user, BindingResult result) {
        user.setId(id);
        if (result.hasErrors()) {
            return "{error: 'Check your data'}";
        }
        return userRepository.save(user);
    }

    @PostMapping(value = "/registerCompany")
    public Object processRegisteringCompany(@Valid Company company, BindingResult bindingResult){
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findUserByEmail(name);
        if (user.getCompany() == null) {
            if (!bindingResult.hasErrors()){
                @Valid Company save = companyRepository.save(company);
                user.setCompany(save);
                userRepository.save(user);
            }
        }else{
            return HttpStatus.LOCKED;
        }
        return "redirect:/companyPage";

    }





}
