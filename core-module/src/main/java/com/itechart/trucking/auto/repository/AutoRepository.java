package com.itechart.trucking.auto.repository;


import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.auto.statistics.AutoStatisticsDto;
import com.itechart.trucking.company.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface AutoRepository extends CrudRepository<Auto, Long> {

    Auto findAutoById(Long id);

    List<Auto> findAllByCompanyAndActive(Company company, Boolean active);

    Page<Auto> findAllByCompanyAndActive(Company company, Boolean active, Pageable pageable);

    @Query(value = "SELECT new com.itechart.trucking.auto.statistics.AutoStatisticsDto(a.active,count(a)) from Auto a group by a.active")
    List<AutoStatisticsDto> getAutoStatistics();

}
