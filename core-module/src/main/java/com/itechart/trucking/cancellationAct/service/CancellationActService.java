package com.itechart.trucking.cancellationAct.service;

import com.itechart.trucking.cancellationAct.entity.CancellationAct;
import com.itechart.trucking.cancellationAct.repository.CancellationActRepository;
import com.itechart.trucking.consignment.entity.Consignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import java.util.List;

@Service
public class CancellationActService {

    @Autowired
    private CancellationActRepository cancellationActRepository;

    public CancellationAct findCancellationActById(Long id) {
        return cancellationActRepository.findCancellationActById(id);
    }

    public List<CancellationAct> findCancellationActsByDateAfter(String date) {
        return cancellationActRepository.findCancellationActsByDateAfter(date);
    }

    public List<CancellationAct> findCancellationActsByDateBefore(String date) {
        return cancellationActRepository.findCancellationActsByDateBefore(date);
    }

    public List<CancellationAct> findCancellationActsByPrice(int price) {
        return cancellationActRepository.findCancellationActsByPrice(price);
    }

    public CancellationAct findCancellationActByConsignment(Consignment consignment) {
        return cancellationActRepository.findCancellationActByConsignment(consignment);
    }

    public CancellationAct save(@Valid CancellationAct cancellationAct) {
        return cancellationActRepository.save(cancellationAct);
    }

    public CancellationAct update(@Valid CancellationAct cancellationAct) {
        return cancellationActRepository.save(cancellationAct);
    }

    public void remove(CancellationAct cancellationAct) {
        cancellationActRepository.delete(cancellationAct);
    }


}
