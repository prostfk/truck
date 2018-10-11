package com.itechart.trucking.cancellationAct.repository;

import com.itechart.trucking.cancellationAct.entity.CancellationAct;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CancellationActRepository extends CrudRepository<CancellationAct, Long> {

    CancellationAct findCancellationActById(Long id);
    List<CancellationAct> findCancellationActsByDateAfter(String date);
    List<CancellationAct> findCancellationActsByDateBefore(String date);
    List<CancellationAct> findCancellationActsByPrice(int price);


}
