package com.itechart.trucking.auto.repository;


import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.company.entity.Company;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface AutoRepository extends CrudRepository<Auto, Long> {

    Auto findAutoById(Long id);
    List<Auto> findAllByCompanyAndActive(Company company,Boolean active);
}
