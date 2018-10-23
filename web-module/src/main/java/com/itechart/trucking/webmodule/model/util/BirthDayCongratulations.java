package com.itechart.trucking.webmodule.model.util;

import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@Component
public class BirthDayCongratulations {

    private static final Logger LOGGER = LoggerFactory.getLogger(BirthDayCongratulations.class);

    @Value("${server.email}")
    private String email;
    @Value("${server.password}")
    private String password;

    @Autowired
    private UserRepository userRepository;

    public void congratulate(){
        new Thread(() -> {
            while (true) {
                Date date = new Date();
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(date);
                SimpleDateFormat df = new SimpleDateFormat("MM-dd");
                String dateString = String.format("%%-%s", df.format(date));
                System.out.println(dateString);
                List<User> usersByBirthDay = Collections.emptyList();
                usersByBirthDay.forEach(user -> {
                    try {
                        EmailUtil.sendMail(email, password, user.getEmail(), "Happy birthday",
                                String.format("<h1>Dear, %s</h1><br/><h5>On your Happy Birthday. We wish you all Happiness to make your day amazing. We wish you all smiles to make the heart healthy. We wish you all friendshipTo share and care all the best for your Birthday!!</h5><br/><img src=\"https://www.retailmenot.com/blog/wp-content/uploads/2016/01/hero-Birthday-Freebies-You-Should-Know-About-960x500.jpg-1522690042.jpg\" alt=\"Birthday!!!\"/>", user.getUsername())
                        );
                    } catch (Exception e) {
                        LOGGER.warn("Email sending problem: ", e);
                    }
                });
                try {
                    Thread.sleep(86400000L);
                } catch (InterruptedException e) {
                    System.out.println("Program shutting down");
                }
            }
        }).start();
    }

}
