package com.itechart.trucking.webmodule;

import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.repository.UserRepository;
import com.itechart.trucking.webmodule.controller.MainController;
import com.itechart.trucking.webmodule.model.util.BirthDayCongratulations;
import com.itechart.trucking.webmodule.model.util.EmailUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import javax.annotation.PostConstruct;
import java.sql.Date;
import java.util.List;

@SpringBootApplication
@ComponentScan("com.itechart")
@EntityScan("com.itechart")
@EnableJpaRepositories("com.itechart")
public class WebModuleApplication {


    public static void main(String[] args) {
        SpringApplication.run(WebModuleApplication.class, args);
    }


}
