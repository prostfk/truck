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
    private String message = "<h1>Уважаемый %s!</h1><br/><h2>Поздравляем вас с %d-летием. Желаем всего классного вот так да круто очень</h2><br/><br/><h5>С уважением, колектив %s!!</h5>";

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
                List<User> usersByBirthDay = userRepository.customFindUsersByBirthDay(dateString);
                usersByBirthDay.forEach(user -> {
                    try {
                        int year = new Date().getYear() - user.getBirthDay().getYear();
                        EmailUtil.sendMail(email, password, user.getEmail(), "Happy birthday",
                                String.format(message,user.getUsername(),year,user.getCompany().getName())
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
