package com.itechart.trucking.webmodule;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.itechart")
public class WebModuleApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebModuleApplication.class, args);
	}
}
