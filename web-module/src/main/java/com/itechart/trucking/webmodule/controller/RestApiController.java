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
import org.springframework.security.access.annotation.Secured;
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
@RequestMapping(value = "/api")
public class RestApiController {


    @Secured("ROLE_ADMIN")
    @GetMapping(value = "/checkSecure")//test
    public String checkSecure() throws JSONException {
        System.out.println("CHECK SECURE METHOD");
        System.out.println("Principal:" + SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        System.out.println("Authorities:" + SecurityContextHolder.getContext().getAuthentication().getAuthorities());
        System.out.println("Credentials:" + SecurityContextHolder.getContext().getAuthentication().getCredentials());
        System.out.println("Details:" + SecurityContextHolder.getContext().getAuthentication().getDetails());
        System.out.println("Is Authenticated:" + SecurityContextHolder.getContext().getAuthentication().isAuthenticated());
        JSONObject json = new JSONObject();
        json.put("message", "Success");
        json.put("username",SecurityContextHolder.getContext().getAuthentication().getName());
        System.out.println(json);
        return json.toString();
    }

//    @PostMapping(value = "/registration")//redo for rest
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


}
