package com.itechart.trucking.webmodule.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
@ComponentScan("com.itechart.*")
@EnableGlobalMethodSecurity(securedEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Qualifier("userDetailsService")
    @Autowired
    private UserDetailsService userService;

    @Autowired
    public void registerGlobalAuthentication(AuthenticationManagerBuilder auth) throws Exception{
        auth.userDetailsService(userService).passwordEncoder(passwordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .authorizeRequests()
                .anyRequest().permitAll()
                .and();
        http.formLogin()
                .loginPage("/auth")
                .loginProcessingUrl("/auth")
                .failureUrl("/auth?error")
                .usernameParameter("inputEmail")
                .passwordParameter("inputPassword")
                .permitAll();
        http.logout()
                .permitAll()
                .logoutUrl("/logout")
                .logoutSuccessUrl("/")
                .invalidateHttpSession(true);
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsServiceImpl userDetailsService(){
        return new UserDetailsServiceImpl();
    }

}
