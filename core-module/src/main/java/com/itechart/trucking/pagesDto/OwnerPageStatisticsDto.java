package com.itechart.trucking.pagesDto;

import com.itechart.trucking.cancellationAct.dto.CancellationStatisticDto;
import lombok.Data;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Data
public class OwnerPageStatisticsDto {
    Map acceptedAmmount = new HashMap<String,Integer>();
    Map executedAmmount = new HashMap<String,Integer>();
    Map workersAmmount = new HashMap<String,Integer>();

    Map cancellationActAmmount = new HashMap<String, CancellationStatisticDto>();
    int totalItemsFailed = 0;
    float totalPricaeFaile = 0;

    public void setTotalFailed() {
        Iterator<Map.Entry<String, CancellationStatisticDto>> iterator = cancellationActAmmount.entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<String, CancellationStatisticDto> entry = iterator.next();
            totalItemsFailed += entry.getValue().getProductAmmount();
            totalPricaeFaile += entry.getValue().getProductPrice();
        }
    }
}
