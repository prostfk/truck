package com.itechart.trucking;

import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.user.service.UserService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
public class TestUser {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testCreateUser() {
        userRepository.findAll().forEach(user -> System.out.println(user.getUsername()));
    }
}
