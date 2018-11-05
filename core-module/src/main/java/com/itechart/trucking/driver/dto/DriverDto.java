package com.itechart.trucking.driver.dto;

import com.itechart.trucking.company.dto.CompanyDto;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.user.dto.UserDto;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.waybill.dto.WaybillDto;
import com.itechart.trucking.waybill.entity.Waybill;
import lombok.Data;

import java.util.List;

@Data
public class DriverDto {
    private Long id;
    private String name;
    private String passportNumber;

    private UserDto user;
    private CompanyDto company; /*old name companyOfDriver*/

    private List<WaybillDto> waybills;

    public DriverDto(Driver driver) {
        this.id = driver.getId();
        this.name = driver.getName();
        this.passportNumber = driver.getPassportNumber();
    }

    public void setUser(User user) {
        this.user = new UserDto(user);
    }

    public void setCompany(Company company) {
        this.company = new CompanyDto(company);
    }

    public void setWaybills(List<Waybill> waybills) {
        this.waybills = Odt.WayBilToDtoList(waybills);
    }
}
