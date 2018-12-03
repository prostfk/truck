package com.itechart.trucking.cancellationAct.dto;

import lombok.Data;

@Data
public class CancellationStatisticDto {
    private int productAmmount = 0;
    private double productPrice;

    public void addProductAmmount(int productAmmount) {
        this.productAmmount += productAmmount;
    }

    public void addProductPrice(double productPrice) {
        this.productPrice += productPrice;
    }
}
