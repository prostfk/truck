package com.itechart.trucking.user.dto;

import com.itechart.trucking.company.dto.CompanyDto;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.entity.UserRole;
import lombok.Data;

import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.util.Date;

@Data
public class UserDto {
    private Long id;
    @Size(min = 3, max = 20)
    private String username;
    @Size(min = 5, max = 60)
    private String email;
    private UserRole userRole;
    private Date birthDay;
//    private LocalDate birthDay;

    private CompanyDto company;

    public UserDto() {
    }

    public UserDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.userRole = user.getUserRole();
        this.birthDay = user.getBirthDay();
    }

    public void setCompany(Company company) {
        this.company = new CompanyDto(company);
    }
}
