package com.itechart.trucking.company.statistics;

import lombok.Data;

@Data
public class CompanyStatisticsDto {
    public int isBlocked;
    public Long count;


    public CompanyStatisticsDto(int blocked,Long count) {
        this.isBlocked = blocked;
        this.count = count;
    }
}
