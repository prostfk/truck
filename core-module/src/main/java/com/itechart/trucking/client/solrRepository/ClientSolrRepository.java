package com.itechart.trucking.client.solrRepository;

import com.itechart.trucking.client.solrEntity.SolrClient;
import org.springframework.data.solr.repository.Query;
import org.springframework.data.solr.repository.SolrCrudRepository;

import java.util.List;

public interface ClientSolrRepository extends SolrCrudRepository<SolrClient, Long> {

    @Query(value = "name:*?0*")
    List<SolrClient> findByName(String name);

}
