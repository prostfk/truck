package com.itechart.trucking.waybill.dto;

import com.itechart.trucking.company.dto.CompanyDto;
import com.itechart.trucking.user.dto.UserDto;
import lombok.Data;

@Data
public class WaybillSocketUpdateDto {
    private Long updaterUser;
    private String updaterUserName;
    private String orderName;
    private Long companyId;
    private WaybillDto waybillDto;
}
