package com.itechart.trucking.pagesDto;

import lombok.Data;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class OwnerPageStatisticsDto {
    Map acceptedAmmount = new HashMap<String,Integer>();
    Map executedAmmount = new HashMap<String,Integer>();
    Map workersAmmount = new HashMap<String,Integer>();
}
