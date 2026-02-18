package com.ecommerce.service;

import com.ecommerce.dto.request.ProductRequest;
import com.ecommerce.dto.response.ProductResponse;
import com.ecommerce.entity.Category;
import com.ecommerce.entity.Product;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@org.springframework.transaction.annotation.Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return mapToResponse(product);
    }

    public ProductResponse createProduct(ProductRequest productRequest) {
        Category category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", productRequest.getCategoryId()));

        Product product = modelMapper.map(productRequest, Product.class);
        product.setCategory(category);

        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct);
    }

    public Page<ProductResponse> searchProducts(String query, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCase(query, pageable)
                .map(this::mapToResponse);
    }

    @org.springframework.transaction.annotation.Transactional
    public ProductResponse updateProduct(Long id, ProductRequest productRequest) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        Category category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", productRequest.getCategoryId()));

        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setStockQuantity(productRequest.getStockQuantity());
        product.setImageUrl(productRequest.getImageUrl());
        product.setCategory(category);

        Product updatedProduct = productRepository.save(product);
        return mapToResponse(updatedProduct);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        productRepository.delete(product);
    }

    private ProductResponse mapToResponse(Product product) {
        ProductResponse response = modelMapper.map(product, ProductResponse.class);
        response.setCategoryId(product.getCategory().getId());
        response.setCategoryName(product.getCategory().getName());
        return response;
    }
}
