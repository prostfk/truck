package com.itechart.trucking.product.repository;

import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.product.entity.Product;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends CrudRepository<Product, Long> {

    Product findProductById(Long id);
    List<Product> findProductsByStatus(String status);
    List<Product> findProductsByDescriptionLikeIgnoreCase(String description);
    List<Product> findAllByConsignment(Consignment consignment);
}
