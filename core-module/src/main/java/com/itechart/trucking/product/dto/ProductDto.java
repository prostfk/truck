package com.itechart.trucking.product.dto;

import com.itechart.trucking.cancellationAct.dto.CancellationActDto;
import com.itechart.trucking.cancellationAct.entity.CancellationAct;
import com.itechart.trucking.consignment.dto.ConsignmentDto;
import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.product.entity.Product;
import com.itechart.trucking.product.entity.ProductState;
import lombok.Data;

import javax.validation.constraints.Min;

@Data
public class ProductDto {
    private Long id;
    private String name;
    private Integer status;
    private String description;
    private Double price;
    @Min(0)
    private Integer count;
    @Min(0)
    private Integer cancelledCount;

    private CancellationActDto cancellationAct;
    private ConsignmentDto consignment;

    public ProductDto(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.status = product.getStatus();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.count = product.getCount();
        this.cancelledCount = product.getCancelledCount();
    }

    public void setCancellationAct(CancellationAct cancellationAct) {
        this.cancellationAct = new CancellationActDto(cancellationAct);
    }

    public void setConsignment(Consignment consignment) {
        this.consignment = new ConsignmentDto(consignment);
    }
}
