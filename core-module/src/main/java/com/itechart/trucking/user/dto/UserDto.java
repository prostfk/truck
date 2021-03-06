package com.itechart.trucking.user.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itechart.trucking.company.dto.CompanyDto;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.user.entity.UserRole;
import lombok.Data;

import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;

@Data
public class UserDto {
    private Long id;
    @Size(min = 3, max = 20)
    private String username;
    @Size(min = 5, max = 60)
    private String email;
    private UserRole userRole;
    private Date birthDay;
    private String firstName;
    private String secondName;
    private String thirdName;
    private String country;
    private String city;
    private String street;
    private String houseNumber;
    private String flatNumber;
//    private LocalDate birthDay;
    private LocalDateTime reg_date;

    private CompanyDto company;

    public UserDto() {
    }

    public UserDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.userRole = user.getUserRole();
        this.birthDay = user.getBirthDay();
        this.firstName = user.getFirstName();
        this.secondName = user.getSecondName();
        this.thirdName = user.getThirdName();
        this.country = user.getCountry();
        this.city = user.getCity();
        this.street = user.getStreet();
        this.houseNumber = user.getHouseNumber();
        this.flatNumber = user.getFlatNumber();
        if(user.getReg_date()!=null) this.reg_date = user.getReg_date().toLocalDateTime();
    }

    public void setUserRole(String userRole) {
        this.userRole = UserRole.valueOf(userRole);
    }

    public void setUserRole(UserRole userRole) {
        this.userRole = userRole;
    }

    public void setCompany(Company company) {
        this.company = new CompanyDto(company);
    }

    public static Map<String, Object> toMap(UserDto userDto){
        ObjectMapper oMapper = new ObjectMapper();
        Map<java.lang.String, java.lang.Object> map = oMapper.convertValue(userDto, Map.class);
        return map;
    }
}
