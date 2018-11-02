package com.itechart.trucking.company.dto;

import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.user.dto.UserDto;
import com.itechart.trucking.user.entity.User;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CompanyDto {

    private Long id;
    private String name;
    private int active;
    private String lockComment;
    private LocalDate lockDate;
    private UserDto lockerId;

    public CompanyDto(Company company) {
        this.id = company.getId();
        this.name = company.getName();
        this.active = company.getActive();
        this.lockComment = company.getLockComment();
/*        this.lockDate = company.getLockDate;*/
    }

    public void setLockerId(User lockerId) {
        this.lockerId = new UserDto(lockerId);
    }
}
