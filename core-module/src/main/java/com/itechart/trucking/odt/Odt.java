package com.itechart.trucking.odt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itechart.trucking.auto.dto.AutoDto;
import com.itechart.trucking.auto.entity.Auto;
import com.itechart.trucking.cancellationAct.dto.CancellationActDto;
import com.itechart.trucking.cancellationAct.entity.CancellationAct;
import com.itechart.trucking.client.dto.ClientDto;
import com.itechart.trucking.client.entity.Client;
import com.itechart.trucking.client.solrEntity.SolrClient;
import com.itechart.trucking.company.dto.CompanyDto;
import com.itechart.trucking.company.entity.Company;
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
import com.itechart.trucking.stock.solrEntity.SolrStock;
import com.itechart.trucking.user.dto.UserDto;
import com.itechart.trucking.user.entity.User;
import com.itechart.trucking.waybill.dto.WaybillDto;
import com.itechart.trucking.waybill.entity.Waybill;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/*Object Type Definition*/
public class Odt {

    public static <T, R> List<R> convertLists(List<T> objects, Function<T, R> mapper) {
        return objects.stream()
                .map(mapper)
                .collect(Collectors.toList());
    }

    public static List<WaybillDto> WayBilToDtoList(List<Waybill> waybills) {
        if (waybills == null) return null;
        List<WaybillDto> waybillDtos = new ArrayList<>();
        for (Waybill waybill : waybills) {
            WaybillDto waybillDto = new WaybillDto(waybill);
            waybillDtos.add(waybillDto);
        }
        return waybillDtos;
    }

    public static List<OrderDto> OrderToDtoList(List<Order> orders) {
        if (orders == null) return null;
        List<OrderDto> orderDtos = new ArrayList<>();
        for (Order order : orders) {
            OrderDto orderDto = new OrderDto(order);
            orderDtos.add(orderDto);
        }
        return orderDtos;
    }

    public static List<ProductDto> ProductToDtoList(List<Product> products) {
        if (products == null) return null;
        List<ProductDto> productDtos = new ArrayList<>();
        for (Product product : products) {
            ProductDto productDto = new ProductDto(product);
            productDtos.add(productDto);
        }
        return productDtos;
    }

    public static List<CancellationActDto> CancellationActToDtoList(List<CancellationAct> cancellationActs) {
        if (cancellationActs == null) return null;
        List<CancellationActDto> cancellationActDtos = new ArrayList<>();
        for (CancellationAct cancellationAct : cancellationActs) {
            CancellationActDto cancellationActDto = new CancellationActDto(cancellationAct);
            cancellationActDtos.add(cancellationActDto);
        }
        return cancellationActDtos;
    }

    public static List<RouteListDto> RouteListToDtoList(List<RouteList> routeLists) {
        if (routeLists == null) return null;
        List<RouteListDto> routeListDtos = new ArrayList<>();
        for (RouteList routeList : routeLists) {
            RouteListDto routeListDto = new RouteListDto(routeList);
            routeListDtos.add(routeListDto);
        }
        return routeListDtos;
    }

    public static List<UserDto> UserListToDtoList(List<User> userList) {
        if (userList == null) return null;
        List<UserDto> userDtoList = new ArrayList<>();
        for (User user : userList) {
            UserDto userDto = new UserDto(user);
            userDtoList.add(userDto);
        }
        return userDtoList;
    }

    public static List<ClientDto> ClientListToDtoList(List<Client> noneDtoList) {
        if (noneDtoList == null) return null;
        List<ClientDto> newDtoList = new ArrayList<>();
        for (Client element : noneDtoList) {
            ClientDto newTypedElemnt = new ClientDto(element);
            newDtoList.add(newTypedElemnt);
        }
        return newDtoList;
    }

    public static List<ClientDto> SolrClientsListToDtoList(List<SolrClient> solrClients) {
        if (solrClients == null) return null;
        List<ClientDto> clientDtos = new LinkedList<>();
        solrClients.forEach(solrClient -> clientDtos.add(new ClientDto(solrClient)));
        return clientDtos;
    }

    public static List<SolrClient> ClientsToSolrClientsList(Iterable<Client> clients) {
        List<SolrClient> solrClients = new LinkedList<>();
        clients.forEach(client -> solrClients.add(new SolrClient(client.getId(), client.getName(), client.getType())));
        return solrClients;
    }

    public static List<SolrStock> StockToSolrStocksList(Iterable<Stock> stocks) {
        List<SolrStock> solrStocks = new LinkedList<>();
        solrStocks.forEach(stock -> solrStocks.add(new SolrStock(
                stock.getId(), stock.getAddress(), stock.getName(), stock.getActive(),
                stock.getLng(), stock.getLat(), stock.getCompanyId()
        )));
        return solrStocks;
    }

    public static List<StockDto> StockListToDtoList(List<Stock> noneDtoList) {
        if (noneDtoList == null) return null;
        List<StockDto> newDtoList = new ArrayList<>();
        for (Stock element : noneDtoList) {
            StockDto newTypedElemnt = new StockDto(element);
            newDtoList.add(newTypedElemnt);
        }
        return newDtoList;
    }

    public static List<DriverDto> DriverListToDtoList(List<Driver> noneDtoList) {
        if (noneDtoList == null) return null;
        List<DriverDto> newDtoList = new ArrayList<>();
        for (Driver element : noneDtoList) {
            DriverDto newTypedElemnt = new DriverDto(element);
            newDtoList.add(newTypedElemnt);
        }
        return newDtoList;
    }

    public static List<AutoDto> AutoListToDtoList(List<Auto> noneDtoList) {
        if (noneDtoList == null) return null;
        List<AutoDto> newDtoList = new ArrayList<>();
        for (Auto element : noneDtoList) {
            AutoDto newTypedElemnt = new AutoDto(element);
            newDtoList.add(newTypedElemnt);
        }
        return newDtoList;
    }

    public static LocalDate convertToLocalDateViaInstant(Date dateToConvert) {
        if (dateToConvert == null) return null;
        return new java.sql.Date(dateToConvert.getTime()).toLocalDate();
    }

    public static List<CompanyDto> CompanyListToDtoList(List<Company> companies) {
        LinkedList<CompanyDto> companyDtos = new LinkedList<>();
        companies.forEach(company -> {
            companyDtos.add(new CompanyDto(company));
        });
        return companyDtos;
    }

    public static Object getSingleObjectFromList(List list) {
        Object object;
        try {
            object = list.get(0);
        } catch (ArrayIndexOutOfBoundsException e) {
            object = null;
        }
        return object;
    }

}
