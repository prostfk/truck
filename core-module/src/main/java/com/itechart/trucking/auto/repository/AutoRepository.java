package com.itechart.trucking.auto.repository;


import com.itechart.trucking.auto.entity.Auto;
import org.springframework.data.repository.CrudRepository;

public interface AutoRepository extends CrudRepository<Auto, Long> {

    Auto findAutoById(Long id);
}
