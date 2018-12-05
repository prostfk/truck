package com.itechart.trucking.webmodule.model.dto;

import com.itechart.trucking.auto.statistics.AutoStatisticsDto;
import com.itechart.trucking.company.statistics.CompanyStatisticsDto;
import com.itechart.trucking.user.statistics.UserStatisticsDto;
import lombok.Data;

import java.util.List;

@Data
public class SysAdminStatistics {
    private List<UserStatisticsDto> userStatisticsDtos;
    private List<CompanyStatisticsDto> companyStatisticsDtos;
    private List<AutoStatisticsDto> autoStatisticsDtos;

    public SysAdminStatistics(List<UserStatisticsDto> userStatisticsDtos, List<CompanyStatisticsDto> companyStatisticsDtos, List<AutoStatisticsDto> autoStatisticsDtos) {
        this.userStatisticsDtos = userStatisticsDtos;
        this.companyStatisticsDtos = companyStatisticsDtos;
        this.autoStatisticsDtos = autoStatisticsDtos;
    }
}
