package com.itechart.trucking.odt;

import com.itechart.trucking.auto.dto.AutoDto;
import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.cancellationAct.dto.CancellationActDto;
import com.itechart.trucking.cancellationAct.entity.CancellationAct;
import com.itechart.trucking.client.dto.ClientDto;
import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.driver.dto.DriverDto;
import com.itechart.trucking.driver.entity.Driver;
import com.itechart.trucking.order.dto.OrderDto;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.product.dto.ProductDto;
import com.itechart.trucking.product.entity.Product;
import com.itechart.trucking.routeList.dto.RouteListDto;
import com.itechart.trucking.routeList.entity.RouteList;
import com.itechart.trucking.stock.dto.StockDto;
import com.itechart.trucking.stock.entity.Stock;
import com.itechart.trucking.user.dto.UserDto;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.waybill.dto.WaybillDto;
import com.itechart.trucking.waybill.entity.Waybill;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/*Object Type Definition*/
public class Odt {

    public static List<WaybillDto> WayBiltoDtoList(List<Waybill> waybills){
        if(waybills==null) return null;
        List<WaybillDto> waybillDtos = new ArrayList<>();
        for (Waybill waybill:waybills) {
            WaybillDto waybillDto = new WaybillDto(waybill);
            waybillDtos.add(waybillDto);
        }
        return waybillDtos;
    }

    public static List<OrderDto> OrdertoDtoList(List<Order> orders){
        if(orders==null) return null;
        List<OrderDto> orderDtos = new ArrayList<>();
        for (Order order:orders) {
            OrderDto orderDto = new OrderDto(order);
            orderDtos.add(orderDto);
        }
        return orderDtos;
    }

    public static List<ProductDto> ProducttoDtoList(List<Product> products){
        if(products==null) return null;
        List<ProductDto> productDtos = new ArrayList<>();
        for (Product product:products) {
            ProductDto productDto = new ProductDto(product);
            productDtos.add(productDto);
        }
        return productDtos;
    }

    public static List<CancellationActDto> CancellationActtoDtoList(List<CancellationAct> cancellationActs){
        if(cancellationActs==null) return null;
        List<CancellationActDto> cancellationActDtos = new ArrayList<>();
        for (CancellationAct cancellationAct:cancellationActs) {
            CancellationActDto cancellationActDto = new CancellationActDto(cancellationAct);
            cancellationActDtos.add(cancellationActDto);
        }
        return cancellationActDtos;
    }

    public static List<RouteListDto> RouteListtoDtoList(List<RouteList> routeLists){
        if(routeLists==null) return null;
        List<RouteListDto> routeListDtos = new ArrayList<>();
        for (RouteList routeList:routeLists) {
            RouteListDto routeListDto = new RouteListDto(routeList);
            routeListDtos.add(routeListDto);
        }
        return routeListDtos;
    }

    public static List<UserDto> UserListtoDtoList(List<User> userList){
        if(userList==null) return null;
        List<UserDto> userDtoList = new ArrayList<>();
        for (User user:userList) {
            UserDto userDto = new UserDto(user);
            userDtoList.add(userDto);
        }
        return userDtoList;
    }

    public static List<ClientDto> ClientListtoDtoList(List<Client> noneDtoList){
        if(noneDtoList==null) return null;
        List<ClientDto> newDtoList = new ArrayList<>();
        for (Client element:noneDtoList) {
            ClientDto newTypedElemnt = new ClientDto(element);
            newDtoList.add(newTypedElemnt);
        }
        return newDtoList;
    }

    public static List<StockDto> StockListtoDtoList(List<Stock> noneDtoList){
        if(noneDtoList==null) return null;
        List<StockDto> newDtoList = new ArrayList<>();
        for (Stock element:noneDtoList) {
            StockDto newTypedElemnt = new StockDto(element);
            newDtoList.add(newTypedElemnt);
        }
        return newDtoList;
    }

    public static List<DriverDto> DriverListtoDtoList(List<Driver> noneDtoList){
        if(noneDtoList==null) return null;
        List<DriverDto> newDtoList = new ArrayList<>();
        for (Driver element:noneDtoList) {
            DriverDto newTypedElemnt = new DriverDto(element);
            newDtoList.add(newTypedElemnt);
        }
        return newDtoList;
    }

    public static List<AutoDto> AutoListtoDtoList(List<Auto> noneDtoList){
        if(noneDtoList==null) return null;
        List<AutoDto> newDtoList = new ArrayList<>();
        for (Auto element:noneDtoList) {
            AutoDto newTypedElemnt = new AutoDto(element);
            newDtoList.add(newTypedElemnt);
        }
        return newDtoList;
    }

    public static LocalDate convertToLocalDateViaInstant(Date dateToConvert) {
        if(dateToConvert==null) return null;
        return new java.sql.Date(dateToConvert.getTime()).toLocalDate();
    }

}
