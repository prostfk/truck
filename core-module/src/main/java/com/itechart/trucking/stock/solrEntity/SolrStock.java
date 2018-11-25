package com.itechart.trucking.stock.solrEntity;

import com.itechart.trucking.stock.entity.Stock;
import lombok.Data;
import org.apache.solr.client.solrj.beans.Field;
import org.springframework.data.solr.core.mapping.SolrDocument;

import javax.persistence.Id;


@SolrDocument(collection = "stock")
@Data
public class SolrStock {

    @Id
    private Long id;
    @Field
    private String address;
    @Field
    private String name;
    @Field
    private Boolean active;
    @Field
    private Double lng;
    @Field
    private Double lat;
    @Field
    private Long companyId;

    public SolrStock() {
    }

    public SolrStock(Long id, String address, String name, Boolean active, Double lng, Double lat, Long companyId) {
        this.id = id;
        this.address = address;
        this.name = name;
        this.active = active;
        this.lng = lng;
        this.lat = lat;
        this.companyId = companyId;
    }

    public static SolrStock solrStockFromStock(Stock stock){
        return new SolrStock(stock.getId(),stock.getAddress(),stock.getName(),stock.getActive(),stock.getLng(),stock.getLat(),stock.getCompany().getId());
    }

}
