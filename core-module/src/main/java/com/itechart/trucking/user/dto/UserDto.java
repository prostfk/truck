package com.itechart.trucking.user.dto;

import com.itechart.trucking.company.dto.CompanyDto;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.entity.UserRole;

import java.time.LocalDate;

public class UserDto {
    private Long id;
    private String username;
    private String email;
    private UserRole userRole;
    private LocalDate birthDay;

    private CompanyDto company;

    public UserDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.userRole = user.getUserRole();
/*        this.birthDay = user.getBirthDay();*/
    }

    public void setCompany(Company company) {
        this.company = new CompanyDto(company);
    }
}
