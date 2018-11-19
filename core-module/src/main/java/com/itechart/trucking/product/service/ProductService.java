package com.itechart.trucking.product.service;

import com.itechart.trucking.consignment.entity.Consignment;
import com.itechart.trucking.product.entity.Product;
import com.itechart.trucking.product.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Product findProductById(Long id){
        return productRepository.findProductById(id);
    }

    public List<Product> findProductsByStatus(Integer status){
        return productRepository.findProductsByStatus(status);
    }

    public List<Product> findProductsByDescriptionLikeIgnoreCase(String description){
        return productRepository.findProductsByDescriptionLikeIgnoreCase(description);
    }

    public List<Product> findAllByConsignment(Consignment consignment){
        return productRepository.findAllByConsignment(consignment);
    }

    public Page<Product> findAllByConsignment(Consignment consignment, Pageable pageable){
        return productRepository.findAllByConsignment(consignment,pageable);
    }

    public Product save(Product product){
        return productRepository.save(product);
    }

    public Product update(Product product){
        return productRepository.save(product);
    }

    public void remove(Product product){
        productRepository.delete(product);
    }

}
