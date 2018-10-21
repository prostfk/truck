package com.itechart.trucking.webmodule.controller;

import com.itechart.trucking.token.entity.Token;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.entity.UserRole;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.webmodule.config.JwtGen;
import com.itechart.trucking.webmodule.model.util.TokenUtil;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.MultiValueMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping(value = "/rest")
public class RestApiController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtGen jwtGen;

    @GetMapping(value = "/users")
    public Object getUsers() {
        return userRepository.findAll();
    }

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping(value = "/index")
    public HashMap<String, Object> index() {

        HashMap<String, Object> map = new HashMap<>();
        map.put("message", "Authenticated and authorised successfully !");
        map.put("result", "success!");
        return map;
    }

    @PostMapping(value = "/token")
    public String getToken(@ModelAttribute final User user) throws JSONException {
        JSONObject json = new JSONObject();
        String generate = jwtGen.generate(user);
        if (generate == null) {
            json.put("status", 404);
            json.put("message", "Invalid data");
        } else {
            json.put("status", 200);
            json.put("token", generate);
        }
        return json.toString();

    }


//    @PostMapping(value = "/registration")
//    public Object addNewUserToDatabase(@Valid User user, BindingResult bindingResult){
//        if (bindingResult.hasErrors()){
//            return throwError("Check your data");
//        }
//        User userByUsernameOrEmail = userRepository.findUserByUsernameOrEmail(user.getUsername(), user.getEmail());
//        if (userByUsernameOrEmail!=null){
//            if (user.getEmail().equals(userByUsernameOrEmail.getEmail())){
//                return throwError("User with such email already exists");
//            }else if (user.getUsername().equals(userByUsernameOrEmail.getUsername())){
//                return throwError("User with such username already exists");
//            }
//        }
//        user.setUserRole(UserRole.ROLE_USER);
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        return userRepository.save(user);
//    }

    @GetMapping("/checkRole")
    public Map<String, String> checkRole() {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User userByEmail = userRepository.findUserByEmail(name);
        Map<String, String> map = new HashMap<>();
        map.put("role", userByEmail != null ? userByEmail.getUserRole().name() : UserRole.ROLE_USER.name());
        return map;
    }

//    @PostMapping(value = "/login")
//    public Object login(@ModelAttribute User user, HttpServletRequest request) throws JSONException {
//        User base = userRepository.findUserByEmail(user.getEmail());
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        System.out.println(user);
//        System.out.println(base);
//        if (user.getEmail().equals(base.getEmail()) && user.getPassword().equals(base.getPassword())) {
//            String token = TokenUtil.generateToken(50);
//            request.getSession().setAttribute("token", token);
//            return new Token(user.getEmail(), token).toString();
//        } else {
//            JSONObject json = new JSONObject();
//            json.put("error", "Incorrect data");
//            return json.toString();
//        }
//    }

    @GetMapping(value = "/user")
    public User f() {
        return userRepository.findById(1L).get();
    }

    private Map<String, String> throwError(String message) {
        Map<String, String> map = new HashMap<>();
        map.put("error", message);
        return map;
    }

}
