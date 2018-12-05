package com.itechart.trucking.webmodule.model.util;

import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.stringtemplate.v4.ST;

import java.io.Console;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

@Component
public class BirthDayCongratulations {

    private static final Logger LOGGER = LoggerFactory.getLogger(BirthDayCongratulations.class);

    @Value("${server.email}")
    private String email;
    @Value("${server.password}")
    private String password;
    private ST st;
    private String message;

    @Autowired
    private UserRepository userRepository;

    public BirthDayCongratulations() {
        try {
            st = new ST(FileUtil.readFile(new ClassPathResource("birthday.stg").getFile().getAbsolutePath()));
        } catch (IOException e) {
            LOGGER.error("FILE WITH BIRTHDAY WISHES NOT FOUND! ", e);
        }
    }

    public void congratulate(){
        new Thread(() -> {
            while (true) {
                Date date = new Date();
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(date);calendar.get(Calendar.YEAR);
                SimpleDateFormat df = new SimpleDateFormat("MM-dd");
                String dateString = String.format("%%-%s", df.format(date));
                List<User> usersByBirthDay = userRepository.customFindUsersByBirthDay(dateString);
                usersByBirthDay.forEach(user -> {
                    try {
                        int year = new Date().getYear() - user.getBirthDay().getYear();
                        st.add("name", getNameOfUser(user));
                        st.add("year", year);
                        st.add("companyName", user.getCompany().getName());
                        message = st.render(new Locale("ru", "ru"));
                        EmailUtil.sendMail(email, password, user.getEmail(), "Поздравляем!",message);
                    } catch (Exception e) {
                        e.printStackTrace();
                        LOGGER.warn("Email sending problem: ", e);
                    }
                });
                try {
                    Thread.sleep(86400000L);
                } catch (InterruptedException e) {
                    LOGGER.warn("Program was interrupt");
                }
            }
        }).start();
    }

    private String getNameOfUser(User user){
        return user.getFirstName() != null && !user.getFirstName().equals("") ? user.getFirstName() : user.getUsername();
    }

}