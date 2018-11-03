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
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
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

    @GetMapping(value = "/stocks")
    public List<StockDto> stocks() {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userRepository.findUserByUsername(name);
        return Odt.StockListToDtoList(stockRepository.findStockByCompanyAndActive(userByEmail.getCompany(), true));
    }

    @DeleteMapping(value = "/stocks")
    public List<StockDto> stockDelete(@RequestBody Long stockId) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userRepository.findUserByUsername(name);
        if (userByEmail == null) return null;
        Stock stock = stockRepository.findStockById(stockId);
        if (stock == null) return null;
        if (stock.getCompany().equals(userByEmail.getCompany())) {
            stock.setActive(false);
            stockRepository.save(stock);
        }
        List<Stock> stockByCompanyAndActive = stockRepository.findStockByCompanyAndActive(userByEmail.getCompany(), true);
        return Odt.StockListToDtoList(stockByCompanyAndActive);
    }


    @PostMapping(value = "/stocks")
    public boolean createStock(@ModelAttribute Stock stock) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userRepository.findUserByUsername(name);
        stock.setCompany(userByEmail.getCompany());
        return stockRepository.save(stock) != null;

    }

    @GetMapping(value = "/users")
    public List<UserDto> findUsers() {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userRepository.findUserByUsername(name);
        List<User> usersByCompany = userRepository.findUsersByCompany(userByEmail.getCompany());
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


    private JSONObject getInvalidDataJsonMessage() throws JSONException {
        JSONObject json = new JSONObject();
        json.put("error", "invalid data");
        return json;
    }


}
