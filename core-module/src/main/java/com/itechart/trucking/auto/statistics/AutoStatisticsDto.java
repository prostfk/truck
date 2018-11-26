package com.itechart.trucking.auto.statistics;

import lombok.Data;

@Data
public class AutoStatisticsDto {
    private Boolean isActive;
    private Long ammount;

    public AutoStatisticsDto(Boolean isActive, Long ammount) {
        this.isActive = isActive;
        this.ammount = ammount;
    }
}
