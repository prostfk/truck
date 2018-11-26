package com.itechart.trucking.user.statistics;

import com.itechart.trucking.user.entity.UserRole;
import lombok.Data;

@Data
public class UserStatisticsDto {
    public UserRole userRole;
    public Long count;

    public UserStatisticsDto(UserRole userRole, Long count) {
        this.userRole = userRole;
        this.count = count;
    }
}
