package com.itechart.trucking.webmodule;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan("com.itechart.*")
@EnableJpaRepositories
public class WebModuleApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebModuleApplication.class, args);
	}
}
