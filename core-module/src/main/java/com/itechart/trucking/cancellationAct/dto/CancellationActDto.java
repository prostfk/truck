package com.itechart.trucking.cancellationAct.dto;

import com.itechart.trucking.cancellationAct.entity.CancellationAct;
import com.itechart.trucking.consignment.dto.ConsignmentDto;
import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.product.dto.ProductDto;
import com.itechart.trucking.product.entity.Product;
import lombok.Data;

import java.sql.Date;

@Data
public class CancellationActDto {
    private Long id;
    private Date date;
    private Integer amount;
    private Double price;

    private ConsignmentDto consignment;
    private ProductDto product;

    public CancellationActDto(CancellationAct cancellationAct) {
        if (cancellationAct == null) return;
        this.id = cancellationAct.getId();
        this.date = cancellationAct.getDate();
        this.amount = cancellationAct.getAmount();
        this.price = cancellationAct.getPrice();
    }

    public void setConsignment(Consignment consignment) {
        this.consignment = new ConsignmentDto(consignment);
    }

    public void setProduct(Product product) {
        this.product = new ProductDto(product);
    }
}
