package com.itechart.trucking.auto.dto;

import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.company.dto.CompanyDto;
import com.itechart.trucking.company.entity.Company;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.waybill.dto.WaybillDto;
import com.itechart.trucking.waybill.entity.Waybill;
import lombok.Data;

import java.util.List;

@Data
public class AutoDto {
    private Long id;
    private String type;
    private Integer fuelConsumption;
    private String name;
    private String carNumber;

    private CompanyDto company;
    private List<WaybillDto> waybills;

    public AutoDto(Auto auto) {
        this.id = auto.getId();
        this.type = auto.getType();
        this.fuelConsumption = auto.getFuelConsumption();
        this.name = auto.getName();
        this.carNumber = auto.getCarNumber();
    }

    public void setCompany(Company company) {
        this.company = new CompanyDto(company);
    }

    public void setWaybills(List<Waybill> waybills) {
        this.waybills = Odt.WayBiltoDtoList(waybills);
    }
}
