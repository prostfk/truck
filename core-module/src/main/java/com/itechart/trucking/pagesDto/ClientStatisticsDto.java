package com.itechart.trucking.pagesDto;

import com.itechart.trucking.client.dto.ClientDto;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class ClientStatisticsDto {
    Map executedAmmount = new HashMap<String,Integer>();
    ClientDto clientDto;
}
