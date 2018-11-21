package com.itechart.trucking.company.entity;

import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.cancellationAct.dto.CancellationStatisticDto;
import com.itechart.trucking.cancellationAct.entity.CancellationAct;
import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.odt.Odt;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.user.entity.User;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;
import java.sql.Date;
import java.time.LocalDate;
import java.time.Period;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Data
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Size(min = 2, max = 100)
    private String name;
    @Min(0)
    @Max(1)
    private int active;
    private String lockComment;
    private Date lockDate;

    @OneToOne
    @JoinColumn(name = "locker_id")
    private User lockerId;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "company")
    private List<User> companyUsers;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "company")
    private List<Client> companyClients;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "company")
    private List<Order> companyOrders;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "company")
    private List<Stock> companyStocks;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "company")
    private List<Driver> companyDrivers;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "company")
    private List<Auto> companyAutos;

    public Map getWorkersAmmount(){
        Map workersAmmount = new HashMap<String,Integer>();
        int ROLE_COMP_OWNER =0;
        int ROLE_ADMIN =0;
        int ROLE_DISPATCHER =0;
        int ROLE_MANAGER =0;
        int ROLE_DRIVER =0;
        for (User user:companyUsers) {
            switch (user.getUserRole()){
                case ROLE_COMP_OWNER:
                    ROLE_COMP_OWNER+=1;
                    break;
                case ROLE_ADMIN:
                    ROLE_ADMIN+=1;
                    break;
                case ROLE_DISPATCHER:
                    ROLE_DISPATCHER+=1;
                    break;
                case ROLE_MANAGER:
                    ROLE_MANAGER+=1;
                    break;
                case ROLE_DRIVER:
                    ROLE_DRIVER+=1;
                    break;
            }
        }
        workersAmmount.put("ROLE_COMP_OWNER",ROLE_COMP_OWNER);
        workersAmmount.put("ROLE_ADMIN",ROLE_ADMIN);
        workersAmmount.put("ROLE_DISPATCHER",ROLE_DISPATCHER);
        workersAmmount.put("ROLE_MANAGER",ROLE_MANAGER);
        workersAmmount.put("ROLE_DRIVER",ROLE_DRIVER);
        return workersAmmount;
    }

    public Map getOrderAcceptedAmmount(List<Order> lastOrders){
        Map month = new HashMap<String,Integer>();
        month.put(LocalDate.now().minus(Period.ofMonths(5)).getMonthValue(),0);
        month.put(LocalDate.now().minus(Period.ofMonths(4)).getMonthValue(),0);
        month.put(LocalDate.now().minus(Period.ofMonths(3)).getMonthValue(),0);
        month.put(LocalDate.now().minus(Period.ofMonths(2)).getMonthValue(),0);
        month.put(LocalDate.now().minus(Period.ofMonths(1)).getMonthValue(),0);
        month.put(LocalDate.now().getMonthValue(),0);


        LocalDate dateFrom = LocalDate.now().minus(Period.ofMonths(6));

        for (Order order:lastOrders) {
            LocalDate dateAccepted = Odt.convertToLocalDateViaInstant(order.getDateAccepted());
            if(dateAccepted.isAfter(dateFrom) && dateAccepted.isBefore(LocalDate.now())){
                if(month.containsKey(dateAccepted.getMonthValue()))
                    month.put(dateAccepted.getMonthValue(),(Integer)month.get(dateAccepted.getMonthValue()) +1);
                else month.put(dateAccepted.getMonthValue(),1);
            }
        }

        return month;
    }

    public Map getOrderExcutedAmmount(List<Order> lastOrders){
        Map month = new HashMap<String,Integer>();
        month.put(LocalDate.now().minus(Period.ofMonths(5)).getMonthValue(),0);
        month.put(LocalDate.now().minus(Period.ofMonths(4)).getMonthValue(),0);
        month.put(LocalDate.now().minus(Period.ofMonths(3)).getMonthValue(),0);
        month.put(LocalDate.now().minus(Period.ofMonths(2)).getMonthValue(),0);
        month.put(LocalDate.now().minus(Period.ofMonths(1)).getMonthValue(),0);
        month.put(LocalDate.now().getMonthValue(),0);


        LocalDate dateFrom = LocalDate.now().minus(Period.ofMonths(6));

        for (Order order:lastOrders) {
            LocalDate dateExecuted = Odt.convertToLocalDateViaInstant(order.getDateExecuted());
            if(dateExecuted.isAfter(dateFrom) && dateExecuted.isBefore(LocalDate.now())){
                if(month.containsKey(dateExecuted.getMonthValue()))
                    month.put(dateExecuted.getMonthValue(),(Integer)month.get(dateExecuted.getMonthValue()) +1);
                else month.put(dateExecuted.getMonthValue(),1);
            }
        }

        return month;
    }

    public Map getOrderFailedAmmount(List<Order> lastOrders){
        Map month = new HashMap<String, CancellationStatisticDto>();
        month.put(LocalDate.now().minus(Period.ofMonths(5)).getMonthValue(),new CancellationStatisticDto());
        month.put(LocalDate.now().minus(Period.ofMonths(4)).getMonthValue(),new CancellationStatisticDto());
        month.put(LocalDate.now().minus(Period.ofMonths(3)).getMonthValue(),new CancellationStatisticDto());
        month.put(LocalDate.now().minus(Period.ofMonths(2)).getMonthValue(),new CancellationStatisticDto());
        month.put(LocalDate.now().minus(Period.ofMonths(1)).getMonthValue(),new CancellationStatisticDto());
        month.put(LocalDate.now().getMonthValue(),new CancellationStatisticDto());


        LocalDate dateFrom = LocalDate.now().minus(Period.ofMonths(6));

        for (Order order:lastOrders){
            LocalDate dateExecuted = Odt.convertToLocalDateViaInstant(order.getDateExecuted());
            if(dateExecuted.isAfter(dateFrom) && dateExecuted.isBefore(LocalDate.now())){
                CancellationAct cancellationAct = order.getConsignment().getCancellationAct();
                if(cancellationAct==null) continue;
                LocalDate dateofAct = Odt.convertToLocalDateViaInstant(cancellationAct.getDate());

                CancellationStatisticDto cancellationStatisticDto = (CancellationStatisticDto) month.get(dateExecuted.getMonthValue());
                cancellationStatisticDto.addProductAmmount(cancellationAct.getAmount());
                cancellationStatisticDto.addProductPrice(cancellationAct.getPrice());

                month.put(dateExecuted.getMonthValue(),cancellationStatisticDto);
            }
        }

        return month;
    }


    public Company() {
    }
    public Company(@Size(min = 2, max = 100) String name, @Min(0) @Max(1) int active) {
        this.name = name;
        this.active = active;
    }

    @Override
    public String toString() {
        return "Company{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", active=" + active +
                ", lockComment='" + lockComment + '\'' +
                ", lockDate=" + lockDate +
                '}';
    }
}
