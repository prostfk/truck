package com.itechart.trucking.client.solrEntity;

import com.itechart.trucking.client.entity.Client;
import lombok.Data;
import org.apache.solr.client.solrj.beans.Field;
import org.springframework.data.annotation.Id;
import org.springframework.data.solr.core.mapping.SolrDocument;

@SolrDocument(collection = "client")
@Data
public class SolrClient {

    @Id
    private Long id;
    @Field
    private String name;
    @Field
    private String type;
    @Field
    private Long clientOwner;

    public SolrClient() {
    }

    public SolrClient(Long id, String name, String type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }

    public static SolrClient solrClientFromClient(Client client){
        return new SolrClient(client.getId(),client.getName(),client.getType());
    }



}
