package com.itechart.trucking.user.service;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.driver.repository.DriverRepository;
import com.itechart.trucking.user.dto.UserDto;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.entity.UserRole;
import com.itechart.trucking.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.json.JSONException;
import org.json.JSONObject;

import javax.validation.Valid;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Clock;
import java.time.LocalDateTime;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DriverRepository driverRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Page<User> findAllByCompany(Company company, Pageable pageable){
        return userRepository.findAllByCompany(company, pageable);
    }

    public JSONObject updateUser(UserDto userDto, User userByUsername, JSONObject json, String password) throws JSONException {

        if (userByUsername == null || userRepository.findUserByUsername(userDto.getUsername())!=null) {
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

        return json;
    }

    public Object saveUser(UserDto userDto, String password, String passport, String birthDay) throws JSONException {
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


    public User findUserByUsername(String name) {
        return userRepository.findUserByUsername(name);
    }
}
