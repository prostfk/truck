package com.itechart.trucking.stock.solrRepository;

import com.itechart.trucking.stock.solrEntity.SolrStock;
import org.springframework.data.repository.query.Param;
import org.springframework.data.solr.repository.Query;
import org.springframework.data.solr.repository.SolrCrudRepository;

import java.util.List;

public interface SolrStockRepository extends SolrCrudRepository<SolrStock, Long> {

    @Query("companyId: ?0 AND active: ?1 AND name: ?2*")
    List<SolrStock> findAllByCompanyIdAndActiveAndName(@Param("companyId") Long companyId, @Param("active") Boolean active, @Param("name") String name);

}
