package com.itechart.trucking.odt;

import com.itechart.trucking.cancellationAct.dto.CancellationActDto;
import com.itechart.trucking.cancellationAct.entity.CancellationAct;
import com.itechart.trucking.order.dto.OrderDto;
import com.itechart.trucking.order.entity.Order;
import com.itechart.trucking.product.dto.ProductDto;
import com.itechart.trucking.product.entity.Product;
import com.itechart.trucking.routeList.dto.RouteListDto;
import com.itechart.trucking.routeList.entity.RouteList;
import com.itechart.trucking.waybill.dto.WaybillDto;
import com.itechart.trucking.waybill.entity.Waybill;

import java.util.ArrayList;
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

}
