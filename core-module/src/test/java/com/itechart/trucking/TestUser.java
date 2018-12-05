package com.itechart.trucking;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.entity.UserRole;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.user.service.UserService;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.junit4.SpringRunner;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Collections;

import static org.mockito.Mockito.when;

//@RunWith(MockitoJUnitRunner.class)
public class TestUser {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testFindAll(){
        when(userRepository.findAll()).thenReturn(new ArrayList<>());
    }

    @Test
    public void testFindUserByUsername(){
        when(userService.findUserByUsername("roman")).thenReturn(new User("roman", "zxccxz"));
    }

    @Test
    public void testFindUserByEmailAndCompany(){
        when(userService.findUserByEmailAndCompany("prostrmk@gmail.com", new Company("comp1",1)))
                .thenReturn(new User(
                        "prostrmk@gmail.com","zxccxz"
                ));
    }

    @Test
    public void testFindUserById(){
        when(userService.findUserById(1L)).thenReturn(new User("roman","zxccxz","prostrmk@gmail.com", UserRole.ROLE_USER,new Company(),new Date(new java.util.Date().getTime())));
    }

    @Test
    public void testFindAllByCompany() {
        when(userService.findAllByCompany(new Company("comp1", 1), Pageable.unpaged()))
                .thenReturn(new PageImpl<>(Collections.emptyList()));
    }
}
